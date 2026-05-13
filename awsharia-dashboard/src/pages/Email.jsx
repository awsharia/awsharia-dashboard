import { PageHeader, KpiGrid, KpiCard, Panel, PanelHead, Table, Tr, Td, Badge, BarChart, TwoCol, fmtDate } from '../components';
import { DEMO_KIT } from '../demo';

export default function Email({ kitData }) {
  const d = kitData || DEMO_KIT;
  const lastBc = d.broadcasts?.[0];

  const growth = d.monthlyGrowth?.length
    ? d.monthlyGrowth
    : Array.from({ length: 6 }, (_, i) => {
        const months = ['Dec','Jan','Feb','Mar','Apr','May'];
        return { month: months[i], amount: Math.round((d.totalSubscribers || 0) * (0.57 + i * 0.086)) };
      });

  const growthNet = growth.length > 1
    ? (growth[growth.length - 1].amount - growth[0].amount)
    : 0;

  return (
    <>
      <PageHeader title="Email" subtitle="Kit subscriber data, broadcasts and sequences" />

      <KpiGrid>
        <KpiCard label="Total subscribers"  value={(d.totalSubscribers  || 0).toLocaleString()} sub="all statuses" />
        <KpiCard label="Active subscribers" value={(d.activeSubscribers || 0).toLocaleString()} sub="confirmed + active" />
        <KpiCard label="Last broadcast"     value={lastBc ? Math.round((lastBc.openRate || 0) * 100) + '%' : '—'} sub={lastBc ? 'open rate — ' + fmtDate(lastBc.sentAt) : 'open rate'} />
        <KpiCard label="Active sequences"   value={(d.sequences || []).filter(s => s.status === 'active').length} sub="running automations" />
      </KpiGrid>

      <TwoCol style={{ marginBottom: 20 }}>
        <Panel>
          <PanelHead title="Recent broadcasts" meta={`${(d.broadcasts || []).length} total`} />
          <Table headers={['Subject','Sent','Recipients','Opens','Clicks']}>
            {(d.broadcasts || []).length === 0
              ? <tr><td colSpan={5} style={{ padding:'32px 20px', textAlign:'center', fontFamily:'var(--font-mono)', fontSize:11, color:'var(--ink-4)' }}>No broadcasts found</td></tr>
              : (d.broadcasts || []).map((b, i) => (
                <Tr key={i}>
                  <Td style={{ maxWidth:220, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{b.subject}</Td>
                  <Td muted>{b.sentAt ? fmtDate(b.sentAt) : 'Scheduled'}</Td>
                  <Td mono>{(b.recipients || 0).toLocaleString()}</Td>
                  <Td mono>{Math.round((b.openRate  || 0) * 100)}%</Td>
                  <Td mono>{Math.round((b.clickRate || 0) * 100)}%</Td>
                </Tr>
              ))
            }
          </Table>
        </Panel>
        <Panel>
          <PanelHead title="Sequences" meta="automations" />
          <Table headers={['Name','Subscribers','Status']}>
            {(d.sequences || []).length === 0
              ? <tr><td colSpan={3} style={{ padding:'32px 20px', textAlign:'center', fontFamily:'var(--font-mono)', fontSize:11, color:'var(--ink-4)' }}>No sequences found</td></tr>
              : (d.sequences || []).map((s, i) => (
                <Tr key={i}>
                  <Td>{s.name}</Td>
                  <Td mono>{(s.subscriberCount || 0).toLocaleString()}</Td>
                  <Td><Badge variant={s.status === 'active' ? 'green' : 'amber'}>{s.status}</Badge></Td>
                </Tr>
              ))
            }
          </Table>
        </Panel>
      </TwoCol>

      <Panel style={{ marginBottom: 20 }}>
        <PanelHead title="New subscribers per month" meta={growthNet > 0 ? `+${growthNet.toLocaleString()} over 6 months` : 'last 6 months'} />
        <div style={{ padding: 24 }}><BarChart data={growth} maxHeight={120} /></div>
      </Panel>

      <Panel>
        <PanelHead title="Recent subscribers" meta="last 10" />
        <Table headers={['Name','Email','Subscribed','State']}>
          {(d.recentSubscribers || []).map((s, i) => (
            <Tr key={i}>
              <Td>{s.name}</Td>
              <Td muted>{s.email}</Td>
              <Td muted>{fmtDate(s.createdAt)}</Td>
              <Td><Badge variant={s.state === 'active' ? 'green' : 'gray'}>{s.state || '—'}</Badge></Td>
            </Tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}
