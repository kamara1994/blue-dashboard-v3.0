import { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'

// ══ DATA ══
const REAL = {
  m:{applied:127,pipe:23,intv:5,resp:'14.2%',prob:73},
  w:[12,18,22,19,24,16,8,8],
  b:[{b:'LinkedIn',i:2,c:'#0A66C2'},{b:'Handshake',i:1,c:'#FF6B35'},{b:'Indeed',i:1,c:'#2164F3'},{b:'CrowdStrike',i:1,c:'#E8392B'},{b:'Dice',i:0,c:'#00C1D4'},{b:'USAJobs',i:0,c:'#1a5c8a'}],
  pipeline:[
    {stage:'Queued',col:'rgba(120,120,140,.7)',items:[{co:'Fortinet',ro:'Security Intern',ats:82,kw:'12/18 kw'},{co:'Accenture',ro:'Cyber Associate',ats:78,kw:'10/16 kw'}]},
    {stage:'Applied',col:'rgba(0,212,255,.7)',items:[{co:'Booz Allen',ro:'SOC Analyst',ats:88,kw:'15/18 kw'},{co:'KPMG',ro:'Cyber Intern',ats:85,kw:'14/17 kw'},{co:'Northrop',ro:'Cyber Eng I',ats:80,kw:'11/15 kw'}]},
    {stage:'Screening',col:'rgba(255,214,0,.7)',items:[{co:'Deloitte',ro:'Cyber Analyst',ats:91,kw:'18/20 kw'}]},
    {stage:'Interview',col:'rgba(176,110,255,.7)',items:[{co:'CrowdStrike',ro:'SOC Analyst I',ats:94,kw:'20/22 kw'},{co:'Google',ro:'Security Eng',ats:92,kw:'19/21 kw'}]},
    {stage:'Offer',col:'rgba(0,230,118,.7)',items:[{co:'Palo Alto',ro:'Security Intern',ats:96,kw:'21/22 kw'}]},
  ],
  iv:[
    {co:'CrowdStrike',ro:'SOC Analyst I',date:'2026-04-07',time:'10:00',type:'Video',addr:'',link:'https://zoom.us/j/123456',prep:85,wx:'68°F Cloudy',cm:'',culture:4.2},
    {co:'Google',ro:'Security Engineer',date:'2026-04-10',time:'14:00',type:'Onsite',addr:'1600 Amphitheatre Pkwy, Mountain View, CA 94043',link:'',prep:40,wx:'72°F Sunny',cm:'45 min · Leave by 1:15 PM',culture:4.5},
    {co:'Palo Alto Networks',ro:'Security Intern',date:'2026-04-14',time:'11:00',type:'Onsite',addr:'3000 Tannery Way, Santa Clara, CA 95054',link:'',prep:0,wx:'70°F Clear',cm:'50 min · Leave by 10:10 AM',culture:4.1},
  ],
  offers:[{co:'Palo Alto Networks',ro:'Security Intern',sal:'$42/hr',start:'May 12, 2026',dl:'April 10, 2026',addr:'3000 Tannery Way, Santa Clara, CA 95054',remote:'Hybrid (3 days onsite)',benefits:'Housing stipend, mentorship program, cert reimbursement up to $2K',pct:85}],
  act:[
    {t:'2m ago',a:'Scanned Handshake — 3 new cybersecurity internships found',tp:'scan',i:'🌐'},
    {t:'18m ago',a:'Applied to Booz Allen SOC Analyst (ATS: 88 · 15/18 keywords matched)',tp:'apply',i:'📤'},
    {t:'45m ago',a:'Deloitte recruiter replied — draft response ready for your approval',tp:'email',i:'💬'},
    {t:'1h ago',a:'CrowdStrike interview prep updated — 85% complete',tp:'prep',i:'🧠'},
    {t:'2h ago',a:'Dream Company Alert: CrowdStrike posted SOC Analyst II role',tp:'alert',i:'🔔'},
    {t:'3h ago',a:'Weekly PDF Intelligence Report generated and emailed',tp:'report',i:'📊'},
  ],
  chk:[
    {t:'Resume copies (2x printed)',d:true},{t:'5 questions prepared',d:true},
    {t:'Review evidence pack',d:false},{t:'Research interviewer',d:false},
    {t:'Test video/audio setup',d:true},{t:'Government ID ready',d:false},
    {t:'Parking researched',d:false},{t:'Outfit ready',d:true},
  ]
}

const DEMO = JSON.parse(JSON.stringify(REAL))
DEMO.m.applied=42; DEMO.m.pipe=8; DEMO.m.intv=2; DEMO.m.prob=55

const BOARDS = ['LinkedIn','Handshake','Indeed','Dice','CyberSecJobs','ZipRecruiter','USAJobs','Glassdoor','SANS','CrowdStrike','Google Careers','Palo Alto']
const ALL_B = [{n:'LinkedIn',f:'2h'},{n:'Handshake (BYU-Idaho)',f:'2h'},{n:'Indeed',f:'2h'},{n:'Dice',f:'4h'},{n:'CyberSecJobs',f:'4h'},{n:'ZipRecruiter',f:'4h'},{n:'USAJobs',f:'daily'},{n:'Glassdoor',f:'4h'},{n:'SANS Jobs',f:'daily'},{n:'CrowdStrike Direct',f:'30m'},{n:'Google Careers',f:'1h'},{n:'Palo Alto Direct',f:'30m'},{n:'Booz Allen',f:'1h'},{n:'Deloitte',f:'daily'},{n:'Microsoft',f:'2h'}]
const AC = {scan:'#00D4FF',apply:'#00E676',email:'#FFD600',prep:'#B06EFF',alert:'#FF5252',report:'#40C4FF'}

export default function Dashboard() {
  const canvasRef = useRef(null)
  const wChartRef = useRef(null)
  const bChartRef = useRef(null)

  const [locked, setLocked] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [demoMode, setDemoMode] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([{text:'BLUE v3.0 online. 6/6 workflows active. 23 in pipeline. 22 boards scanning. How can I help?', from:'bot'}])
  const [chatInput, setChatInput] = useState('')
  const [toasts, setToasts] = useState([])
  const [clock, setClock] = useState({h:'10',m:'00',s:'00',date:'Thursday, April 2',greet:'Good Morning, Joseph! ☀️'})
  const [scanLabel, setScanLabel] = useState('scanning LinkedIn...')
  const [countdown, setCountdown] = useState('--')
  const [weather, setWeather] = useState({temp:'--°F', icon:'🌤'})
  const [location, setLocation] = useState('Rexburg, Idaho')
  const [n8nStatus, setN8nStatus] = useState('wn')
  const [n8nStatusText, setN8nStatusText] = useState('⚠ Not Connected')
  const [photoUrl, setPhotoUrl] = useState('')

  const D = demoMode ? DEMO : REAL

  // ── CLOCK ──
  useEffect(() => {
    function tick() {
      const n = new Date()
      const h = String(n.getHours()).padStart(2,'0')
      const m = String(n.getMinutes()).padStart(2,'0')
      const s = String(n.getSeconds()).padStart(2,'0')
      const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
      const months=['January','February','March','April','May','June','July','August','September','October','November','December']
      const date = `${days[n.getDay()]}, ${months[n.getMonth()]} ${n.getDate()}`
      const hr = n.getHours()
      let gr
      if(hr>=5&&hr<12) gr='Good Morning, Joseph! ☀️'
      else if(hr>=12&&hr<17) gr='Good Afternoon, Joseph! 🌤'
      else if(hr>=17&&hr<21) gr='Good Evening, Joseph! 🌆'
      else gr='Good Night, Joseph! 🌙'
      setClock({h,m,s,date,greet:gr})
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // ── WEATHER ──
  useEffect(() => {
    fetch('https://wttr.in/Rexburg+Idaho?format=%t+%C')
      .then(r=>r.text()).then(d=>{
        const l=d.toLowerCase()
        const icon=l.includes('sun')||l.includes('clear')?'☀️':l.includes('cloud')?'⛅':l.includes('rain')?'🌧':l.includes('snow')?'❄️':'🌤'
        setWeather({temp:d.trim()||'--°F',icon})
      }).catch(()=>{})
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(p=>{
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${p.coords.latitude}&lon=${p.coords.longitude}&format=json`)
          .then(r=>r.json()).then(d=>{
            const c=d.address.city||d.address.town||d.address.village||'Unknown'
            const st=d.address.state||''
            setLocation(`${c}, ${st}`)
          }).catch(()=>{})
      },()=>{})
    }
  }, [])

  // ── SCAN LABEL ROTATION ──
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i = (i+1) % BOARDS.length
      setScanLabel(`scanning ${BOARDS[i]}...`)
    }, 2800)
    return () => clearInterval(id)
  }, [])

  // ── COUNTDOWN ──
  useEffect(() => {
    function calc() {
      const tgt = new Date('2026-04-07T10:00:00')
      const d = tgt - new Date()
      if(d<=0){ setCountdown('NOW'); return }
      const days=Math.floor(d/864e5), hrs=Math.floor((d%864e5)/36e5), mins=Math.floor((d%36e5)/6e4)
      setCountdown(`${days}d ${hrs}h ${mins}m`)
    }
    calc()
    const id = setInterval(calc, 60000)
    return () => clearInterval(id)
  }, [])

  // ── SPACE CANVAS ──
  useEffect(() => {
    const cv = canvasRef.current
    if(!cv) return
    const ctx = cv.getContext('2d')
    let W, H, stars=[], shooters=[], t=0, pA=0
    let animId

    function resize() {
      W=cv.width=innerWidth; H=cv.height=innerHeight
      initStars()
    }
    function initStars() {
      stars=[]
      for(let i=0;i<250;i++) stars.push({x:Math.random()*W,y:Math.random()*H,r:.25+Math.random()*.4,v:.04+Math.random()*.06,a:.3+Math.random()*.4,p:Math.random()*6.28,ps:.008+Math.random()*.012,hue:200+Math.random()*40})
      for(let i=0;i<120;i++) stars.push({x:Math.random()*W,y:Math.random()*H,r:.6+Math.random()*.8,v:.08+Math.random()*.1,a:.5+Math.random()*.35,p:Math.random()*6.28,ps:.012+Math.random()*.018,hue:210+Math.random()*30})
      for(let i=0;i<50;i++) stars.push({x:Math.random()*W,y:Math.random()*H,r:1.2+Math.random()*1.4,v:.18+Math.random()*.12,a:.7+Math.random()*.25,p:Math.random()*6.28,ps:.018+Math.random()*.025,hue:215+Math.random()*25})
    }

    function drawPlanet() {
      pA+=0.00008
      const pX=W*.72, pY=H*.38, pR=Math.min(W,H)*.28
      const cx=pX+Math.sin(pA*.3)*12, cy=pY+Math.sin(pA*.2)*8
      ctx.save()
      const atm=ctx.createRadialGradient(cx,cy,pR*.7,cx,cy,pR*1.35)
      atm.addColorStop(0,'rgba(180,80,20,0)'); atm.addColorStop(.6,'rgba(180,80,20,0.025)'); atm.addColorStop(1,'rgba(100,40,10,0)')
      ctx.fillStyle=atm; ctx.beginPath(); ctx.arc(cx,cy,pR*1.35,0,Math.PI*2); ctx.fill()
      const pg=ctx.createRadialGradient(cx-pR*.28,cy-pR*.25,pR*.08,cx,cy,pR)
      pg.addColorStop(0,'#c87040'); pg.addColorStop(.15,'#b05c2a'); pg.addColorStop(.35,'#8a3f18'); pg.addColorStop(.6,'#6b2e10'); pg.addColorStop(.8,'#4a200a'); pg.addColorStop(1,'#1a0804')
      ctx.beginPath(); ctx.arc(cx,cy,pR,0,Math.PI*2); ctx.fillStyle=pg; ctx.fill()
      ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,pR,0,Math.PI*2); ctx.clip()
      const sh=ctx.createRadialGradient(cx+pR*.3,cy,0,cx+pR*.3,cy,pR*1.1)
      sh.addColorStop(0,'rgba(0,0,0,0)'); sh.addColorStop(.55,'rgba(0,0,0,0)'); sh.addColorStop(.75,'rgba(0,0,0,0.45)'); sh.addColorStop(1,'rgba(0,0,0,0.9)')
      ctx.fillStyle=sh; ctx.beginPath(); ctx.arc(cx,cy,pR,0,Math.PI*2); ctx.fill()
      ctx.restore()
      ctx.restore()
    }

    function drawStars() {
      stars.forEach(s=>{
        s.p+=s.ps; s.y+=s.v
        if(s.y>H) s.y=0
        const a=s.a*(0.65+Math.sin(s.p)*.35)
        const gg=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*3)
        gg.addColorStop(0,`hsla(${s.hue},20%,95%,${a*.5})`); gg.addColorStop(1,`hsla(${s.hue},20%,80%,0)`)
        ctx.fillStyle=gg; ctx.beginPath(); ctx.arc(s.x,s.y,s.r*3,0,Math.PI*2); ctx.fill()
        ctx.fillStyle=`hsla(${s.hue},20%,96%,${a})`; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill()
      })
    }

    function drawShooters() {
      if(Math.random()<.0025) shooters.push({x:Math.random()*W*.65,y:Math.random()*H*.45,vx:9+Math.random()*10,vy:3+Math.random()*5,life:1,decay:.025+Math.random()*.02})
      shooters=shooters.filter(s=>{
        s.x+=s.vx; s.y+=s.vy; s.life-=s.decay
        if(s.life<=0) return false
        const tl=ctx.createLinearGradient(s.x-s.vx*5,s.y-s.vy*5,s.x,s.y)
        tl.addColorStop(0,'rgba(255,255,255,0)'); tl.addColorStop(1,`rgba(210,240,255,${s.life*.75})`)
        ctx.strokeStyle=tl; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(s.x-s.vx*5,s.y-s.vy*5); ctx.lineTo(s.x,s.y); ctx.stroke()
        return true
      })
    }

    function draw() {
      ctx.fillStyle='#000408'; ctx.fillRect(0,0,W,H)
      const bg=ctx.createRadialGradient(W*.5,H*.3,0,W*.5,H*.3,W*.8)
      bg.addColorStop(0,'rgba(0,6,25,.65)'); bg.addColorStop(.6,'rgba(0,3,12,.3)'); bg.addColorStop(1,'rgba(0,1,5,0)')
      ctx.fillStyle=bg; ctx.fillRect(0,0,W,H)
      drawPlanet(); drawStars(); drawShooters()
      t++; animId=requestAnimationFrame(draw)
    }
    resize(); addEventListener('resize',resize); draw()
    return () => { cancelAnimationFrame(animId); removeEventListener('resize',resize) }
  }, [])

  // ── CHARTS ──
  useEffect(() => {
    if(activeTab !== 'overview') return
    const grid={color:'rgba(255,255,255,.04)'}
    const tick={color:'#374151',font:{family:'JetBrains Mono',size:9}}
    const wCtx = document.getElementById('cW')
    const bCtx = document.getElementById('cB')
    if(!wCtx || !bCtx) return
    if(wChartRef.current) wChartRef.current.destroy()
    if(bChartRef.current) bChartRef.current.destroy()
    wChartRef.current = new Chart(wCtx,{type:'line',data:{labels:['W1','W2','W3','W4','W5','W6','W7','W8'],datasets:[{data:D.w,borderColor:'#00D4FF',borderWidth:2.5,pointBackgroundColor:'#00D4FF',pointRadius:3,tension:.4,fill:true,backgroundColor:(ctx)=>{const g=ctx.chart.ctx.createLinearGradient(0,0,0,140);g.addColorStop(0,'rgba(0,212,255,.22)');g.addColorStop(1,'rgba(0,212,255,0)');return g;}}]},options:{plugins:{legend:{display:false}},scales:{x:{grid,ticks:tick},y:{grid,ticks:tick}},animation:{duration:900}}})
    bChartRef.current = new Chart(bCtx,{type:'bar',data:{labels:D.b.map(b=>b.b),datasets:[{data:D.b.map(b=>b.i),backgroundColor:D.b.map(b=>b.c),borderRadius:6,borderSkipped:false}]},options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{grid,ticks:tick},y:{grid:{display:false},ticks:tick}},animation:{duration:900}}})
    return () => {
      if(wChartRef.current) wChartRef.current.destroy()
      if(bChartRef.current) bChartRef.current.destroy()
    }
  }, [activeTab, demoMode])

  // ── UNLOCK TOAST ──
  function unlock() {
    setLocked(false)
    setTimeout(()=>addToast('🔔 Deloitte recruiter replied — BLUE drafted response for approval','urg'), 3500)
  }

  // ── TOAST ──
  function addToast(msg, type='inf') {
    const id = Date.now()
    setToasts(prev=>[...prev,{id,msg,type}])
    setTimeout(()=>setToasts(prev=>prev.filter(t=>t.id!==id)), 6500)
  }

  // ── CHAT ──
  function sendMsg() {
    if(!chatInput.trim()) return
    const msg = chatInput.trim()
    setChatInput('')
    setMessages(prev=>[...prev,{text:msg,from:'usr'}])
    setTimeout(()=>{
      const m=msg.toLowerCase()
      let r='Processing your request. Check Telegram for results.'
      if(m.includes('status')) r='BLUE v3.0 | ONLINE | 6/6 WF | 127 applied | 23 pipeline | 5 interviews | Offer prob: 73%'
      else if(m.includes('handshake')) r='Scanning byui.joinhandshake.com... 3 new cybersecurity internships. Top: Raytheon (ATS: 87). Apply?'
      else if(m.includes('interview')||m.includes('prep')) r='Next: CrowdStrike SOC Analyst I — Apr 7, 10:00 AM (Video). Prep: 85%. Run mock sim now?'
      else if(m.includes('offer')) r='Palo Alto Networks — $42/hr, hybrid. 85th percentile. Deadline Apr 10. Counter with housing stipend.'
      else if(m.includes('brief')) r='23 active. 2 positive recruiter replies. CrowdStrike prep 85%. Google prep 40% — needs attention. 3 Handshake matches queued.'
      else if(m.includes('deloitte')) r='Deloitte: "We are interested in your profile. Can you do a 30-min call this week?" — Draft reply ready for your approval on Telegram.'
      setMessages(prev=>[...prev,{text:r,from:'bot'}])
    }, 650)
  }

  function runBrief() {
    setMessages(prev=>[...prev,{text:'📊 Brief: 23 active apps. Deloitte replied (URGENT). Google screening (positive). CrowdStrike interview Apr 7 (prep 85%). Palo Alto offer deadline Apr 10. 3 Handshake matches. Priority: Google prep (40%).',from:'bot'}])
    setChatOpen(true)
  }

  // ── N8N TEST ──
  async function testN8n() {
    const url = document.getElementById('cN8')?.value
    const wb = document.getElementById('cWD')?.value
    if(!url||!wb){ addToast('Enter your n8n URL and webhook path first','wrn'); return }
    setN8nStatus('wn'); setN8nStatusText('⏳ Testing...')
    try {
      const res = await fetch(url+wb,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ping:true}),signal:AbortSignal.timeout(5000)})
      if(res.ok){ setN8nStatus('ok'); setN8nStatusText('✅ Connected'); addToast('✅ n8n connection successful!','inf') }
      else{ setN8nStatus('er'); setN8nStatusText('❌ Error '+res.status) }
    } catch(e){ setN8nStatus('er'); setN8nStatusText('❌ Failed'); addToast('❌ Could not reach n8n. Check your URL.','wrn') }
  }

  // ── SAVE CONFIG ──
  function saveAll() {
    const g = id => document.getElementById(id)?.value||''
    const cfg = {name:g('cN'),photo:g('cPh'),role:g('cR'),school:g('cSc'),hs:g('cHs'),skills:g('cSk'),n8n:g('cN8'),whC:g('cWC'),whJ:g('cWJ'),whD:g('cWD'),tgT:g('cTT'),tgI:g('cTI'),tgTo:g('cTO'),mode:g('cMd'),ats:g('cAt'),max:g('cMx'),dream:g('cDr'),dreamF:g('cDF'),ant:g('cAn'),oai:g('cOa'),gem:g('cGe'),pine:g('cPi'),sh:g('cSh')}
    localStorage.setItem('blue_cfg', JSON.stringify(cfg))
    if(cfg.photo) setPhotoUrl(cfg.photo)
    addToast('✅ Configuration saved!','inf')
  }

  // ── CELEBRATE ──
  function celebrate() {
    const cols=['#00D4FF','#00E676','#FFD600','#FF5252','#B06EFF','#FF8C42']
    for(let i=0;i<80;i++){
      const el=document.createElement('div'); el.className='cfp'
      el.style.cssText=`width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;left:${Math.random()*100}%;background:${cols[i%6]};animation-name:cfall;animation-duration:${2+Math.random()*2.5}s;animation-delay:${Math.random()*1.2}s;border-radius:${Math.random()>.5?'50%':'2px'}`
      document.body.appendChild(el); setTimeout(()=>el.remove(),5000)
    }
    addToast('🎉 OFFER ACCEPTED! Congratulations Joseph!','urg')
  }

  // ── GAUGE ──
  const prob = D.m.prob
  const gaugeColor = prob>=70?'#00E676':prob>=40?'#FFB300':'#FF5252'
  const r=64, circ=2*Math.PI*r*.75, off=circ-(prob/100)*circ

  // ── HEATMAP ──
  const heatCells = Array.from({length:56},()=>Math.floor(Math.random()*5))
  const heatColors = ['rgba(255,255,255,.04)','rgba(0,212,255,.14)','rgba(0,212,255,.32)','rgba(0,212,255,.58)','rgba(0,212,255,.85)']

  return (
    <>
      <canvas ref={canvasRef} id="cv"></canvas>

      {/* LOCK SCREEN */}
      <div id="lock" className={locked?'':'out'} onClick={unlock}>
        <div className="lock-bg"></div>
        <div className="lock-body">
          <div style={{textAlign:'center',marginBottom:'4px'}}>
            <div style={{display:'inline-flex',alignItems:'flex-start',gap:'2px'}}>
              <span className="lk-clock">{clock.h}</span>
              <span className="lk-clock" style={{opacity:.4,marginTop:'6px'}}>:</span>
              <span className="lk-clock">{clock.m}</span>
              <span className="lk-sec">:{clock.s}</span>
            </div>
            <div className="lk-date">{clock.date}</div>
          </div>
          <div className="lk-av-ring">
            <div className="lk-av">
              {photoUrl ? <img src={photoUrl} alt="Joseph"/> : 'JK'}
            </div>
          </div>
          <div className="lk-greet" dangerouslySetInnerHTML={{__html:clock.greet.replace('Joseph!','<em>Joseph!</em>')}}></div>
          <div className="lk-sub">BLUE v3.0 — Working while you sleep</div>
          <div className="lk-info">
            <div className="lpill">📍 {location}</div>
            <div className="lpill">{weather.icon} {weather.temp}</div>
            <div className="lpill">🕐 MDT UTC-6</div>
          </div>
          <div className="lk-notifs">
            <div className="np urg"><div className="blink"></div>📧 Deloitte recruiter replied — action needed</div>
            <div className="np inf" style={{animationDelay:'.1s'}}>💼 3 new Handshake cybersecurity matches</div>
            <div className="np inf" style={{animationDelay:'.2s'}}>📅 CrowdStrike interview in 5 days</div>
            <div className="np wrn" style={{animationDelay:'.3s'}}>⚠️ Palo Alto offer deadline: April 10</div>
          </div>
          <div className="lk-hint">⬆ Click anywhere to enter BLUE</div>
        </div>
      </div>

      {/* MAIN APP */}
      <div id="app" className={locked?'':'show'}>
        <div id="scroll">

          {/* HEADER */}
          <div className="hdr">
            <div className="hdr-l">
              <div className="hdr-ico">🛡</div>
              <div>
                <div className="hdr-name">BLUE <em>v3.0</em></div>
                <div className="hdr-st">
                  <div className="pdot"></div>
                  <span className="sok">ONLINE</span>
                  <span style={{color:'#2d3748'}}>·</span>
                  <span className="scn">{scanLabel}</span>
                </div>
              </div>
            </div>
            <div className="hdr-r">
              <button className={`hbtn${demoMode?' on':''}`} onClick={()=>{setDemoMode(!demoMode);addToast(demoMode?'Live mode ON':'Demo mode ON — fake data displayed','inf')}}>👁 {demoMode?'Live':'Demo'}</button>
              <button className="hbtn" onClick={runBrief}>⚡ Brief</button>
              <button className="hbtn" onClick={()=>setLocked(true)}>🔒</button>
            </div>
          </div>

          {/* TABS */}
          <div className="tabs">
            {['overview','pipeline','interviews','offers','config'].map((tab,i)=>(
              <button key={tab} className={`tab${activeTab===tab?' act':''}`} onClick={()=>setActiveTab(tab)}>
                {['📊 Overview','💼 Pipeline','📅 Interviews','🏆 Offers','⚙️ Config'][i]}
                {tab==='offers'&&<span className="tbn"></span>}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {activeTab==='overview'&&(
            <div className="page">
              {/* Insights */}
              <div className="ins-row">
                {[
                  {ico:'🎯',val:`${prob}%`,lbl:'Offer Probability',col:'var(--c)',bg:'rgba(0,212,255,.1)',bc:'rgba(0,212,255,.25)'},
                  {ico:'⭐',val:'94',lbl:'Top ATS Score',col:'var(--g)',bg:'rgba(0,230,118,.1)',bc:'rgba(0,230,118,.25)'},
                  {ico:'🤖',val:'22',lbl:'Boards Active',col:'var(--p)',bg:'rgba(176,110,255,.1)',bc:'rgba(176,110,255,.25)'},
                  {ico:'📬',val:'$42',lbl:'Best Offer/hr',col:'var(--o)',bg:'rgba(255,140,66,.1)',bc:'rgba(255,140,66,.25)'},
                  {ico:'🔥',val:'8',lbl:'Day Streak',col:'var(--pk)',bg:'rgba(255,107,157,.1)',bc:'rgba(255,107,157,.25)'},
                ].map((ic,i)=>(
                  <div key={i} className="ic" style={{background:`linear-gradient(135deg,${ic.bg},rgba(3,10,32,.8))`,borderColor:ic.bc}}>
                    <div style={{fontSize:'22px',marginBottom:'8px'}}>{ic.ico}</div>
                    <div className="icv" style={{color:ic.col}}>{ic.val}</div>
                    <div className="icl">{ic.lbl}</div>
                  </div>
                ))}
              </div>

              {/* Metrics */}
              <div className="metrics">
                <div className="mc mcC"><div className="mi">📤</div><div className="mv">{D.m.applied}</div><div className="ml">Applied</div><div className="mt" style={{background:'rgba(0,212,255,.1)',color:'var(--c)'}}>+8% ↑</div></div>
                <div className="mc mcP"><div className="mi">💼</div><div className="mv">{D.m.pipe}</div><div className="ml">Pipeline</div></div>
                <div className="mc mcG"><div className="mi">📅</div><div className="mv">{D.m.intv}</div><div className="ml">Interviews</div></div>
                <div className="mc mcO"><div className="mi">📈</div><div className="mv">{D.m.resp}</div><div className="ml">Response Rate</div></div>
              </div>

              {/* Gauge + Heatmap */}
              <div className="g2">
                <div className="gl gw p5">
                  <div className="gw-wrap">
                    <svg width="160" height="160" viewBox="0 0 160 160" style={{transform:'rotate(-135deg)'}}>
                      <circle cx="80" cy="80" r="64" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="9" strokeDasharray="301.6" strokeLinecap="round"/>
                      <circle cx="80" cy="80" r="64" fill="none" stroke={gaugeColor} strokeWidth="9" strokeDasharray="301.6" strokeDashoffset={off} strokeLinecap="round" style={{filter:`drop-shadow(0 0 14px ${gaugeColor}80)`,transition:'all 1.5s ease'}}/>
                    </svg>
                    <div style={{textAlign:'center',marginTop:'8px'}}>
                      <div className="gv" style={{color:gaugeColor,textShadow:`0 0 25px ${gaugeColor}50`}}>{prob}%</div>
                      <div className="gs">Offer Probability</div>
                    </div>
                  </div>
                  <div style={{textAlign:'center',fontSize:'8px',color:'#2d3748',letterSpacing:'.2em',marginTop:'-5px'}}>VELOCITY · MARKET · PIPELINE</div>
                </div>
                <div className="gl p5">
                  <div className="lbl">Application Heatmap (8 weeks)</div>
                  <div className="hm">
                    {heatCells.map((v,i)=><div key={i} className="hc" style={{background:heatColors[v]}}></div>)}
                  </div>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:'4px',marginTop:'9px'}}>
                    <span style={{fontSize:'8px',color:'#2d3748'}}>Low</span>
                    {['.1','.3','.55','.85'].map((o,i)=><div key={i} style={{width:'9px',height:'9px',borderRadius:'2px',background:`rgba(0,212,255,${o})`}}></div>)}
                    <span style={{fontSize:'8px',color:'#2d3748'}}>High</span>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="g2">
                <div className="gl p5 mb14"><div className="lbl">Weekly Applications</div><div className="cb"><canvas id="cW"></canvas></div></div>
                <div className="gl p5 mb14"><div className="lbl">Board Performance</div><div className="cb"><canvas id="cB"></canvas></div></div>
              </div>

              {/* Activity */}
              <div className="gl p5 mb14">
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'11px'}}>
                  <div className="lbl">Live Activity</div>
                  <span style={{fontSize:'9px',padding:'3px 9px',borderRadius:'20px',background:'rgba(0,212,255,.09)',color:'var(--c)',border:'1px solid rgba(0,212,255,.2)',fontFamily:'var(--mono)'}}>→ {scanLabel}</span>
                </div>
                {D.act.map((a,i)=>{
                  const col=AC[a.tp]||'#9ca3af'
                  return(
                    <div key={i} className="ai" style={{borderLeftColor:`${col}45`,animation:`siu .3s ease ${i*.06}s both`}}>
                      <div className="aico" style={{background:`${col}15`,border:`1px solid ${col}28`}}>{a.i}</div>
                      <div><div className="at">{a.a}</div><div className="atm">{a.t}</div></div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* PIPELINE */}
          {activeTab==='pipeline'&&(
            <div className="page">
              <div className="pipeline">
                {D.pipeline.map((s,si)=>(
                  <div key={si} className="scol">
                    <div className="shd">
                      <div className="sdot" style={{background:s.col,boxShadow:`0 0 8px ${s.col}`}}></div>
                      <span className="snm">{s.stage}</span>
                      <span className="sct">{s.items.length}</span>
                    </div>
                    {s.items.map((it,ii)=>{
                      const ac=it.ats>=90?'#00E676':it.ats>=80?'#00D4FF':'#FFB300'
                      return(
                        <div key={ii} className="kc">
                          <div className="kco">{it.co}</div>
                          <div className="kro">{it.ro}</div>
                          <div className="abadge" style={{color:ac,background:`${ac}18`}}>{it.ats} ATS</div>
                          <span style={{fontSize:'8px',color:'#2d3748',marginLeft:'5px'}}>{it.kw}</span>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INTERVIEWS */}
          {activeTab==='interviews'&&(
            <div className="page">
              <div className="gl ga p5 mb14" style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
                <div>
                  <div className="lbl" style={{marginBottom:'5px'}}>Next Interview</div>
                  <div style={{fontFamily:'var(--dsp)',fontSize:'20px',fontWeight:900}}>{D.iv[0]?.co}</div>
                  <div style={{fontSize:'12px',color:'#6b7280',marginTop:'2px'}}>{D.iv[0]?.ro}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div className="lbl" style={{marginBottom:'4px'}}>Countdown</div>
                  <div className="cd">{countdown}</div>
                </div>
              </div>
              {D.iv.map((iv,i)=>{
                const pc=iv.prep>=80?'#00E676':iv.prep>=50?'#FFB300':'#FF5252'
                const pb=iv.prep>=80?'linear-gradient(90deg,#00C853,#00E676)':iv.prep>=50?'linear-gradient(90deg,#E65100,#FFB300)':'linear-gradient(90deg,#B71C1C,#FF5252)'
                return(
                  <div key={i} className={`gl${i===0?' gw':''} ivw mb14`}>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'14px'}}>
                      <div>
                        <span className={`ivb${iv.type==='Video'?' vid':' ons'}`}>{iv.type}</span>
                        <div style={{fontSize:'9px',color:'#374151',marginBottom:'5px',fontFamily:'var(--mono)'}}>{iv.date} · {iv.time}</div>
                        <div className="ivco">{iv.co}</div>
                        <div className="ivro">{iv.ro}</div>
                      </div>
                      <div style={{fontSize:'11px'}}>⭐ <strong style={{color:'#FFD600'}}>{iv.culture}</strong></div>
                    </div>
                    <div style={{marginBottom:'12px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px',fontSize:'9px'}}>
                        <span style={{color:'#374151',textTransform:'uppercase',letterSpacing:'.15em',fontFamily:'var(--mono)'}}>Prep Progress</span>
                        <span style={{color:pc,fontWeight:700,fontFamily:'var(--mono)'}}>{iv.prep}%</span>
                      </div>
                      <div className="prb"><div className="prf" style={{width:`${iv.prep}%`,background:pb,boxShadow:`0 0 8px ${pc}40`}}></div></div>
                    </div>
                    {(iv.wx||iv.cm)&&<div className="inr">{iv.wx&&<div className="inp">☁️ {iv.wx}</div>}{iv.cm&&<div className="inp">🚗 {iv.cm}</div>}</div>}
                    {iv.link
                      ?<a href={iv.link} target="_blank" rel="noreferrer" className="mba-btn mbg" style={{textDecoration:'none',justifyContent:'center',width:'100%',marginTop:'8px'}}>🎥 Join Video Call</a>
                      :(iv.addr&&<>
                        <div style={{fontSize:'9px',color:'#374151',marginBottom:'6px'}}>{iv.addr}</div>
                        <div className="mbs">
                          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(iv.addr)}`} target="_blank" rel="noreferrer" className="mba-btn mbg">📍 Google</a>
                          <a href={`https://maps.apple.com/?daddr=${encodeURIComponent(iv.addr)}`} target="_blank" rel="noreferrer" className="mba-btn mba">🗺 Apple</a>
                        </div>
                      </>)
                    }
                    {i===0&&(
                      <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',borderRadius:'13px',padding:'13px',marginTop:'12px'}}>
                        <div className="lbl" style={{marginBottom:'9px'}}>Interview Day Checklist</div>
                        <div className="chklist">
                          {D.chk.map((c,ci)=>(
                            <div key={ci} className="chi">
                              <div className={`chb${c.d?' dn':''}`}>{c.d?'✓':''}</div>
                              <span className={`cht${c.d?' dn':''}`}>{c.t}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* OFFERS */}
          {activeTab==='offers'&&(
            <div className="page">
              {D.offers.length===0
                ?<div className="gl p5" style={{textAlign:'center',padding:'60px 20px'}}><div style={{fontSize:'40px',marginBottom:'12px'}}>🏆</div><div style={{color:'#374151'}}>No offers yet. Keep going.</div></div>
                :D.offers.map((o,i)=>{
                  const enc=encodeURIComponent(o.addr)
                  const pts=[];for(let j=0;j<50;j++){const x=j/49*100,z=(x-50)/15,y=Math.exp(-z*z/2)*100;pts.push({x,y})}
                  const dPath=pts.map((p,j)=>`${j===0?'M':'L'}${p.x*2.6} ${90-p.y*.7}`).join(' ')
                  const cx=o.pct*2.6,cy=90-Math.exp(-Math.pow((o.pct-50)/15,2)/2)*70
                  return(
                    <div key={i} className="gl og p5 mb14">
                      <div style={{display:'flex',alignItems:'center',gap:'7px',marginBottom:'14px'}}>
                        <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'var(--g)',boxShadow:'0 0 8px var(--g)',animation:'pd 2s infinite'}}></div>
                        <span style={{fontSize:'9px',color:'var(--g)',textTransform:'uppercase',letterSpacing:'.3em',fontWeight:700,fontFamily:'var(--mono)'}}>Active Offer</span>
                      </div>
                      <div style={{fontFamily:'var(--dsp)',fontSize:'22px',fontWeight:900}}>{o.co}</div>
                      <div style={{fontSize:'12px',color:'#6b7280',marginTop:'3px'}}>{o.ro}</div>
                      <div className="ofg">
                        <div className="of" style={{background:'rgba(0,230,118,.07)',border:'1px solid rgba(0,230,118,.22)'}}><div className="ofl" style={{color:'rgba(0,230,118,.6)'}}>Compensation</div><div className="ofv" style={{color:'var(--g)'}}>{o.sal}</div></div>
                        <div className="of" style={{background:'rgba(0,212,255,.06)',border:'1px solid rgba(0,212,255,.2)'}}><div className="ofl" style={{color:'rgba(0,212,255,.6)'}}>Start Date</div><div className="ofv" style={{color:'var(--c)'}}>{o.start}</div></div>
                        <div className="of" style={{background:'rgba(176,110,255,.07)',border:'1px solid rgba(176,110,255,.2)'}}><div className="ofl" style={{color:'rgba(176,110,255,.6)'}}>Work Mode</div><div className="ofv" style={{color:'var(--p)',fontSize:'11px'}}>{o.remote}</div></div>
                        <div className="of" style={{background:'rgba(255,82,82,.06)',border:'1px solid rgba(255,82,82,.2)'}}><div className="ofl" style={{color:'rgba(255,82,82,.6)'}}>Deadline</div><div className="ofv" style={{color:'var(--r)'}}>{o.dl}</div></div>
                      </div>
                      <div style={{background:'rgba(0,212,255,.04)',border:'1px solid rgba(0,212,255,.12)',borderRadius:'13px',padding:'13px',marginBottom:'11px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'7px',fontSize:'9px'}}>
                          <span style={{color:'#374151',textTransform:'uppercase',letterSpacing:'.2em',fontFamily:'var(--mono)'}}>Market Position</span>
                          <span style={{color:'var(--g)',fontWeight:700,fontFamily:'var(--mono)'}}>{o.pct}th percentile</span>
                        </div>
                        <svg viewBox="0 0 260 95" style={{width:'100%',height:'60px'}}>
                          <path d={dPath} fill="none" stroke="rgba(0,212,255,.35)" strokeWidth="2"/>
                          <path d={`${dPath} L260 90 L0 90 Z`} fill="rgba(0,212,255,.06)"/>
                          <line x1={cx} y1="5" x2={cx} y2="90" stroke="#00E676" strokeWidth="2" strokeDasharray="4 3"/>
                          <circle cx={cx} cy={cy} r="5" fill="#00E676" style={{filter:'drop-shadow(0 0 6px #00E67680)'}}/>
                        </svg>
                        <div style={{display:'flex',justifyContent:'space-between',fontSize:'8px',color:'#374151',fontFamily:'var(--mono)'}}>
                          <span>$30K</span><span>$55K</span><span>$80K</span><span>$105K</span><span>$130K</span>
                        </div>
                      </div>
                      <div style={{background:'rgba(255,255,255,.03)',border:'1px solid var(--br)',borderRadius:'13px',padding:'13px',marginBottom:'11px'}}>
                        <div className="lbl" style={{marginBottom:'5px'}}>Benefits</div>
                        <div style={{fontSize:'11px',color:'#9ca3af',lineHeight:1.6}}>{o.benefits}</div>
                      </div>
                      <div style={{background:'rgba(255,255,255,.03)',border:'1px solid var(--br)',borderRadius:'13px',padding:'13px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'7px',marginBottom:'7px'}}><span>📍</span><strong style={{fontSize:'11px'}}>Office Location</strong></div>
                        <div style={{fontSize:'10px',color:'#374151',marginBottom:'7px'}}>{o.addr}</div>
                        <div className="mbs">
                          <a href={`https://www.google.com/maps/dir/?api=1&destination=${enc}`} target="_blank" rel="noreferrer" className="mba-btn mbg">📍 Google Maps</a>
                          <a href={`https://maps.apple.com/?daddr=${enc}`} target="_blank" rel="noreferrer" className="mba-btn mba">🗺 Apple Maps</a>
                        </div>
                        <div className="mpe"><iframe src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${enc}&zoom=14`} allowFullScreen loading="lazy" title="map"></iframe></div>
                      </div>
                      <div className="abts">
                        <button className="abt abtA" onClick={celebrate}>✅ Accept Offer</button>
                        <button className="abt abtN">↗ Negotiate</button>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          )}

          {/* CONFIG */}
          {activeTab==='config'&&(
            <div className="page">
              <div className="cgrid">
                <div className="gl csec">
                  <div className="ctit">👤 Your Profile</div>
                  <div className="fd"><label>Full Name</label><input id="cN" placeholder="Joseph Kamara"/></div>
                  <div className="fd"><label>Your Photo URL</label><input id="cPh" placeholder="https://your-photo-url.jpg" onChange={e=>setPhotoUrl(e.target.value)}/></div>
                  <div className="fd"><label>Target Role</label><input id="cR" placeholder="SOC Analyst / Cybersecurity Intern"/></div>
                  <div className="fd"><label>University</label><input id="cSc" placeholder="BYU-Idaho"/></div>
                  <div className="fd"><label>Handshake URL</label><input id="cHs" placeholder="byui.joinhandshake.com"/></div>
                  <div className="fd"><label>Key Skills</label><textarea id="cSk" placeholder="Splunk, SIEM, Python, Incident Response..."></textarea></div>
                </div>
                <div className="gl csec">
                  <div className="ctit">⚡ n8n Connection</div>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
                    <span style={{fontSize:'10px',color:'#9ca3af'}}>Status</span>
                    <span className={`sbg ${n8nStatus}`}>{n8nStatusText}</span>
                  </div>
                  <div className="fd"><label>n8n Base URL</label><input id="cN8" placeholder="https://joeallan.app.n8n.cloud"/></div>
                  <div className="fd"><label>Command Webhook</label><input id="cWC" placeholder="/webhook/blue-command"/></div>
                  <div className="fd"><label>Job Machine Webhook</label><input id="cWJ" placeholder="/webhook/blue-jobs"/></div>
                  <div className="fd"><label>Dashboard Webhook</label><input id="cWD" placeholder="/webhook/blue-dashboard"/></div>
                  <button className="sbtn sg" onClick={testN8n}>🔌 Test Connection</button>
                  <button className="sbtn" onClick={saveAll}>💾 Save All</button>
                </div>
                <div className="gl csec">
                  <div className="ctit">✈️ Telegram</div>
                  <div className="fd"><label>Bot Token</label><input type="password" id="cTT" placeholder="1234567890:AAH..."/></div>
                  <div className="fd"><label>Chat ID</label><input id="cTI" placeholder="8610059806"/></div>
                  <div className="fd"><label>Approval Timeout (min)</label><input type="number" id="cTO" defaultValue="30" min="5" max="1440"/></div>
                  {['Morning Brief (7 AM)','Dream Company Alerts','Recruiter Email Drafts','Interview Reminders','Weekly PDF Report'].map((lbl,i)=>(
                    <div key={i} className="tr"><span className="trl">{lbl}</span><div className="tg on" onClick={e=>e.currentTarget.classList.toggle('on')}></div></div>
                  ))}
                </div>
                <div className="gl csec">
                  <div className="ctit">🤖 Autonomy Mode</div>
                  <div className="fd"><label>Mode</label>
                    <select id="cMd">
                      <option value="safe">🔒 Safe — Drafts only</option>
                      <option value="assist" defaultValue>🤝 Assist — HITL (Default)</option>
                      <option value="fast">⚡ Fast — Auto low-risk</option>
                      <option value="demo">👁 Demo — Simulated data</option>
                    </select>
                  </div>
                  <div className="fd"><label>ATS Auto-Apply Threshold</label><input type="number" id="cAt" defaultValue="90" min="70" max="100"/></div>
                  <div className="fd"><label>Max Daily Applications</label><input type="number" id="cMx" defaultValue="15" min="1" max="50"/></div>
                  {['Include Internships','Include Full-time','Auto-apply (above threshold)'].map((lbl,i)=>(
                    <div key={i} className="tr"><span className="trl">{lbl}</span><div className={`tg${i<2?' on':''}`} onClick={e=>e.currentTarget.classList.toggle('on')}></div></div>
                  ))}
                </div>
                <div className="gl csec" style={{gridColumn:'1/-1'}}>
                  <div className="ctit">🌐 Job Board Scan Frequency</div>
                  <div className="blist">
                    {ALL_B.map((b,i)=>(
                      <div key={i} className="bi">
                        <span className="bn">{b.n}</span>
                        <select defaultValue={b.f}>
                          <option value="30m">30 min</option>
                          <option value="1h">1 hour</option>
                          <option value="2h">2 hours</option>
                          <option value="4h">4 hours</option>
                          <option value="daily">Daily</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="gl csec">
                  <div className="ctit">⭐ Dream Company Watchlist</div>
                  <div className="fd"><label>Companies (one per line)</label>
                    <textarea id="cDr" style={{minHeight:'110px'}} placeholder={"CrowdStrike\nPalo Alto Networks\nGoogle\nBooz Allen Hamilton\nCISA"}></textarea>
                  </div>
                  <div className="fd"><label>Scan Every</label>
                    <select id="cDF" defaultValue="60">
                      <option value="30">30 min ⚡</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
                <div className="gl csec">
                  <div className="ctit">🔑 API Keys</div>
                  <div className="fd"><label>Anthropic Claude</label><input type="password" id="cAn" placeholder="sk-ant-..."/></div>
                  <div className="fd"><label>OpenAI</label><input type="password" id="cOa" placeholder="sk-..."/></div>
                  <div className="fd"><label>Google Gemini</label><input type="password" id="cGe" placeholder="AIza..."/></div>
                  <div className="fd"><label>Pinecone (RAG)</label><input type="password" id="cPi" placeholder="pc-..."/></div>
                  <div className="fd"><label>Google Sheets ID</label><input id="cSh" placeholder="16NauKVu6Kfh0hULEhhbCZtRhTqGTTGeKcVmlJats1A"/></div>
                  <button className="sbtn" onClick={saveAll}>💾 Save API Keys</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* CHAT FAB */}
      <button id="cfab" onClick={()=>setChatOpen(!chatOpen)}>{chatOpen?'✕':'💬'}</button>
      {chatOpen&&(
        <div id="cpanel" className="open">
          <div className="chd">
            <div className="chdl">
              <div className="chav">🛡</div>
              <span className="chnm">BLUE</span>
              <div className="pdot" style={{marginLeft:'2px'}}></div>
            </div>
            <button className="chcls" onClick={()=>setChatOpen(false)}>✕</button>
          </div>
          <div className="cmsgs">
            {messages.map((m,i)=><div key={i} className={`cm ${m.from}`}>{m.text}</div>)}
          </div>
          <div className="cinr">
            <input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Ask BLUE anything..." onKeyDown={e=>e.key==='Enter'&&sendMsg()}/>
            <button className="csnd" onClick={sendMsg}>➤</button>
          </div>
        </div>
      )}

      {/* TOASTS */}
      <div id="tc">
        {toasts.map(t=>(
          <div key={t.id} className={`toast ${t.type}`}>
            <span style={{fontSize:'16px',flexShrink:0}}>{t.type==='urg'?'🔔':t.type==='wrn'?'⚠️':'💙'}</span>
            <span className="tmo">{t.msg}</span>
            <button className="tcls" onClick={()=>setToasts(prev=>prev.filter(x=>x.id!==t.id))}>✕</button>
          </div>
        ))}
      </div>
    </>
  )
}