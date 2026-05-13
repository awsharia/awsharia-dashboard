const https = require('https');

function kitGet(path, apiKey) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.kit.com',
      path,
      method: 'GET',
      headers: {
        'X-Kit-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { reject(new Error('Parse error: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function kitGetAll(basePath, apiKey, listKey) {
  let allItems = [];
  let cursor = null;
  let totalCount = 0;
  let page = 0;
  const maxPages = 50;

  do {
    page++;
    const sep = basePath.includes('?') ? '&' : '?';
    const path = cursor
      ? `${basePath}${sep}per_page=1000&after=${cursor}`
      : `${basePath}${sep}per_page=1000`;

    const result = await kitGet(path, apiKey);
    if (result.status !== 200) break;

    const body = result.body;
    const items = body[listKey] || body.data || [];
    allItems = allItems.concat(items);

    if (page === 1) {
      totalCount =
        body.pagination?.total_count ||
        body.pagination?.total ||
        body.meta?.total ||
        body.total_subscribers ||
        body.total ||
        0;
    }

    cursor = body.pagination?.end_cursor || body.pagination?.next_cursor || null;
    const hasMore = body.pagination?.has_next_page ?? (cursor !== null && items.length > 0);
    if (!hasMore) break;

  } while (page < maxPages);

  return { items: allItems, totalCount: totalCount || allItems.length };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const key = process.env.REACT_APP_KIT_KEY;
  if (!key) return res.status(400).json({ error: 'REACT_APP_KIT_KEY not set' });

  try {
    const [subData, bcResult, seqResult] = await Promise.all([
      kitGetAll('/v4/subscribers?sort_order=desc&sort_field=created_at', key, 'subscribers'),
      kitGet('/v4/broadcasts?per_page=100', key),
      kitGet('/v4/sequences?per_page=100', key),
    ]);

    const allSubscribers = subData.items;
    const totalSubscribers = subData.totalCount;
    const activeSubscribers = allSubscribers.filter(s => s.state === 'active').length;

    const bcList  = bcResult.body?.broadcasts || bcResult.body?.data || [];
    const seqList = seqResult.body?.sequences || seqResult.body?.data || [];

    const recentSubscribers = allSubscribers.slice(0, 10).map(s => ({
      name: [s.first_name, s.last_name].filter(Boolean).join(' ') || s.name || '—',
      email: s.email_address || s.email || '',
      createdAt: s.created_at || new Date().toISOString(),
      state: s.state || 'active',
    }));

    const now = new Date();
    const monthlyMap = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyMap[d.toLocaleString('en-GB', { month: 'short' })] = 0;
    }
    allSubscribers.forEach(s => {
      if (!s.created_at) return;
      const d = new Date(s.created_at);
      const monthsSince = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (monthsSince >= 0 && monthsSince < 6) {
        const k = d.toLocaleString('en-GB', { month: 'short' });
        if (monthlyMap[k] !== undefined) monthlyMap[k]++;
      }
    });
    const monthlyGrowth = Object.entries(monthlyMap).map(([month, count]) => ({ month, amount: count }));

    res.status(200).json({
      totalSubscribers,
      activeSubscribers,
      recentSubscribers,
      monthlyGrowth,
      broadcasts: bcList.map(b => ({
        subject: b.subject || b.email_subject || b.name || '—',
        sentAt: b.send_at || b.sent_at || b.published_at || null,
        recipients: b.stats?.recipients || b.recipient_count || b.sends_count || 0,
        openRate:   b.stats?.open_rate  || b.open_rate  || 0,
        clickRate:  b.stats?.click_rate || b.click_rate || 0,
      })),
      sequences: seqList.map(s => ({
        name: s.name || s.title || '—',
        subscriberCount: s.subscriber_count || s.active_subscriber_count || 0,
        status: s.hold || s.status === 'paused' ? 'paused' : 'active',
      })),
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
