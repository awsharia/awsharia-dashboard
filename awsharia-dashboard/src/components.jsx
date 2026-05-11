export const fmt = (amount, currency = 'gbp') => {
  const sym = currency === 'gbp' ? '£' : currency === 'usd' ? '$' : currency.toUpperCase() + ' ';
  return sym + Number(amount).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

export const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 34, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 4 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>{subtitle}</p>}
    </div>
  );
}

export function KpiGrid({ children }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
      gap: 1, background: 'var(--rule)', border: '1px solid var(--rule)', marginBottom: 36,
    }}>{children}</div>
  );
}

export function KpiCard({ label, value, sub }) {
  return (
    <div style={{ background: 'var(--white)', padding: '24px 20px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 34, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{sub}</div>}
    </div>
  );
}

export function Panel({ children, style }) {
  return <div style={{ border: '1px solid var(--rule)', background: 'var(--white)', ...style }}>{children}</div>;
}

export function PanelHead({ title, meta }) {
  return (
    <div style={{ padding: '16px 20px 14px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>{title}</span>
      {meta && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-4)' }}>{meta}</span>}
    </div>
  );
}

export function Table({ headers, children, emptyMsg = 'No data' }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {headers.map(h => (
            <th key={h} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--ink-4)', fontWeight: 400,
              textAlign: 'left', padding: '10px 20px', borderBottom: '1px solid var(--rule)',
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export function Tr({ children, onClick }) {
  return (
    <tr onClick={onClick} style={{
      borderBottom: '1px solid var(--rule)',
      transition: 'background 0.1s',
      cursor: onClick ? 'pointer' : 'default',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >{children}</tr>
  );
}

export function Td({ children, mono, muted, style }) {
  return (
    <td style={{
      padding: '12px 20px', fontSize: mono ? 12 : 13,
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
      color: muted ? 'var(--ink-3)' : 'var(--ink)',
      verticalAlign: 'middle', ...style,
    }}>{children}</td>
  );
}

export function Badge({ children, variant = 'gray' }) {
  const styles = {
    green: { background: 'var(--green-bg)', color: 'var(--green)' },
    blue:  { background: 'var(--blue-bg)',  color: 'var(--blue)' },
    dark:  { background: 'var(--ink)',      color: 'var(--white)' },
    amber: { background: 'var(--amber-bg)', color: 'var(--amber)' },
    gray:  { background: 'var(--surface)',  color: 'var(--ink-3)', border: '1px solid var(--rule)' },
    gold:  { background: 'var(--gold-light)', color: '#8B6914', border: '1px solid var(--gold-mid)' },
  };
  return (
    <span style={{
      display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: 10,
      letterSpacing: '0.04em', padding: '3px 8px', borderRadius: 2,
      ...styles[variant],
    }}>{children}</span>
  );
}

export function ProgressBar({ pct }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 3, background: 'var(--rule)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--ink)', borderRadius: 2, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', minWidth: 32, textAlign: 'right' }}>{pct}%</span>
    </div>
  );
}

export function BarChart({ data, maxHeight = 100 }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.amount));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: maxHeight }}>
      {data.map(d => {
        const h = max ? Math.max(3, Math.round((d.amount / max) * (maxHeight - 20))) : 3;
        return (
          <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div title={`£${d.amount.toLocaleString()}`} style={{
              width: '100%', height: h, background: 'var(--ink)', borderRadius: '1px 1px 0 0',
              transition: 'height 0.5s ease',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-4)' }}>{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

export function TwoCol({ children, style }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, ...style }}>{children}</div>;
}

export function statusBadge(status) {
  if (status === 'completed') return 'green';
  if (status === 'active') return 'dark';
  if (status === 'pending') return 'amber';
  return 'gray';
}
