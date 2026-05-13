import { useState, useEffect, useCallback } from 'react';
import Overview from './pages/Overview';
import Students from './pages/Students';
import Revenue from './pages/Revenue';
import Certificates from './pages/Certificates';
import Email from './pages/Email';
import Config from './pages/Config';
import { fetchSheets, fetchStripe, fetchKit } from './api';
import { DEMO_STUDENTS, DEMO_PAYMENTS, DEMO_MONTHLY, DEMO_KIT } from './demo';

const TABS = ['Overview','Students','Revenue','Certificates','Email'];

export default function App() {
  const [tab, setTab] = useState('Overview');
  const [showConfig, setShowConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncTime, setSyncTime] = useState(null);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [kitData, setKitData] = useState(null);
  const [stripeBalance, setStripeBalance] = useState(null);

  const hasSheets = () => !!(
    process.env.REACT_APP_GSHEETS_KEY &&
    process.env.REACT_APP_STUDENTS_SHEET_ID
  );

  const loadLive = useCallback(async () => {
    setLoading(true);
    setError(null);
    let resolvedStudents = DEMO_STUDENTS;
    let resolvedPayments = DEMO_PAYMENTS;
    let resolvedMonthly  = DEMO_MONTHLY;
    let anyLiveData      = false;
    try {
      try {
        const stripeData = await fetchStripe();
        if (stripeData.payments?.length) {
          resolvedPayments = stripeData.payments.map(p => ({ ...p, date: new Date(p.date) }));
          resolvedMonthly  = stripeData.monthlyRevenue || [];
          if (stripeData.balance) setStripeBalance(stripeData.balance);
          anyLiveData = true;
        }
      } catch { }
      if (hasSheets()) {
        try {
          const s = await fetchSheets(process.env.REACT_APP_STUDENTS_SHEET_ID, process.env.REACT_APP_GSHEETS_KEY, 'Students!A2:H500');
          const parsed = (s.values || []).map(r => ({
            name: r[0]||'', email: r[1]||'', package: r[2]||'',
            enrolled: r[3]||'', progress: parseInt(r[4])||0,
            status: (r[5]||'pending').toLowerCase(),
            cert: (r[6]||'').toLowerCase() === 'yes', certDate: r[7]||'',
          })).filter(x => x.name);
          if (parsed.length) { resolvedStudents = parsed; anyLiveData = true; }
        } catch (e) { setError('Google Sheets: ' + e.message); }
        if (resolvedPayments === DEMO_PAYMENTS && process.env.REACT_APP_PAYMENTS_SHEET_ID) {
          try {
            const p = await fetchSheets(process.env.REACT_APP_PAYMENTS_SHEET_ID, process.env.REACT_APP_GSHEETS_KEY, 'Payments!A2:G500');
            const parsed = (p.values || []).map(r => ({
              name: r[0]||'Unknown', email: r[1]||'', description: r[2]||'—',
              amount: parseFloat(r[3])||0, currency: (r[4]||'gbp').toLowerCase(),
              date: r[5] ? new Date(r[5]) : new Date(),
              status: (r[6]||'succeeded').toLowerCase(),
            })).filter(x => x.amount > 0);
            if (parsed.length) { resolvedPayments = parsed; anyLiveData = true; }
          } catch { }
        }
      }
      if (process.env.REACT_APP_KIT_KEY) {
        try { setKitData(await fetchKit(process.env.REACT_APP_KIT_KEY)); anyLiveData = true; }
        catch { setKitData(DEMO_KIT); }
      } else {
        setKitData(DEMO_KIT);
      }
      setStudents(resolvedStudents);
      setPayments(resolvedPayments);
      setMonthlyRevenue(resolvedMonthly);
      setIsDemo(!anyLiveData);
      setSyncTime(new Date());
    } catch (e) {
      setError('Could not load: ' + e.message);
      setStudents(DEMO_STUDENTS); setPayments(DEMO_PAYMENTS);
      setMonthlyRevenue(DEMO_MONTHLY); setKitData(DEMO_KIT); setIsDemo(true);
    } finally { setLoading(false); }
  }, []); // eslint-disable-line

  useEffect(() => { loadLive(); }, [loadLive]);

  const sharedProps = { students, setStudents, payments, monthlyRevenue, kitData, stripeBalance, isDemo };

  if (showConfig) return <Config onDemo={loadLive} />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 220, flexShrink: 0, background: 'var(--ink)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--gold)', marginBottom: 3 }}>AWSharia</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>{isDemo ? 'DEMO MODE' : 'LIVE'}</div>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px', marginBottom: 2, borderRadius: 6, background: tab === t ? 'rgba(184,134,11,0.18)' : 'transparent', color: tab === t ? 'var(--gold)' : 'rgba(255,255,255,0.55)', border: 'none', fontSize: 13, fontWeight: 400, transition: 'all 0.15s' }}>{t}</button>
          ))}
        </nav>
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>{syncTime ? 'Synced ' + syncTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—'}</div>
          <button onClick={loadLive} style={{ width: '100%', padding: '7px 0', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{loading ? 'Syncing…' : 'Refresh'}</button>
          <button onClick={() => setShowConfig(true)} style={{ width: '100%', padding: '7px 0', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>Settings</button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '40px 48px', maxWidth: 1100, overflowX: 'hidden' }}>
        {error && <div style={{ background: 'var(--amber-bg)', border: '1px solid var(--gold-mid)', padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--amber)', marginBottom: 24, borderRadius: 2 }}>⚠ {error}</div>}
        {tab === 'Overview'     && <Overview {...sharedProps} />}
        {tab === 'Students'     && <Students {...sharedProps} />}
        {tab === 'Revenue'      && <Revenue  {...sharedProps} />}
        {tab === 'Certificates' && <Certificates {...sharedProps} />}
        {tab === 'Email'        && <Email {...sharedProps} />}
      </main>
    </div>
  );
}
