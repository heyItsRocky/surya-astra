# ☀️ Surya-Astra

**Solar Flare Intelligence Dashboard**  
*ISRO Bharatiya Antriksh Hackathon 2026 — Problem Statement 15*

> Forecasting and/or Nowcasting of Solar Flares using combined Soft and Hard X-ray data from Aditya-L1

[![CI](https://github.com/heyItsRocky/surya-astra/actions/workflows/ci.yml/badge.svg)](https://github.com/heyItsRocky/surya-astra/actions/workflows/ci.yml)

---

## ✨ Features

| Feature | Description |
|---|---|
| **3D Interactive Sun** | R3F sphere with GLSL shaders, particle corona, scroll-driven disintegration |
| **Scroll Narrative** | 6-section SPA, Lenis smooth scroll, section dots + mobile hamburger nav |
| **Live Dashboard** | Nowcast flux chart, forecast probabilities, alerts, metrics — all with loading/error/retry |
| **Threshold Nowcaster (backend)** | Python FastAPI: A/B/C/M/X classification, CME risk, 24h forecast probabilities |
| **Mock ↔ Real API toggle** | `NEXT_PUBLIC_USE_MOCK` switches offline demo vs live backend |
| **Error boundaries** | 3D scene and dashboard fail soft with fallbacks |

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| **3D** | React Three Fiber, drei, custom GLSL, postprocessing |
| **Charts / State** | Recharts, TanStack React Query v5 |
| **Animation** | Anime.js v4, Lenis, Framer Motion |
| **Backend** | Python 3, FastAPI, Pydantic, threshold nowcaster (no ML runtime required) |
| **Tests** | Vitest + Testing Library (frontend), pytest (backend) |
| **CI** | GitHub Actions — lint, typecheck, test, build |

---

## 🚀 Quickstart

### Prerequisites

- Node.js 20+ (22 recommended) and npm
- Python 3.11+ (for backend)

### 1. Frontend — mock mode (offline demo)

```bash
git clone https://github.com/heyItsRocky/surya-astra.git
cd surya-astra
npm ci

cp .env.example .env.local
# Ensure:
#   NEXT_PUBLIC_USE_MOCK=true

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 2. Backend — real API

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

uvicorn main:app --host 127.0.0.1 --port 8000
```

Health check:

```bash
curl http://127.0.0.1:8000/api/health
```

Endpoints (all return `{ success, data, timestamp, error }`):

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Service health |
| GET | `/api/nowcast` | Flux history, class, CME risk, active regions |
| GET | `/api/forecast` | 24h C/M/X probabilities, trend, confidence |
| GET | `/api/alerts` | Space weather alerts |
| GET | `/api/mission` | Aditya-L1 mission info |
| GET | `/api/team` | Team members |

Interactive docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 3. Frontend — real backend mode

In `.env.local`:

```bash
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Restart `npm run dev`. Dashboard widgets now call the FastAPI service directly (CORS allows `localhost:3000`).

> **Note:** The Vercel rewrite in `vercel.json` (`/api/:path*` → Railway) is **production-only**. Local development uses `NEXT_PUBLIC_API_URL` directly.

---

## 🧪 Tests & quality gates

```bash
npm run lint        # ESLint (flat config, next/core-web-vitals)
npx tsc --noEmit    # TypeScript
npm test            # Vitest unit tests (frontend)
npm run build       # Production build
npm run analyze     # Bundle analyzer report (ANALYZE=true)

# Backend
cd backend && python -m pytest tests -q
```

CI runs all of the above on push/PR to `main` (see `.github/workflows/ci.yml`).

---

## 📂 Project structure

```
surya-astra/
├── src/
│   ├── app/                 # App Router layout + page
│   ├── components/
│   │   ├── dashboard/       # 4 widgets (loading/error/retry)
│   │   ├── sections/        # Hero, Problem, Mission, Solution, Team
│   │   ├── three/           # 3D Sun (R3F + GLSL)
│   │   ├── navigation/      # TopNav, SectionDots, MobileNav
│   │   └── ui/              # ErrorBoundary
│   ├── hooks/               # useCountUp, useScrollSection
│   └── lib/                 # api (mock/real), types, mock-data, utils
├── backend/                 # FastAPI + threshold nowcaster
│   ├── main.py
│   ├── nowcaster.py
│   ├── data_fetcher.py      # seed JSON + optional NOAA SWPC
│   ├── seed_data.json
│   ├── requirements.txt
│   ├── Dockerfile
│   └── tests/
├── presentation/            # Deck notes, architecture, screenshots
├── docs/DEPLOY.md           # Vercel + Railway runbook
├── public/                  # favicon, robots, sitemap, OG
└── .github/workflows/ci.yml
```

---

## 🌐 Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_USE_MOCK` | `true` (via `.env.example`) | `true` = offline mock data; `false` = call real API |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend base URL when not using mock |

Copy `.env.example` → `.env.local`. Never commit `.env.local` (gitignored).

---

## 🚢 Deployment (zero budget)

See **[docs/DEPLOY.md](docs/DEPLOY.md)** for step-by-step Vercel + Railway instructions.

Summary:

1. **Backend → Railway (or Render):** root directory `backend`, start command  
   `uvicorn main:app --host 0.0.0.0 --port $PORT`, health path `/api/health`
2. **Frontend → Vercel:** framework Next.js, env  
   `NEXT_PUBLIC_USE_MOCK=false`, `NEXT_PUBLIC_API_URL=https://<railway-url>`
3. `vercel.json` rewrites `/api/:path*` → Railway (update destination URL if renamed)

---

## 📊 Approach

**Hybrid: Threshold nowcasting (implemented) + path for ML forecasting**

| Stage | Method | Input | Output |
|---|---|---|---|
| Nowcast | Threshold + trend heuristics (`backend/nowcaster.py`) | X-ray flux series | Class, CME risk, alerts |
| Forecast | Statistical baseline over recent flux | Last N readings | P(C), P(M), P(X), confidence |

Seed data simulates 7 days of SoLEXS/HEL1OS-like flux; `?use_real_data=true` can pull NOAA SWPC X-ray summaries as a stand-in live feed.

---

## 📁 Presentation

- [PRESENTATION_SCRIPT.md](PRESENTATION_SCRIPT.md) — 10-slide talk track
- [presentation/](presentation/) — architecture notes, deck outline, screenshots

---

## 📝 License

MIT — Built for ISRO's Bharatiya Antriksh Hackathon 2026.

---

*"From the Sun to the Earth — watching, waiting, and warning."* ☀️🛡️
