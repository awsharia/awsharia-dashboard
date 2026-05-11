import { KpiGrid, KpiCard, Panel, PanelHead, Table, Tr, Td, Badge, BarChart, TwoCol, fmt, fmtDate } from '../components';
import { DEMO_MONTHLY } from '../demo';

export default function Overview({ students, payments, monthlyRevenue }) {
  const now = new Date();
  const thirtyAgo = new Date(now - 30 * 864e5);
  const rev30 = payments.filter(p => p.date >= thirtyAgo && p.status === 'succeeded').reduce((s, p) => s + p.amount, 0);
  const comp = students.filter(s => s.status === 'completed').length;
  const compPct = students.length ? Math.round(comp / students.length * 100) : 0;
  const certs = students.filter(s => s.cert).length;

  const chartData = monthlyRevenue.length ? monthlyRevenue : DEMO_MONTHLY;
  const chartTotal = chartData.reduce((s, m) => s + m.amount, 0);

  const pkgCount = {};
  payments.forEach(p => { pkgCount[p.description] = (pkgCount[p.description] || 0) + 1; });
  const pkgEntries = Object.entries(pkgCount).sort((a, b) => b[1] - a[1]);
  const total = payments.length;

  const exportCSV = () => {
    const headers = ['Name','Email','Package','Enrolled','Progress','Status','Certificate'];
    const rows = students.map(s => [s.name,s.email,s.package,s.enrolled,s.progress+'%',s.status,s.cert?'Yes':'No']);
    const csv = [headers,...rows].map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
    a.download = `awsharia-students-${now.toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily:'var(--font-serif)', fontSize:34, fontWeight:400, letterSpacing:'-0.02em', marginBottom:4 }}>Overview</h1>
        <p style={{ fontSize:13, color:'var(--ink-3)' }}>{now.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
      </div>

      <KpiGrid>
        <KpiCard label="Total students" value={students.length} sub="enrolled" />
        <KpiCard label="Revenue (30d)" value={fmt(rev30)} sub="from Sheets/Stripe" />
        <KpiCard label="Completion rate" value={compPct + '%'} sub="course completed" />
        <KpiCard label="Certificates issued" value={certs} sub="this cohort" />
      </KpiGrid>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:20, marginBottom:20 }}>
        {/* Recent payments */}
        <Panel>
          <PanelHead title="Recent payments" meta="from Sheets" />
          <Table headers={['Name','Package','Amount','Date']}>
            {payments.slice(0,8).map((p,i) => (
              <Tr key={i}>
                <Td><div>{p.name}</div><div style={{fontSize:11,color:'var(--ink-3)',fontFamily:'var(--font-mono)'}}>{p.email}</div></Td>
                <Td><Badge>{p.description}</Badge></Td>
                <Td mono>{fmt(p.amount, p.currency)}</Td>
                <Td muted>{fmtDate(p.date)}</Td>
              </Tr>
            ))}
          </Table>
        </Panel>

        {/* Package split */}
        <Panel>
          <PanelHead title="Package split" meta="all time" />
          <div style={{ padding: '16px 20px' }}>
            {pkgEntries.map(([k, v], i) => {
              const pct = total ? Math.round(v/total*100) : 0;
              const colors = ['var(--ink)','var(--ink-2)','var(--ink-4)'];
              return (
                <div key={k} style={{ marginBottom: 14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:12 }}>{k}</span>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--ink-3)' }}>{v} · {pct}%</span>
                  </div>
                  <div style={{ height:2, background:'var(--rule)', borderRadius:1 }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:colors[i]||'#aaa', borderRadius:1 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Quick actions */}
        <Panel>
          <PanelHead title="Quick actions" />
          {[
            ['Export student CSV', exportCSV],
            ['Open Google Sheets', () => window.open('https://sheets.google.com','_blank')],
            ['Open Stripe dashboard', () => window.open('https://dashboard.stripe.com','_blank')],
            ['Open Kit dashboard', () => window.open('https://app.kit.com','_blank')],
          ].map(([label, fn]) => (
            <div key={label} style={{ padding:'13px 20px', borderBottom:'1px solid var(--rule)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:13 }}>{label}</span>
              <button onClick={fn} style={{
                fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.06em',
                textTransform:'uppercase', padding:'5px 12px',
                border:'1px solid var(--rule)', background:'var(--white)',
                transition:'all 0.15s',
              }}
              onMouseEnter={e=>{e.target.style.background='var(--ink)';e.target.style.color='var(--white)';}}
              onMouseLeave={e=>{e.target.style.background='var(--white)';e.target.style.color='var(--ink)';}}
              >Go ↗</button>
            </div>
          ))}
        </Panel>
      </div>

      {/* Revenue chart */}
      <Panel>
        <PanelHead title="Revenue — last 6 months" meta={`£${chartTotal.toLocaleString()} total`} />
        <div style={{ padding: 24 }}>
          <BarChart data={chartData} maxHeight={120} />
        </div>
      </Panel>
    </>
  );
}
