export async function fetchSheets(sheetId, apiKey, range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Sheets API ${r.status}`);
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

  const subD = subRes.ok ? await subRes.json() : { subscribers: [] };
  const bcD  = bcRes.ok  ? await bcRes.json()  : { broadcasts: [] };
  const seqD = seqRes.ok ? await seqRes.json() : { sequences: [] };

  return {
    totalSubscribers: subD.pagination?.total || subD.subscribers?.length || 0,
    activeSubscribers: (subD.subscribers || []).filter(s => s.state === 'active').length,
    recentSubscribers: (subD.subscribers || []).slice(0, 10).map(s => ({
      name: [s.first_name, s.last_name].filter(Boolean).join(' ') || '—',
      email: s.email_address || s.email || '',
      createdAt: new Date(s.created_at),
      state: s.state,
    })),
    broadcasts: (bcD.broadcasts || []).map(b => ({
      subject: b.subject || b.email_subject || '—',
      sentAt: b.send_at ? new Date(b.send_at) : null,
      recipients: b.stats?.recipients || 0,
      openRate: b.stats?.open_rate || 0,
      clickRate: b.stats?.click_rate || 0,
    })),
    sequences: (seqD.sequences || []).map(s => ({
      name: s.name,
      subscriberCount: s.subscriber_count || 0,
      status: s.hold ? 'paused' : 'active',
    })),
  };
}
