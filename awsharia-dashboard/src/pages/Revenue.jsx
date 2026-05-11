import { PageHeader, Panel, PanelHead, Table, Tr, Td, Badge, BarChart, TwoCol, fmt, fmtDate } from '../components';
import { DEMO_MONTHLY } from '../demo';

export default function Revenue({ payments, monthlyRevenue }) {
  const now = new Date();
  const thirtyAgo = new Date(now - 30*864e5);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const succ = payments.filter(p => p.status === 'succeeded');
  const rev30    = succ.filter(p => p.date >= thirtyAgo).reduce((s,p) => s+p.amount, 0);
  const revMonth = succ.filter(p => p.date >= startOfMonth).reduce((s,p) => s+p.amount, 0);
  const revTotal = succ.reduce((s,p) => s+p.amount, 0);

  const pkgRev = {};
  succ.forEach(p => { pkgRev[p.description] = (pkgRev[p.description]||0) + p.amount; });
  const pkgEntries = Object.entries(pkgRev).sort((a,b)=>b[1]-a[1]);
  const totalRev = pkgEntries.reduce((s,[,v])=>s+v, 0);

  const chartData = monthlyRevenue.length ? monthlyRevenue : DEMO_MONTHLY;

  return (
    <>
      <PageHeader title="Revenue" subtitle="Live from your Payments Google Sheet — all figures in GBP" />

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'var(--rule)', border:'1px solid var(--rule)', marginBottom:28 }}>
        {[['This month', fmt(revMonth)],['Last 30 days', fmt(rev30)],['All time', fmt(revTotal)]].map(([l,v])=>(
          <div key={l} style={{ background:'var(--white)', padding:'20px 24px' }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--ink-3)', marginBottom:8 }}>{l}</div>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:26, fontWeight:400 }}>{v}</div>
          </div>
        ))}
      </div>

      <Panel style={{ marginBottom: 24 }}>
        <PanelHead title="Revenue — last 6 months" meta={`£${chartData.reduce((s,m)=>s+m.amount,0).toLocaleString()} total`} />
        <div style={{ padding: 24 }}><BarChart data={chartData} maxHeight={120} /></div>
      </Panel>

      <TwoCol>
        <Panel>
          <PanelHead title="All payments" meta={`${payments.length} total`} />
          <Table headers={['Customer','Description','Amount','Status','Date']}>
            {payments.slice(0,20).map((p,i)=>(
              <Tr key={i}>
                <Td><div>{p.name}</div><div style={{fontSize:11,color:'var(--ink-3)',fontFamily:'var(--font-mono)'}}>{p.email}</div></Td>
                <Td muted>{p.description}</Td>
                <Td mono>{fmt(p.amount,p.currency)}</Td>
                <Td><Badge variant={p.status==='succeeded'?'green':'amber'}>{p.status}</Badge></Td>
                <Td muted>{fmtDate(p.date)}</Td>
              </Tr>
            ))}
          </Table>
        </Panel>
        <Panel>
          <PanelHead title="Revenue by package" />
          <div style={{ padding:'16px 20px' }}>
            {pkgEntries.map(([k,v],i)=>{
              const pct = totalRev ? Math.round(v/totalRev*100) : 0;
              const colors = ['var(--ink)','var(--ink-2)','var(--ink-4)'];
              return (
                <div key={k} style={{ marginBottom:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:13 }}>{k}</span>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--ink-3)' }}>£{v.toLocaleString()} · {pct}%</span>
                  </div>
                  <div style={{ height:3, background:'var(--rule)', borderRadius:2 }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:colors[i]||'#aaa', borderRadius:2 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </TwoCol>
    </>
  );
}
