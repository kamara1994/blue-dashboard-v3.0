import { useState, useEffect, useRef, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { MapPin, Clock, Calendar, Send, Briefcase, Target, TrendingUp, Brain, MessageCircle, X, ExternalLink, Navigation, Bell, Shield, Award, CheckCircle, ArrowUpRight, Play, Pause, Search, Cloud, Car, Star, Globe, Zap, Radio, Lock, Eye, EyeOff } from "lucide-react";

// ════════════════════════════════════════════════════════════════
// BLUE v3.0 GOD TIER — AUTONOMOUS CAREER OS DASHBOARD
// Cybersecurity Aesthetic · Dark Glassmorphism · Animated Canvas
// ════════════════════════════════════════════════════════════════

// ── Animated Cybersecurity Background ──
function CyberBG() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let af, nodes = [];
    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      nodes = [];
      const count = Math.floor((c.width * c.height) / 22000);
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * c.width, y: Math.random() * c.height,
          vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
          r: Math.random() * 1.5 + 0.5, p: Math.random() * Math.PI * 2,
          isLock: Math.random() > 0.88
        });
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      // Grid
      ctx.strokeStyle = "rgba(0,180,216,0.018)";
      ctx.lineWidth = 1;
      for (let x = 0; x < c.width; x += 55) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, c.height); ctx.stroke(); }
      for (let y = 0; y < c.height; y += 55) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke(); }
      // Nodes
      nodes.forEach((n, i) => {
        n.x += n.vx; n.y += n.vy; n.p += 0.012;
        if (n.x < 0 || n.x > c.width) n.vx *= -1;
        if (n.y < 0 || n.y > c.height) n.vy *= -1;
        const alpha = 0.2 + Math.sin(n.p) * 0.15;
        // Connections
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d < 110) {
            ctx.beginPath(); ctx.strokeStyle = `rgba(0,180,216,${0.05 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5; ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
        if (n.isLock) {
          ctx.strokeStyle = `rgba(0,180,216,${alpha * 0.45})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath(); ctx.arc(n.x, n.y - 3.5, 3, Math.PI, 0); ctx.stroke();
          ctx.strokeRect(n.x - 3.5, n.y - 0.5, 7, 5.5);
        } else {
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,180,216,${alpha})`; ctx.fill();
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,180,216,${alpha * 0.06})`; ctx.fill();
        }
      });
      // Scan line
      const sy = (Date.now() * 0.018) % c.height;
      ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(c.width, sy);
      ctx.strokeStyle = "rgba(0,180,216,0.035)"; ctx.lineWidth = 1; ctx.stroke();
      af = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize); draw();
    return () => { cancelAnimationFrame(af); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 z-0" style={{ pointerEvents: "none" }} />;
}

// ── Glass Panel ──
const Glass = ({ children, className = "", glow = false }) => (
  <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.005] ${glow ? "border-cyan-500/15 hover:border-cyan-500/25" : "border-white/[0.05] hover:border-white/[0.1]"} ${className}`}
    style={{ background: "rgba(5,10,28,0.38)", backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)", boxShadow: glow ? "0 0 25px rgba(0,180,216,0.06)" : "none" }}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] via-transparent to-transparent pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

// ── Offer Probability Gauge ──
const Gauge = ({ value }) => {
  const r = 56, circ = 2 * Math.PI * r * 0.75;
  const off = circ - (value / 100) * circ;
  const col = value >= 70 ? "#00C853" : value >= 40 ? "#FFB300" : "#E53935";
  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width={140} height={140} className="absolute" style={{ transform: "rotate(-135deg)" }}>
        <circle cx={70} cy={70} r={r} fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="5" strokeDasharray={circ} strokeLinecap="round" />
        <circle cx={70} cy={70} r={r} fill="none" stroke={col} strokeWidth="5" strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${col}50)`, transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-black" style={{ fontFamily: "monospace", textShadow: `0 0 20px ${col}20` }}>{value}<span className="text-lg">%</span></span>
        <span className="text-[7px] text-gray-600 uppercase tracking-[0.3em] mt-0.5">offer prob</span>
      </div>
    </div>
  );
};

// ── Maps Deep Links ──
const MapBtns = ({ addr }) => {
  if (!addr) return null;
  const e = encodeURIComponent(addr);
  return (
    <div className="flex gap-1.5 mt-2">
      <a href={`https://www.google.com/maps/dir/?api=1&destination=${e}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/[0.07] border border-cyan-500/[0.12] text-cyan-400 text-[9px] font-medium hover:bg-cyan-500/[0.15] transition-all">
        <Navigation size={9} /> Google Maps
      </a>
      <a href={`https://maps.apple.com/?daddr=${e}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/[0.07] border border-purple-500/[0.12] text-purple-400 text-[9px] font-medium hover:bg-purple-500/[0.15] transition-all">
        <MapPin size={9} /> Apple Maps
      </a>
    </div>
  );
};

// ── Countdown ──
const Countdown = ({ date, time }) => {
  const [left, setLeft] = useState("...");
  useEffect(() => {
    const calc = () => {
      const h = parseInt(time), pm = time.includes("PM"), h24 = pm ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h);
      const tgt = new Date(`${date}T${String(h24).padStart(2, "0")}:00:00`);
      const d = tgt - new Date();
      if (d <= 0) return setLeft("NOW");
      setLeft(`${Math.floor(d / 864e5)}d ${Math.floor((d % 864e5) / 36e5)}h ${Math.floor((d % 36e5) / 6e4)}m`);
    };
    calc(); const iv = setInterval(calc, 60000); return () => clearInterval(iv);
  }, [date, time]);
  return <span className="font-mono text-xs text-cyan-400" style={{ textShadow: "0 0 8px rgba(0,180,216,0.2)" }}>{left}</span>;
};

