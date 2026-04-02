# BLUE v3.0 GOD TIER — Autonomous Career OS Dashboard

## 🚀 Deploy in 3 Steps

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Test locally (optional but recommended)
```bash
npm run dev
```
Open http://localhost:5173 to verify everything looks correct.

### Step 3 — Deploy to Vercel (FREE)

**Option A: One command deploy (easiest)**
```bash
npx vercel --prod
```
- It will ask you to log in / create a free Vercel account
- Accept all default settings
- Your live URL is printed when done (e.g. https://blue-dashboard.vercel.app)

**Option B: GitHub → Vercel (best for updates)**
1. Push this folder to a GitHub repo
2. Go to https://vercel.com → New Project → Import your repo
3. Vercel auto-detects Vite — click Deploy
4. Done. Every git push auto-deploys.

---

## 📁 File Structure
```
blue-dashboard/
├── public/
│   └── favicon.svg          ← BLUE shield icon
├── src/
│   ├── Dashboard.jsx         ← Your full GOD TIER dashboard
│   ├── main.jsx              ← React entry point
│   └── index.css             ← Tailwind + scrollbar styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🛠 Tech Stack
- React 18 + Vite 5
- Tailwind CSS 3
- Recharts (charts)
- Lucide React (icons)

## 💡 Custom Domain (optional)
In Vercel dashboard → your project → Settings → Domains
Add: `blue.yourdomain.com` or any domain you own.
