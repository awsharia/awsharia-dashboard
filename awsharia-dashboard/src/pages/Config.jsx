export default function Config({ onDemo }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--white)', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 520, border: '1px solid var(--rule)', padding: 48 }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 400, marginBottom: 6 }}>AWSharia</h1>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 36, lineHeight: 1.6 }}>
          This dashboard reads data from Google Sheets and Kit via environment variables set in Vercel. Keys are never stored in your browser.
        </p>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--rule)', padding: 20, marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, marginBottom: 12, letterSpacing: '0.06em' }}>
            ENVIRONMENT VARIABLES NEEDED
          </div>
          {[
            ['REACT_APP_GSHEETS_KEY', 'Google Sheets API key (required)'],
            ['REACT_APP_STUDENTS_SHEET_ID', 'Sheet ID for student tracker (required)'],
            ['REACT_APP_PAYMENTS_SHEET_ID', 'Sheet ID for payments (optional)'],
            ['REACT_APP_KIT_KEY', 'Kit API key (optional)'],
          ].map(([k, v]) => (
            <div key={k} style={{ marginBottom: 10 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink)', marginBottom: 2 }}>{k}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{v}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.6, marginBottom: 28 }}>
          Set these in your Vercel project → Settings → Environment Variables, then redeploy. See the setup guide below.
        </p>

        <button onClick={onDemo} style={{
          width: '100%', padding: '12px 0',
          background: 'var(--ink)', color: 'var(--white)',
          border: 'none', fontSize: 13, fontFamily: 'var(--font-sans)',
          fontWeight: 500, cursor: 'pointer',
        }}>
          Load demo data instead →
        </button>

        <div style={{ marginTop: 28, paddingTop: 28, borderTop: '1px solid var(--rule)', fontSize: 11, color: 'var(--ink-4)', lineHeight: 1.7, fontFamily: 'var(--font-mono)' }}>
          <strong style={{ color: 'var(--ink-3)' }}>Quick setup:</strong><br />
          1. Google Cloud Console → Enable Sheets API → Create API key<br />
          2. Create Google Sheet with columns: Name, Email, Package, Enrolled, Progress%, Status, Cert (Yes/No), Cert Date<br />
          3. Share the Sheet publicly (viewer access)<br />
          4. Copy the Sheet ID from its URL<br />
          5. Paste keys into Vercel environment variables
        </div>
      </div>
    </div>
  );
}
