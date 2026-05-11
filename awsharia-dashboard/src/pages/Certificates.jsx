import { useState, useEffect } from 'react';
import { PageHeader, Panel, PanelHead, TwoCol, Badge, fmtDate } from '../components';

function generateCertPDF(studentName, packageName, dateStr) {
  // Build PDF using canvas → data URI (no external lib needed)
  const canvas = document.createElement('canvas');
  canvas.width  = 1123; // A4 landscape @96dpi ~297mm
  canvas.height = 794;
  const c = canvas.getContext('2d');

  // Background
  c.fillStyle = '#FDF9F2';
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Outer gold border
  c.strokeStyle = '#B8860B';
  c.lineWidth = 3;
  c.strokeRect(24, 24, canvas.width-48, canvas.height-48);
  c.lineWidth = 1;
  c.strokeRect(30, 30, canvas.width-60, canvas.height-60);

  // Top bar
  c.fillStyle = '#B8860B';
  c.fillRect(24, 24, canvas.width-48, 8);
  c.fillRect(24, canvas.height-32, canvas.width-48, 8);

  // Corner dots
  [[40,40],[canvas.width-40,40],[40,canvas.height-40],[canvas.width-40,canvas.height-40]].forEach(([x,y])=>{
    c.beginPath(); c.arc(x,y,6,0,Math.PI*2); c.fillStyle='#B8860B'; c.fill();
  });

  // AWSharia wordmark
  c.font = 'bold 20px "DM Mono", monospace';
  c.fillStyle = '#B8860B';
  c.textAlign = 'center';
  c.letterSpacing = '4px';
  c.fillText('AWSHARIA', canvas.width/2, 90);

  // Thin rule
  c.strokeStyle = '#E0C870'; c.lineWidth = 1;
  c.beginPath(); c.moveTo(canvas.width/2-80,102); c.lineTo(canvas.width/2+80,102); c.stroke();

  // Certificate of Completion
  c.font = 'italic 16px "DM Serif Display", serif';
  c.fillStyle = '#8B6914';
  c.fillText('Certificate of Completion', canvas.width/2, 128);

  // This is to certify
  c.font = '14px "Instrument Sans", sans-serif';
  c.fillStyle = '#888';
  c.fillText('This is to certify that', canvas.width/2, 175);

  // Student name
  c.font = 'bold italic 52px "DM Serif Display", serif';
  c.fillStyle = '#1a1a1a';
  c.fillText(studentName, canvas.width/2, 248);

  // Name underline
  const nameW = c.measureText(studentName).width;
  c.strokeStyle = '#B8860B'; c.lineWidth = 1.5;
  c.beginPath(); c.moveTo(canvas.width/2-nameW/2,258); c.lineTo(canvas.width/2+nameW/2,258); c.stroke();

  // has successfully completed
  c.font = '14px "Instrument Sans", sans-serif';
  c.fillStyle = '#888';
  c.fillText('has successfully completed', canvas.width/2, 300);

  // Course title
  c.font = 'bold 22px "Instrument Sans", sans-serif';
  c.fillStyle = '#1a1a1a';
  c.fillText('Islamic Finance Certificate Course', canvas.width/2, 340);

  // Package
  c.font = 'italic 14px "DM Serif Display", serif';
  c.fillStyle = '#B8860B';
  c.fillText(packageName, canvas.width/2, 368);

  // Dots divider
  [-28,-14,0,14,28].forEach(offset => {
    c.beginPath(); c.arc(canvas.width/2+offset, 400, 3, 0, Math.PI*2);
    c.fillStyle='#B8860B'; c.fill();
  });

  // Based on CIMA
  c.font = '12px "DM Mono", monospace';
  c.fillStyle = '#aaa';
  c.fillText('Based on the CIMA Certificate — Introduction to Islamic Finance', canvas.width/2, 430);

  // Date (left) and Instructor (right)
  c.textAlign = 'center';
  c.font = '11px "DM Mono", monospace';
  c.fillStyle = '#999';
  c.fillText('Date of issue', 220, 510);
  c.font = 'bold 14px "Instrument Sans", sans-serif';
  c.fillStyle = '#1a1a1a';
  c.fillText(dateStr, 220, 530);
  c.strokeStyle = '#ccc'; c.lineWidth = 1;
  c.beginPath(); c.moveTo(120,545); c.lineTo(320,545); c.stroke();

  c.font = '11px "DM Mono", monospace';
  c.fillStyle = '#999';
  c.fillText('Course Instructor', canvas.width-220, 510);
  c.font = 'bold italic 18px "DM Serif Display", serif';
  c.fillStyle = '#8B6914';
  c.fillText('AWSharia', canvas.width-220, 532);
  c.beginPath(); c.moveTo(canvas.width-320,545); c.lineTo(canvas.width-120,545); c.stroke();

  // Seal
  c.fillStyle = '#FDF0D0';
  c.strokeStyle = '#B8860B'; c.lineWidth = 1;
  const sx = canvas.width/2, sy = 595, sw = 200, sh = 44;
  c.beginPath();
  c.roundRect(sx-sw/2, sy, sw, sh, 4);
  c.fill(); c.stroke();
  c.font = 'bold 11px "DM Mono", monospace';
  c.fillStyle = '#8B6914';
  c.letterSpacing = '1px';
  c.fillText('AWARDED WITH DISTINCTION', sx, sy+18);
  c.font = '10px "DM Mono", monospace';
  c.fillStyle = '#B8A060';
  c.fillText('awsharia.com', sx, sy+34);

  // Convert to PDF-like download (PNG for simplicity, looks like cert)
  return canvas.toDataURL('image/png');
}

