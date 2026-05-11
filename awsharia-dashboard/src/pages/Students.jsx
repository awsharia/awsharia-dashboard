import { useState } from 'react';
import { PageHeader, Panel, Table, Tr, Td, Badge, ProgressBar, statusBadge } from '../components';

export default function Students({ students }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  let list = students;
  if (filter !== 'all') list = list.filter(s => s.status === filter);
  if (search) list = list.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Students" subtitle="All enrolled students from your Google Sheet tracker" />
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          style={{
            flex:1, padding:'9px 14px', border:'1px solid var(--rule)',
            fontSize:13, outline:'none', background:'var(--white)',
          }}
        />
        {['all','active','completed','pending'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:'9px 16px', border:'1px solid var(--rule)',
            fontFamily:'var(--font-mono)', fontSize:11,
            background: filter===f ? 'var(--ink)' : 'var(--white)',
            color: filter===f ? 'var(--white)' : 'var(--ink-3)',
            textTransform:'capitalize',
          }}>{f}</button>
        ))}
      </div>
      <Panel>
        <Table headers={['Name','Email','Package','Enrolled','Progress','Status']}>
          {list.length === 0
            ? <tr><td colSpan={6} style={{ padding:'40px 20px', textAlign:'center', fontFamily:'var(--font-mono)', fontSize:11, color:'var(--ink-4)' }}>No students found</td></tr>
            : list.map((s,i) => (
              <Tr key={i}>
                <Td>{s.name}</Td>
                <Td muted>{s.email}</Td>
                <Td><Badge>{s.package}</Badge></Td>
                <Td muted>{s.enrolled}</Td>
                <Td style={{ minWidth:140 }}><ProgressBar pct={s.progress} /></Td>
                <Td><Badge variant={statusBadge(s.status)}>{s.status}</Badge></Td>
              </Tr>
            ))
          }
        </Table>
      </Panel>
    </>
  );
}
