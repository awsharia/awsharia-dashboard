export async function fetchSheets(sheetId, apiKey, range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Sheets API ${r.status}`);
  return r.json();
}

export async function fetchStripe() {
  const r = await fetch('/api/stripe');
  if (!r.ok) throw new Error(`Stripe proxy ${r.status}`);
  return r.json();
}

export async function fetchKit(apiKey) {
  const headers = { 'X-Kit-Api-Key': apiKey, 'Content-Type': 'application/json' };
  const base = 'https://api.kit.com/v4';

  const [subRes, bcRes, seqRes] = await Promise.all([
    fetch(`${base}/subscribers?per_page=10&sort_order=desc&sort_field=created_at`, { headers }),
    fetch(`${base}/broadcasts?per_page=10`, { headers }),
    fetch(`${base}/sequences`, { headers }),
  ]);

  const subD = subRes.ok ? await subRes.json() : {};
  const bcD  = bcRes.ok  ? await bcRes.json()  : {};
  const seqD = seqRes.ok ? await seqRes.json() : {};

  const subList = subD.subscribers || subD.data || [];
  const bcList  = bcD.broadcasts   || bcD.data  || [];
  const seqList = seqD.sequences   || seqD.data  || [];

  const totalSubscribers =
    subD.pagination?.total_count ||
    subD.pagination?.total ||
    subD.meta?.total ||
    subD.total_subscribers ||
    subD.total ||
    subList.length ||
    0;

  const activeSubscribers =
    subD.pagination?.active_count ||
    subList.filter(s => s.state === 'active').length ||
    0;

  return {
    totalSubscribers,
    activeSubscribers,
    recentSubscribers: subList.slice(0, 10).map(s => ({
      name: [s.first_name, s.last_name].filter(Boolean).join(' ') || s.name || '—',
      email: s.email_address || s.email || '',
      createdAt: s.created_at ? new Date(s.created_at) : new Date(),
      state: s.state || 'active',
    })),
    broadcasts: bcList.map(b => ({
      subject: b.subject || b.email_subject || b.name || '—',
      sentAt: (b.send_at || b.sent_at || b.published_at)
        ? new Date(b.send_at || b.sent_at || b.published_at)
        : null,
      recipients: b.stats?.recipients || b.recipient_count || b.sends_count || 0,
      openRate:   b.stats?.open_rate  || b.open_rate  || 0,
      clickRate:  b.stats?.click_rate || b.click_rate || 0,
    })),
    sequences: seqList.map(s => ({
      name: s.name || s.title || '—',
      subscriberCount: s.subscriber_count || s.active_subscriber_count || 0,
      status: s.hold || s.status === 'paused' ? 'paused' : 'active',
    })),
  };
}