export default function Certificates({ students, setStudents }) {
  const [previewName, setPreviewName] = useState('');
  const [previewImg, setPreviewImg] = useState(null);

  const ready  = students.filter(s => s.progress === 100 && !s.cert);
  const issued = students.filter(s => s.cert);

  const eligible = students.filter(s => s.progress === 100 || s.cert);

  useEffect(() => {
    if (previewName) {
      const s = students.find(x => x.name === previewName);
      const date = s?.certDate || new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
      setPreviewImg(generateCertPDF(previewName, s?.package || 'Islamic Finance Certificate Course', date));
    }
  }, [previewName, students]);

  const download = (name) => {
    const s = students.find(x => x.name === name);
    const date = s?.certDate || new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
    const img = generateCertPDF(name, s?.package || 'Islamic Finance Certificate Course', date);
    const a = document.createElement('a');
    a.href = img;
    a.download = `AWSharia-Certificate-${name.replace(/\s+/g,'-')}.png`;
    a.click();
  };

  const issue = (name) => {
    const dateStr = new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
    setStudents(prev => prev.map(s => s.name === name ? {...s, cert:true, certDate:dateStr} : s));
    download(name);
  };

  const btnStyle = {
    fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.06em', textTransform:'uppercase',
    padding:'6px 14px', border:'1px solid var(--rule)', background:'var(--white)',
    transition:'all 0.15s', cursor:'pointer',
  };

  return (
    <>
      <PageHeader title="Certificates" subtitle="Generate and issue print-ready completion certificates" />

      {/* Preview panel */}
      <div style={{ border:'1px solid var(--rule)', marginBottom:24 }}>
        <PanelHead title="Certificate preview" meta="downloads as PNG — print-ready" />
        <div style={{ padding:24, background:'var(--surface)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {previewImg
            ? <img src={previewImg} alt="Certificate preview" style={{ maxWidth:'100%', border:'1px solid var(--rule)', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }} />
            : <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--ink-4)', padding:'60px 0' }}>Select a student below to preview their certificate</div>
          }
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--rule)', display:'flex', gap:12, alignItems:'flex-end', flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:200 }}>
            <label style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--ink-3)', display:'block', marginBottom:6 }}>Preview for student</label>
            <select value={previewName} onChange={e=>setPreviewName(e.target.value)}
              style={{ width:'100%', padding:'8px 12px', border:'1px solid var(--rule)', fontSize:13, background:'var(--white)', outline:'none' }}>
              <option value="">— select a student —</option>
              {eligible.map(s=><option key={s.name} value={s.name}>{s.name}{s.cert?' ✓':''}</option>)}
            </select>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button style={{ ...btnStyle, background:'var(--white)' }}
              onMouseEnter={e=>{e.target.style.background='var(--ink)';e.target.style.color='var(--white)';}}
              onMouseLeave={e=>{e.target.style.background='var(--white)';e.target.style.color='var(--ink)';}}
              onClick={()=>{ if(previewName) download(previewName); else alert('Select a student first.'); }}>
              Download PNG
            </button>
            <button style={{ ...btnStyle, background:'var(--ink)', color:'var(--white)', border:'1px solid var(--ink)' }}
              onClick={()=>{ if(previewName) issue(previewName); else alert('Select a student first.'); }}>
              Issue &amp; Download
            </button>
          </div>
        </div>
      </div>

      <TwoCol>
        <div style={{ border:'1px solid var(--rule)' }}>
          <PanelHead title="Ready to certify" meta="100% completion" />
          {ready.length === 0
            ? <div style={{ padding:'40px 20px', textAlign:'center', fontFamily:'var(--font-mono)', fontSize:11, color:'var(--ink-4)' }}>No pending certificates</div>
            : ready.map(s=>(
              <div key={s.name} style={{ padding:'14px 20px', borderBottom:'1px solid var(--rule)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, marginBottom:2 }}>{s.name}</div>
                  <div style={{ fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)' }}>{s.package} · 100% complete</div>
                </div>
                <button style={btnStyle}
                  onMouseEnter={e=>{e.target.style.background='var(--ink)';e.target.style.color='var(--white)';}}
                  onMouseLeave={e=>{e.target.style.background='var(--white)';e.target.style.color='var(--ink)';}}
                  onClick={()=>issue(s.name)}>Issue cert</button>
              </div>
            ))
          }
        </div>

        <div style={{ border:'1px solid var(--rule)' }}>
          <PanelHead title="Recently issued" meta={`${issued.length} issued`} />
          {issued.length === 0
            ? <div style={{ padding:'40px 20px', textAlign:'center', fontFamily:'var(--font-mono)', fontSize:11, color:'var(--ink-4)' }}>No certificates issued yet</div>
            : issued.map(s=>(
              <div key={s.name} style={{ padding:'14px 20px', borderBottom:'1px solid var(--rule)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, marginBottom:2 }}>{s.name}</div>
                  <div style={{ fontSize:11, color:'var(--ink-3)', fontFamily:'var(--font-mono)' }}>{s.certDate || '—'}</div>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <Badge variant="green">Issued</Badge>
                  <button style={{ ...btnStyle, fontSize:9 }}
                    onMouseEnter={e=>{e.target.style.background='var(--ink)';e.target.style.color='var(--white)';}}
                    onMouseLeave={e=>{e.target.style.background='var(--white)';e.target.style.color='var(--ink)';}}
                    onClick={()=>download(s.name)}>Reprint</button>
                </div>
              </div>
            ))
          }
        </div>
      </TwoCol>
    </>
  );
}