// ── Salary Bell Curve ──
const BellCurve = ({ pct }) => {
  const pts = Array.from({ length: 50 }, (_, i) => {
    const x = i / 49 * 100, z = (x - 50) / 15;
    return { x, y: Math.exp(-z * z / 2) * 100 };
  });
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x * 2.6} ${90 - p.y * 0.7}`).join(" ");
  return (
    <div>
      <svg viewBox="0 0 260 95" className="w-full h-16">
        <path d={d} fill="none" stroke="rgba(0,180,216,0.22)" strokeWidth="1.5" />
        <path d={`${d} L260 90 L0 90 Z`} fill="rgba(0,180,216,0.04)" />
        <line x1={pct * 2.6} y1="5" x2={pct * 2.6} y2="90" stroke="#00C853" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx={pct * 2.6} cy={90 - Math.exp(-((pct - 50) / 15) ** 2 / 2) * 70} r="3.5" fill="#00C853" style={{ filter: "drop-shadow(0 0 4px #00C85350)" }} />
      </svg>
      <div className="flex justify-between text-[7px] text-gray-700 px-0.5"><span>$30K</span><span>$55K</span><span>$80K</span><span>$105K</span><span>$130K</span></div>
    </div>
  );
};

// ── Data ──
const BOARDS = ["LinkedIn", "Handshake", "Indeed", "Dice", "CyberSecJobs", "ZipRecruiter", "USAJobs", "Glassdoor", "SANS", "CrowdStrike", "Google Careers", "Palo Alto"];
const JSONBIN_URL = "https://api.jsonbin.io/v3/b/69cb7c73aaba882197adb0cf/latest";
const JSONBIN_KEY = "$2a$10$VhY8svRChLrOJcUZ/dcyvOMNpPlQjlcb5vRu4HC8g8.C6JOuc0P9C";
const REAL_DATA = {
  metrics: { applied: 127, pipe: 23, resp: 14.2, intv: 5, prob: 73 },
  weekly: [{ w: "W1", a: 12, i: 0 }, { w: "W2", a: 18, i: 0 }, { w: "W3", a: 22, i: 1 }, { w: "W4", a: 19, i: 1 }, { w: "W5", a: 24, i: 1 }, { w: "W6", a: 16, i: 1 }, { w: "W7", a: 8, i: 1 }, { w: "W8", a: 8, i: 0 }],
  boards: [{ b: "LinkedIn", i: 2, c: "#0A66C2" }, { b: "Handshake", i: 1, c: "#FF6B35" }, { b: "Indeed", i: 1, c: "#2164F3" }, { b: "CrowdStrike", i: 1, c: "#E8392B" }, { b: "Dice", i: 0, c: "#00C1D4" }, { b: "USAJobs", i: 0, c: "#1a3a5c" }],
  pipeline: [
    { stage: "Queued", items: [{ co: "Fortinet", ro: "Security Intern", ats: 82, kw: "12/18 keywords" }, { co: "Accenture", ro: "Cyber Associate", ats: 78, kw: "10/16 keywords" }] },
    { stage: "Applied", items: [{ co: "Booz Allen", ro: "SOC Analyst", ats: 88, kw: "15/18 keywords" }, { co: "KPMG", ro: "Cyber Intern", ats: 85, kw: "14/17 keywords" }, { co: "Northrop", ro: "Cyber Eng I", ats: 80, kw: "11/15 keywords" }] },
    { stage: "Screening", items: [{ co: "Deloitte", ro: "Cyber Analyst", ats: 91, kw: "18/20 keywords" }] },
    { stage: "Interview", items: [{ co: "CrowdStrike", ro: "SOC Analyst I", ats: 94, kw: "20/22 keywords" }, { co: "Google", ro: "Security Eng", ats: 92, kw: "19/21 keywords" }] },
    { stage: "Offer", items: [{ co: "Palo Alto", ro: "Security Intern", ats: 96, kw: "21/22 keywords" }] },
  ],
  interviews: [
    { co: "CrowdStrike", ro: "SOC Analyst I", date: "2026-04-07", time: "10:00 AM", type: "Video", addr: "", link: "https://zoom.us/j/123456", prep: 85, wx: "68°F Cloudy", cm: "", culture: 4.2 },
    { co: "Google", ro: "Security Engineer", date: "2026-04-10", time: "2:00 PM", type: "Onsite", addr: "1600 Amphitheatre Pkwy, Mountain View, CA 94043", link: "", prep: 40, wx: "72°F Sunny", cm: "45 min drive · Leave by 1:15 PM", culture: 4.5 },
    { co: "Palo Alto Networks", ro: "Security Intern", date: "2026-04-14", time: "11:00 AM", type: "Onsite", addr: "3000 Tannery Way, Santa Clara, CA 95054", link: "", prep: 0, wx: "70°F Clear", cm: "50 min drive · Leave by 10:10 AM", culture: 4.1 },
  ],
  offers: [{ co: "Palo Alto Networks", ro: "Security Intern", sal: "$42/hr", start: "May 12, 2026", dl: "April 10, 2026", addr: "3000 Tannery Way, Santa Clara, CA 95054", remote: "Hybrid (3 days onsite)", benefits: "Housing stipend, mentorship program, cert reimbursement up to $2K", pct: 85 }],
  activity: [
    { t: "2m ago", a: "Scanned Handshake — 3 new cybersecurity internships found", tp: "scan" },
    { t: "18m ago", a: "Applied to Booz Allen SOC Analyst (ATS: 88 · 15/18 keywords matched)", tp: "apply" },
    { t: "45m ago", a: "Deloitte recruiter replied — draft response ready for approval", tp: "email" },
    { t: "1h ago", a: "CrowdStrike interview prep updated — 85% complete", tp: "prep" },
    { t: "2h ago", a: "Dream Company Alert: CrowdStrike posted SOC Analyst II role", tp: "alert" },
    { t: "3h ago", a: "Weekly PDF Intelligence Report generated and emailed", tp: "report" },
  ],
  checklist: [
    { t: "Resume copies (2x printed)", d: true }, { t: "5 questions to ask prepared", d: true },
    { t: "Review evidence pack — what you sent them", d: false }, { t: "Research interviewer on LinkedIn", d: false },
    { t: "Test video/audio setup", d: true }, { t: "Government ID for building security", d: false },
    { t: "Parking info researched", d: false }, { t: "Outfit ready — business casual", d: true },
  ],
};
const DEMO_DATA = JSON.parse(JSON.stringify(REAL_DATA));
DEMO_DATA.interviews.forEach(iv => { iv.co = ["Acme Corp", "TechVault", "CyberShield"][Math.floor(Math.random() * 3)]; });
DEMO_DATA.offers.forEach(o => { o.co = "SecureNet Inc"; o.sal = "$XX/hr"; o.addr = "123 Demo St, San Francisco, CA"; });
DEMO_DATA.pipeline.forEach(s => s.items.forEach(it => { it.co = ["AlphaSec", "BetaDefense", "GammaCyber"][Math.floor(Math.random() * 3)]; }));
DEMO_DATA.activity.forEach(a => { a.a = a.a.replace(/Booz Allen|CrowdStrike|Deloitte|Handshake/g, "DemoCompany"); });

const HEATMAP = Array.from({ length: 56 }, () => ({ c: Math.floor(Math.random() * 6) }));
const actColors = { scan: "text-cyan-400", apply: "text-green-400", email: "text-yellow-400", prep: "text-purple-400", alert: "text-red-400", report: "text-blue-400" };
const actIcons = { scan: Globe, apply: Send, email: MessageCircle, prep: Brain, alert: Bell, report: TrendingUp };
const stageColors = ["gray", "cyan", "yellow", "purple", "green"];

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════
export default function BlueDashboard() {
  const [tab, setTab] = useState("overview");
  const [status, setStatus] = useState("ONLINE");
  const [demo, setDemo] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatHist, setChatHist] = useState([{ f: "b", t: "BLUE v3.0 online. 6/6 workflows active. 23 in pipeline. 22 boards scanning. How can I help?" }]);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQ, setCmdQ] = useState("");
  const [toast, setToast] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [scanIdx, setScanIdx] = useState(0);
  const [liveData, setLiveData] = useState(null);
  const chatEnd = useRef(null);

  // Fetch live data from JSONBin (updated by n8n WF4 every 5 min)
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch(JSONBIN_URL, { headers: { "X-Master-Key": JSONBIN_KEY } });
        const json = await res.json();
        if (json.record) setLiveData(json.record);
      } catch (e) { console.log("Using mock data — JSONBin fetch failed"); }
    };
    fetchLive();
    const iv = setInterval(fetchLive, 30000); // refresh every 30 sec
    return () => clearInterval(iv);
  }, []);

  const mergedData = liveData ? {
    ...REAL_DATA,
    metrics: {
      applied: liveData.total_applied || REAL_DATA.metrics.applied,
      pipe: liveData.in_pipeline || REAL_DATA.metrics.pipe,
      resp: parseFloat(liveData.response_rate) || REAL_DATA.metrics.resp,
      intv: liveData.interviews || REAL_DATA.metrics.intv,
      prob: liveData.offer_probability || REAL_DATA.metrics.prob,
    }
  } : REAL_DATA;

  const D = demo ? DEMO_DATA : mergedData;

  useEffect(() => { const iv = setInterval(() => setScanIdx(p => (p + 1) % BOARDS.length), 2800); return () => clearInterval(iv); }, []);
  useEffect(() => { const t = setTimeout(() => setToast("Deloitte recruiter replied — BLUE drafted a response for your approval"), 5000); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(p => !p); } if (e.key === "Escape") setCmdOpen(false); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHist]);

  const sendChat = useCallback(() => {
    if (!chatMsg.trim()) return;
    setChatHist(p => [...p, { f: "u", t: chatMsg }]);
    const m = chatMsg.toLowerCase(); setChatMsg("");
    setTimeout(() => {
      let r = "Processing. Check Telegram for detailed results.";
      if (m.includes("status")) r = `BLUE v3.0 | ${status} | 6/6 WF | 127 applied | 23 pipeline | 5 interviews | Offer prob: 73%`;
      else if (m.includes("handshake")) r = "Scanning byui.joinhandshake.com... Found 3 new cybersecurity internships. Top: Raytheon Security Intern (ATS: 87, 16/19 keywords). Want me to apply?";
      else if (m.includes("interview") || m.includes("prep")) r = "Next: CrowdStrike SOC Analyst I — Apr 7, 10:00 AM (Video). Prep: 85%. Missing: mock sim #2. Run it now?";
      else if (m.includes("offer")) r = "Palo Alto Networks Security Intern — $42/hr, hybrid. 85th percentile for intern comp. Deadline: Apr 10. Recommend counter with housing stipend.";
      else if (m.includes("brief")) r = "Pipeline: 23 active. 2 new recruiter emails (positive sentiment). Top action: Complete Google interview prep (40%). 3 new Handshake matches.";
      else if (m.includes("confetti")) { setConfetti(true); setTimeout(() => setConfetti(false), 3500); r = "Celebrating!"; }
      setChatHist(p => [...p, { f: "b", t: r }]);
    }, 700);
  }, [chatMsg, status]);

  const tabs = [
    { id: "overview", l: "Overview", I: Target },
    { id: "pipeline", l: "Pipeline", I: Briefcase },
    { id: "interviews", l: "Interviews", I: Calendar },
    { id: "offers", l: "Offers", I: Award },
  ];

  const mono = { fontFamily: "'JetBrains Mono', 'SF Mono', 'Cascadia Code', 'Fira Code', monospace" };
  const label = "text-[7px] uppercase tracking-[0.25em] text-gray-600";

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "linear-gradient(155deg, #020810 0%, #041225 25%, #081a38 55%, #040e1e 100%)" }}>
      <CyberBG />

      {/* ── Confetti ── */}
      {confetti && <div className="fixed inset-0 z-[90] pointer-events-none">
        {Array.from({ length: 55 }, (_, i) => (
          <div key={i} className="absolute rounded-sm"
            style={{ width: 6 + Math.random() * 4, height: 6 + Math.random() * 4, left: `${Math.random() * 100}%`, top: "-3%",
              background: ["#0096FF", "#00C853", "#FFB300", "#E53935", "#7B2FBE", "#00B4D8"][i % 6],
              animation: `confettiFall ${2 + Math.random() * 2.5}s ${Math.random() * 1.5}s ease-in forwards` }} />
        ))}
      </div>}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100] max-w-sm" style={{ animation: "slideIn 0.3s ease" }}>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-cyan-500/15"
            style={{ background: "rgba(5,15,35,0.92)", backdropFilter: "blur(20px)" }}>
            <Bell size={13} className="text-cyan-400 animate-pulse flex-shrink-0" />
            <p className="text-[10px] text-gray-400 flex-1" style={mono}>{toast}</p>
            <button onClick={() => setToast(null)} className="ml-2"><X size={11} className="text-gray-700 hover:text-gray-400" /></button>
          </div>
        </div>
      )}

      {/* ── Command Palette (Cmd+K) ── */}
      {cmdOpen && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center pt-[18vh] bg-black/30" onClick={() => setCmdOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-md mx-4 rounded-2xl border border-cyan-500/15 overflow-hidden"
            style={{ background: "rgba(5,12,30,0.96)", backdropFilter: "blur(30px)" }}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04]">
              <Search size={15} className="text-cyan-400" />
              <input autoFocus value={cmdQ} onChange={e => setCmdQ(e.target.value)} placeholder="Type a command..."
                className="flex-1 bg-transparent text-xs text-white placeholder-gray-700 outline-none" style={mono} />
              <span className="text-[8px] text-gray-700 bg-white/[0.04] px-1.5 py-0.5 rounded" style={mono}>ESC</span>
            </div>
            <div className="p-1.5 max-h-52 overflow-y-auto">
              {["Check status", "Scan Handshake now", "Prep for CrowdStrike", "Run morning brief", "Apply to queued jobs",
                "Pause job hunting", "Resume everything", "Assist mode", "Fast mode", "Demo mode", "Show weekly report"
              ].filter(c => c.toLowerCase().includes(cmdQ.toLowerCase())).map((c, i) => (
                <button key={i} onClick={() => { setCmdOpen(false); setCmdQ(""); if (c.includes("Demo")) setDemo(p => !p); else setToast(`Executing: ${c}`); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[10px] text-gray-500 hover:bg-cyan-500/[0.07] hover:text-cyan-400 transition-all text-left" style={mono}>
                  <Zap size={10} className="text-cyan-700" />{c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="relative z-10 px-4 sm:px-6 pt-5 pb-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/60 to-blue-600/60 flex items-center justify-center border border-cyan-400/15"
              style={{ boxShadow: "0 0 18px rgba(0,180,216,0.12)" }}>
              <Shield size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black" style={mono}>BLUE <span className="text-cyan-400">v3.0</span></h1>
                {demo && <span className="text-[7px] px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/15 text-yellow-400 uppercase tracking-widest" style={mono}>demo</span>}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: status === "ONLINE" ? "#00C853" : "#FFB300", boxShadow: `0 0 4px ${status === "ONLINE" ? "#00C853" : "#FFB300"}` }} />
                <span className="text-[8px] text-gray-600 tracking-wider" style={mono}>{status} · scanning {BOARDS[scanIdx]}...</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setDemo(p => !p)} className="p-1.5 rounded-lg border border-white/[0.04] hover:bg-cyan-500/[0.06] transition-all" title="Toggle Demo Mode">
              {demo ? <EyeOff size={13} className="text-yellow-400" /> : <Eye size={13} className="text-gray-600" />}
            </button>
            <button onClick={() => setCmdOpen(true)} className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/[0.04] text-[9px] text-gray-600 hover:border-cyan-500/15 transition-all" style={mono}>
              <Search size={10} /> Cmd+K
            </button>
            <button onClick={() => setStatus(s => s === "ONLINE" ? "PAUSED" : "ONLINE")} className="p-1.5 rounded-lg border border-white/[0.04] hover:bg-cyan-500/[0.06] transition-all">
              {status === "ONLINE" ? <Pause size={13} className="text-gray-600" /> : <Play size={13} className="text-green-400" />}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto mt-3 flex gap-0.5 p-1 rounded-xl border border-white/[0.03]" style={{ background: "rgba(5,12,28,0.25)" }}>
          {tabs.map(({ id, l, I }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-[0.12em] transition-all ${tab === id ? "bg-cyan-500/[0.08] text-cyan-400 border border-cyan-500/[0.12]" : "text-gray-700 hover:text-gray-500"}`} style={mono}>
              <I size={11} />{l}
              {id === "offers" && D.offers.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 px-4 sm:px-6 pb-24 max-w-7xl mx-auto mt-2">

        {/* ════ OVERVIEW ════ */}
        {tab === "overview" && (
          <div className="space-y-3">
            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[{ l: "Applied", v: D.metrics.applied, I: Send }, { l: "Pipeline", v: D.metrics.pipe, I: Briefcase },
                { l: "Interviews", v: D.metrics.intv, I: Calendar }, { l: "Response", v: `${D.metrics.resp}%`, I: TrendingUp }
              ].map(({ l, v, I }, i) => (
                <Glass key={i} className="p-4">
                  <p className={label} style={mono}>{l}</p>
                  <div className="flex items-end justify-between mt-1.5">
                    <span className="text-2xl font-black" style={{ ...mono, textShadow: "0 0 15px rgba(0,180,216,0.06)" }}>{v}</span>
                    <I size={13} className="text-cyan-700/30 mb-1" />
                  </div>
                </Glass>
              ))}
            </div>

            {/* Gauge + Heatmap */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Glass className="p-5 flex flex-col items-center justify-center">
                <Gauge value={D.metrics.prob} />
                <p className="text-[8px] text-gray-700 mt-2 text-center" style={mono}>velocity + market + pipeline</p>
              </Glass>
              <Glass className="p-4 sm:col-span-2">
                <p className={label} style={mono}>application heatmap (8 weeks)</p>
                <div className="flex flex-wrap gap-[3px] mt-2.5">
                  {HEATMAP.map((h, i) => (
                    <div key={i} className="w-[11px] h-[11px] rounded-[3px] transition-all hover:scale-[1.6] cursor-pointer"
                      style={{ background: h.c === 0 ? "rgba(0,180,216,0.02)" : `rgba(0,180,216,${0.08 + h.c * 0.16})`, boxShadow: h.c > 3 ? "0 0 4px rgba(0,180,216,0.2)" : "none" }} />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <span className="text-[7px] text-gray-700">Less</span>
                  {[0.02, 0.15, 0.35, 0.55, 0.82].map((o, i) => (
                    <div key={i} className="w-[10px] h-[10px] rounded-[2px]" style={{ background: `rgba(0,180,216,${o})` }} />
                  ))}
                  <span className="text-[7px] text-gray-700">More</span>
                </div>
              </Glass>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Glass className="p-4">
                <p className={label} style={mono}>weekly trend</p>
                <ResponsiveContainer width="100%" height={135} className="mt-2">
                  <AreaChart data={D.weekly}>
                    <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00B4D8" stopOpacity={0.12} /><stop offset="95%" stopColor="#00B4D8" stopOpacity={0} /></linearGradient></defs>
                    <XAxis dataKey="w" tick={{ fill: "#222", fontSize: 8 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#222", fontSize: 8 }} axisLine={false} tickLine={false} width={18} />
                    <Tooltip contentStyle={{ background: "rgba(5,12,30,0.95)", border: "1px solid rgba(0,180,216,0.1)", borderRadius: 10, fontSize: 9, ...mono }} />
                    <Area type="monotone" dataKey="a" stroke="#00B4D8" fill="url(#tg)" strokeWidth={1.5} name="Apps" />
                  </AreaChart>
                </ResponsiveContainer>
              </Glass>
              <Glass className="p-4">
                <p className={label} style={mono}>board performance</p>
                <ResponsiveContainer width="100%" height={135} className="mt-2">
                  <BarChart data={D.boards} layout="vertical">
                    <XAxis type="number" tick={{ fill: "#222", fontSize: 8 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="b" tick={{ fill: "#444", fontSize: 8 }} axisLine={false} tickLine={false} width={65} />
                    <Tooltip contentStyle={{ background: "rgba(5,12,30,0.95)", border: "1px solid rgba(0,180,216,0.1)", borderRadius: 10, fontSize: 9 }} />
                    <Bar dataKey="i" radius={[0, 5, 5, 0]} name="Interviews">{D.boards.map((e, i) => <Cell key={i} fill={e.c} fillOpacity={0.5} />)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Glass>
            </div>

            {/* Activity Feed */}
            <Glass className="p-4">
              <div className="flex items-center justify-between mb-2.5">
                <p className={label} style={mono}>live activity</p>
                <div className="flex items-center gap-1"><Radio size={8} className="text-cyan-500 animate-pulse" /><span className="text-[7px] text-cyan-700" style={mono}>{BOARDS[scanIdx]}...</span></div>
              </div>
              {D.activity.map((a, i) => { const I = actIcons[a.tp] || Zap; return (
                <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-white/[0.015] last:border-0">
                  <I size={11} className={`${actColors[a.tp]} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-500 leading-relaxed">{a.a}</p>
                    <p className="text-[8px] text-gray-800 mt-0.5" style={mono}>{a.t}</p>
                  </div>
                </div>
              ); })}
            </Glass>
          </div>
        )}

        {/* ════ PIPELINE ════ */}
        {tab === "pipeline" && (
          <div className="space-y-2.5">
            {D.pipeline.map((stage, si) => (
              <Glass key={si} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full`} style={{ background: ["#666", "#00B4D8", "#FFB300", "#9C27B0", "#00C853"][si], boxShadow: si > 0 ? `0 0 5px ${["", "#00B4D8", "#FFB300", "#9C27B0", "#00C853"][si]}40` : "" }} />
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500" style={mono}>{stage.stage}</p>
                  </div>
                  <span className="text-[8px] text-gray-700 bg-white/[0.03] px-1.5 py-0.5 rounded" style={mono}>{stage.items.length}</span>
                </div>
                {stage.items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 mb-1 rounded-xl border border-white/[0.03] hover:bg-cyan-500/[0.02] transition-all cursor-pointer group">
                    <div>
                      <p className="text-xs font-semibold">{it.co}</p>
                      <p className="text-[9px] text-gray-600">{it.ro}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" style={mono}>{it.kw}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${it.ats >= 90 ? "bg-green-500/[0.08] text-green-400 border border-green-500/[0.12]" : it.ats >= 80 ? "bg-cyan-500/[0.08] text-cyan-400 border border-cyan-500/[0.12]" : "bg-white/[0.03] text-gray-500 border border-white/[0.05]"}`} style={mono}>{it.ats}</span>
                    </div>
                  </div>
                ))}
                {stage.items.length === 0 && <p className="text-[10px] text-gray-700 text-center py-3" style={mono}>Empty</p>}
              </Glass>
            ))}
          </div>
        )}

        {/* ════ INTERVIEWS ════ */}
        {tab === "interviews" && (
          <div className="space-y-2.5">
            <Glass glow className="p-4">
              <div className="flex items-center justify-between">
                <div><p className="text-[7px] text-cyan-500 uppercase tracking-[0.25em]" style={mono}>next interview</p><p className="text-base font-black mt-1">{D.interviews[0].co}</p></div>
                <Countdown date={D.interviews[0].date} time={D.interviews[0].time} />
              </div>
            </Glass>

            {D.interviews.map((iv, i) => (
              <Glass key={i} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div><p className="text-sm font-bold">{iv.co}</p><p className="text-[9px] text-gray-600">{iv.ro}</p></div>
                  <div className="flex gap-1.5">
                    {iv.culture && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-yellow-500/[0.07] border border-yellow-500/[0.1] text-yellow-500 flex items-center gap-0.5"><Star size={7} />{iv.culture}</span>}
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${iv.type === "Video" ? "bg-cyan-500/[0.07] text-cyan-400 border border-cyan-500/[0.1]" : "bg-purple-500/[0.07] text-purple-400 border border-purple-500/[0.1]"}`}>{iv.type}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center gap-1.5"><Calendar size={9} className="text-gray-700" /><span className="text-[9px] text-gray-600" style={mono}>{iv.date}</span></div>
                  <div className="flex items-center gap-1.5"><Clock size={9} className="text-gray-700" /><span className="text-[9px] text-gray-600" style={mono}>{iv.time}</span></div>
                </div>
                {/* Weather + Commute */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {iv.wx && <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/[0.03] border border-yellow-500/[0.07]"><Cloud size={9} className="text-yellow-600/40" /><span className="text-[8px] text-yellow-500/60" style={mono}>{iv.wx}</span></div>}
                  {iv.cm && <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/[0.03] border border-cyan-500/[0.07]"><Car size={9} className="text-cyan-600/40" /><span className="text-[8px] text-cyan-500/60" style={mono}>{iv.cm}</span></div>}
                </div>
                {/* Address */}
                {iv.addr && <div className="mt-2.5 p-2.5 rounded-xl border border-white/[0.03]" style={{ background: "rgba(0,180,216,0.012)" }}><div className="flex items-start gap-2"><MapPin size={11} className="text-red-400 mt-0.5 flex-shrink-0" /><div><p className="text-[9px] text-gray-500">{iv.addr}</p><MapBtns addr={iv.addr} /></div></div></div>}
                {/* Video link */}
                {iv.link && <a href={iv.link} target="_blank" rel="noopener noreferrer" className="mt-2.5 flex items-center gap-1.5 p-2.5 rounded-xl bg-cyan-500/[0.03] border border-cyan-500/[0.08] hover:bg-cyan-500/[0.07] transition-all"><ExternalLink size={11} className="text-cyan-400" /><span className="text-[9px] text-cyan-400" style={mono}>Join Video Call</span></a>}
                {/* Prep bar */}
                <div className="mt-2.5">
                  <div className="flex justify-between mb-1"><span className={label} style={mono}>prep progress</span><span className="text-[8px] text-gray-600" style={mono}>{iv.prep}%</span></div>
                  <div className="w-full h-1 rounded-full bg-white/[0.03]"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${iv.prep}%`, background: iv.prep >= 80 ? "#00C853" : iv.prep >= 50 ? "#FFB300" : "#E53935", boxShadow: iv.prep >= 80 ? "0 0 6px #00C85325" : "" }} /></div>
                </div>
                {/* Practice */}
                <div className="mt-2.5 p-2 rounded-xl bg-purple-500/[0.02] border border-purple-500/[0.06]">
                  <p className="text-[7px] text-purple-400/50 uppercase tracking-[0.2em] mb-0.5" style={mono}>practice schedule</p>
                  <p className="text-[9px] text-gray-600">{iv.prep < 50 ? `Run 'Prep ${iv.co}' now. Practice 2 hrs/day until ${iv.date}.` : iv.prep < 80 ? "One more mock simulation + review company news." : "Light review day before. You're ready."}</p>
                </div>
                {/* Checklist for next interview */}
                {i === 0 && (
                  <div className="mt-2.5 p-2.5 rounded-xl border border-cyan-500/[0.07]" style={{ background: "rgba(0,180,216,0.012)" }}>
                    <p className="text-[7px] text-cyan-500/50 uppercase tracking-[0.2em] mb-1.5" style={mono}>interview day checklist</p>
                    {REAL_DATA.checklist.map((c, ci) => (
                      <div key={ci} className="flex items-center gap-1.5 py-[3px]">
                        <div className={`w-3 h-3 rounded border flex items-center justify-center ${c.d ? "bg-green-500/[0.12] border-green-500/20" : "border-white/[0.08]"}`}>
                          {c.d && <CheckCircle size={7} className="text-green-400" />}
                        </div>
                        <span className={`text-[9px] ${c.d ? "text-gray-600 line-through" : "text-gray-500"}`}>{c.t}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Glass>
            ))}
          </div>
        )}

        {/* ════ OFFERS ════ */}
        {tab === "offers" && (
          <div className="space-y-2.5">
            {D.offers.length === 0 ? (
              <Glass className="p-10 text-center"><Award size={28} className="text-gray-700 mx-auto mb-3" /><p className="text-gray-600 text-xs" style={mono}>No offers yet. Pipeline looks strong. Keep going.</p></Glass>
            ) : D.offers.map((o, i) => (
              <Glass key={i} glow className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: "0 0 6px #00C853" }} />
                  <p className="text-[7px] text-green-400 uppercase tracking-[0.25em] font-bold" style={mono}>active offer</p>
                </div>
                <p className="text-xl font-black">{o.co}</p>
                <p className="text-xs text-gray-600 mt-0.5">{o.ro}</p>

                <div className="grid grid-cols-2 gap-2.5 mt-4">
                  {[{ l: "compensation", v: o.sal, cls: "text-green-400", bg: "rgba(0,200,83,0.02)" },
                    { l: "start date", v: o.start, cls: "text-white", bg: "rgba(0,180,216,0.015)" },
                    { l: "work mode", v: o.remote, cls: "text-white text-[10px]", bg: "rgba(0,180,216,0.015)" },
                    { l: "deadline", v: o.dl, cls: "text-red-400", bg: "rgba(229,57,53,0.02)" }
                  ].map((f, fi) => (
                    <div key={fi} className="p-2.5 rounded-xl border border-white/[0.03]" style={{ background: f.bg }}>
                      <p className={label} style={mono}>{f.l}</p>
                      <p className={`text-sm font-bold mt-1 ${f.cls}`}>{f.v}</p>
                    </div>
                  ))}
                </div>

                {/* Bell Curve */}
                <div className="mt-3 p-3 rounded-xl border border-white/[0.03]" style={{ background: "rgba(0,180,216,0.012)" }}>
                  <div className="flex justify-between mb-1.5"><p className={label} style={mono}>market position</p><span className="text-[8px] text-green-400" style={mono}>{o.pct}th percentile</span></div>
                  <BellCurve pct={o.pct} />
                </div>

                <div className="mt-3 p-2.5 rounded-xl border border-white/[0.03]" style={{ background: "rgba(0,180,216,0.012)" }}>
                  <p className={label} style={mono}>benefits</p>
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{o.benefits}</p>
                </div>

                {/* Maps */}
                <div className="mt-3 p-3.5 rounded-xl border border-white/[0.04]" style={{ background: "linear-gradient(135deg, rgba(0,180,216,0.015), rgba(100,60,180,0.015))" }}>
                  <div className="flex items-center gap-1.5 mb-2"><MapPin size={13} className="text-red-400" /><p className="text-[9px] font-bold">Office Location</p></div>
                  <p className="text-[10px] text-gray-500">{o.addr}</p>
                  <MapBtns addr={o.addr} />
                  <div className="mt-2.5 rounded-xl overflow-hidden border border-white/[0.04] h-32">
                    <iframe width="100%" height="100%" frameBorder="0" loading="lazy" allowFullScreen
                      style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.85) contrast(1.15)" }}
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(o.addr)}&zoom=14`} />
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button onClick={() => { setConfetti(true); setTimeout(() => setConfetti(false), 3500); }}
                    className="flex-1 py-2.5 rounded-xl bg-green-500/[0.08] border border-green-500/[0.15] text-green-400 text-[10px] font-bold hover:bg-green-500/[0.15] transition-all flex items-center justify-center gap-1.5">
                    <CheckCircle size={13} /> Accept Offer
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl bg-yellow-500/[0.04] border border-yellow-500/[0.1] text-yellow-400 text-[10px] font-bold hover:bg-yellow-500/[0.1] transition-all flex items-center justify-center gap-1.5">
                    <ArrowUpRight size={13} /> Negotiate
                  </button>
                </div>
              </Glass>
            ))}
          </div>
        )}
      </div>

      {/* ── Chat Widget ── */}
      {chatOpen && (
        <div className="fixed bottom-20 right-4 left-4 sm:left-auto sm:w-80 z-50 rounded-2xl border border-cyan-500/[0.1] overflow-hidden"
          style={{ background: "rgba(3,10,25,0.96)", backdropFilter: "blur(30px)", boxShadow: "0 0 35px rgba(0,180,216,0.07)" }}>
          <div className="flex items-center justify-between p-2.5 border-b border-white/[0.03]">
            <div className="flex items-center gap-1.5"><Shield size={12} className="text-cyan-400" /><span className="text-[9px] font-bold tracking-widest" style={mono}>BLUE</span><span className="w-1 h-1 rounded-full bg-green-400" /></div>
            <button onClick={() => setChatOpen(false)}><X size={11} className="text-gray-700 hover:text-gray-400" /></button>
          </div>
          <div className="h-48 overflow-y-auto p-2.5 space-y-1.5">
            {chatHist.map((m, i) => (
              <div key={i} className={`flex ${m.f === "u" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-2.5 py-1.5 rounded-xl text-[9px] leading-relaxed ${m.f === "u" ? "bg-cyan-500/[0.1] text-cyan-200 border border-cyan-500/[0.1]" : "bg-white/[0.02] text-gray-500 border border-white/[0.03]"}`} style={mono}>{m.t}</div>
              </div>
            ))}
            <div ref={chatEnd} />
          </div>
          <div className="p-2.5 border-t border-white/[0.03] flex gap-1.5">
            <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()}
              placeholder="Talk to BLUE..." className="flex-1 bg-white/[0.02] border border-white/[0.04] rounded-xl px-2.5 py-1.5 text-[9px] text-white placeholder-gray-800 outline-none focus:border-cyan-500/15" style={mono} />
            <button onClick={sendChat} className="p-1.5 rounded-xl bg-cyan-500/[0.08] border border-cyan-500/[0.1] hover:bg-cyan-500/[0.15] transition-all">
              <Send size={11} className="text-cyan-400" />
            </button>
          </div>
        </div>
      )}

      {/* Chat FAB */}
      <button onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-5 right-4 w-12 h-12 rounded-2xl flex items-center justify-center z-50 transition-all active:scale-95 hover:scale-105"
        style={{ background: "linear-gradient(135deg, #0080DD, #00B4D8)", boxShadow: "0 0 20px rgba(0,180,216,0.22)" }}>
        {chatOpen ? <X size={18} /> : <MessageCircle size={18} />}
      </button>

      <style>{`
        @keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
        @keyframes slideIn { 0% { transform: translateX(120%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
}