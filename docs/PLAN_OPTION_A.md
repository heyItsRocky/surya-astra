# SURYA-ASTRA — Execution Plan (Option A: Threshold Nowcaster)

> **Goal:** Deploy a working solar flare dashboard with a real (simple) Python backend.
> **Timeline:** 1-2 sessions
> **Scope:** Threshold-based nowcaster — "if flux > X, alert Y"

---

## Phase 1: Commit Existing Work (5 min)

**Status:** ✅ Done (commit `13ccf69` + later commits).

**What:** Commit the 8 modified files that are sitting uncommitted.

```
Files to commit:
- src/lib/api.ts                  (2 lines)
- src/components/dashboard/*      (3 files, 3 lines each)
- src/components/three/*          (4 files, shader improvements)
- package-lock.json               (cleanup)
```

**Command:**
```bash
git add -A && git commit -m "feat: improve 3D sun shaders, dashboard widgets, and lockfile"
git push origin main
```

---

## Phase 2: Frontend Polish (2-3 hrs)

### 2a. Create `public/` directory
- `public/favicon.ico` — simple sun icon (I'll generate an SVG-based one)
- `public/robots.txt` — allow all crawlers
- `public/sitemap.xml` — single-page, just the root URL
- `public/og-image.png` — placeholder (1200x630, dark theme, "Surya-Astra" text)

### 2b. SEO metadata in `layout.tsx`
- Add Open Graph tags (title, description, image, url)
- Add Twitter card meta tags
- Add `robots` directive
- Add canonical URL

### 2c. Error Boundaries
- Create `src/components/ui/error-boundary.tsx`
- Wrap `SunSceneWrapper` in ErrorBoundary (fallback: gradient blob)
- Wrap `DashboardSection` in ErrorBoundary (fallback: "Dashboard unavailable")

### 2d. Dashboard Loading/Error States
- All 4 widgets (Nowcast, Forecast, Events, Metrics) need:
  - `isLoading` state → show skeleton/spinner
  - `isError` state → show error message + retry button
- Currently: widgets call API, if it throws they show nothing forever

### 2e. Create `.env.example`
```
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2f. Lazy-load Dashboard Widgets
- Wrap each widget in `next/dynamic` with loading skeleton
- Reduces initial bundle size

### 2g. Mobile Nav
- Add hamburger menu component for mobile (<768px)
- Hide SectionDots on mobile, show hamburger

### 2h. Commit + Push
```bash
git add -A && git commit -m "feat: error boundaries, SEO, loading states, mobile nav"
git push origin main
```

---

## Phase 3: Python Backend — Threshold Nowcaster (3-4 hrs)

### 3a. Project Structure
```
backend/
├── main.py              # FastAPI app
├── nowcaster.py         # Threshold logic
├── models.py            # Pydantic response models
├── data_fetcher.py      # Fetch real NOAA data (or serve cached)
├── requirements.txt     # fastapi, uvicorn, httpx, pydantic
├── Dockerfile           # Container for deployment
└── .env.example         # NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3b. Core Logic (`nowcaster.py`)

The "nowcaster" is simple math:

```python
# Solar flare classes by X-ray flux threshold (W/m²)
FLUX_THRESHOLDS = {
    'A': 1e-8,    # Background
    'B': 1e-7,    # Quiet
    'C': 1e-6,    # Common
    'M': 1e-5,    # Moderate — can cause radio blackouts
    'X': 1e-4,    # Extreme — satellite damage, grid failures
}

def classify_flux(flux_value: float) -> str:
    """Convert raw W/m² to flare class."""
    if flux_value >= 1e-4: return 'X'
    if flux_value >= 1e-5: return 'M'
    if flux_value >= 1e-6: return 'C'
    if flux_value >= 1e-7: return 'B'
    return 'A'

def compute_cme_risk(flux_history: list[float]) -> float:
    """Simple CME risk: if flux spiked >10x in last 6hrs, risk goes up."""
    if len(flux_history) < 6: return 0.1
    recent = flux_history[-6:]
    peak = max(recent)
    baseline = min(recent)
    if baseline == 0: return 0.5
    ratio = peak / baseline
    return min(1.0, ratio / 100)  # Normalize to 0-1

def compute_forecast_probabilities(flux_history: list[float]) -> dict:
    """Estimate next-24h flare probability from recent trend."""
    recent_avg = sum(flux_history[-12:]) / 12
    trend = flux_history[-1] - flux_history[0]

    # Simple probability model
    c_prob = min(0.95, 0.3 + (recent_avg / 1e-6) * 0.1)
    m_prob = min(0.8, 0.05 + (recent_avg / 1e-5) * 0.15)
    x_prob = min(0.3, 0.01 + (recent_avg / 1e-4) * 0.1)

    if trend > 0:  # Flux increasing
        c_prob *= 1.2
        m_prob *= 1.3
        x_prob *= 1.5

    return {
        'C': min(0.95, c_prob),
        'M': min(0.8, m_prob),
        'X': min(0.3, x_prob),
    }
```

### 3c. Data Source

**Option 1: Real NOAA data (recommended)**
- NOAA provides free JSON feeds: `https://services.swpc.noaa.gov/json/`
- Endpoint: `/products/xray-flux.json` — real-time X-ray flux from GOES satellites
- We fetch this, process it, return our own formatted response

**Option 2: Cached seed data**
- Generate 7 days of realistic synthetic solar data
- Store in `data/solar_seed.json`
- Backend reads from file (no network dependency)
- Good for demo/offline mode

**Recommendation:** Start with Option 2 (seed data), add Option 1 (real NOAA) as upgrade.

### 3d. API Endpoints

```
GET /api/nowcast          → Current flux, class, CME risk, active regions
GET /api/forecast         → 24h flare probabilities (C, M, X)
GET /api/alerts           → Active space weather alerts
GET /api/mission          → Aditya-L1 mission info
GET /api/health           → Backend health check
```

### 3e. Wire Frontend

Update `src/lib/api.ts`:
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = {
  getNowcast: async () => {
    if (USE_MOCK) return withLatency(mockNowcast)
    const res = await fetch(`${API_BASE}/api/nowcast`)
    return res.json()
  },
  // ... same for forecast, alerts, mission, team
}
```

### 3f. CORS + Dev Setup
- Backend runs on `localhost:8000`
- Frontend runs on `localhost:3000`
- Add CORS middleware in FastAPI to allow both

---

## Phase 4: Deployment (1-2 hrs)

### 4a. Frontend → Vercel
1. Create `vercel.json` (if needed — Next.js usually auto-detects)
2. Push to GitHub
3. Connect repo to Vercel (free tier)
4. Set env var: `NEXT_PUBLIC_API_URL=https://<your-backend-url>`

### 4b. Backend → Railway or Render
- Both have free tiers for Python apps
- Connect GitHub repo, auto-deploy on push
- Set env vars for production

### 4c. `.github/workflows/ci.yml`
```yaml
name: CI
on: [push, pull_request]
jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run build
```

---

## Deliverables Checklist

| # | Task | Status |
|---|------|--------|
| 1 | Commit existing work | ⬜ |
| 2 | `public/` directory (favicon, robots, sitemap, OG) | ⬜ |
| 3 | SEO metadata in layout.tsx | ⬜ |
| 4 | Error Boundaries | ⬜ |
| 5 | Dashboard loading/error states | ⬜ |
| 6 | `.env.example` | ⬜ |
| 7 | Lazy-load dashboard widgets | ⬜ |
| 8 | Mobile hamburger nav | ⬜ |
| 9 | Python backend with nowcaster | ⬜ |
| 10 | Seed data (realistic solar data) | ⬜ |
| 11 | Wire frontend to backend | ⬜ |
| 12 | `vercel.json` + deployment config | ⬜ |
| 13 | CI/CD pipeline | ⬜ |
| 14 | Push + deploy | ⬜ |

---

## Time Estimate

| Phase | Time |
|-------|------|
| Phase 1: Commit existing | 5 min |
| Phase 2: Frontend polish | 2-3 hrs |
| Phase 3: Python backend | 3-4 hrs |
| Phase 4: Deployment | 1-2 hrs |
| **Total** | **~7-9 hrs** |

---

## What The Judges Will See

1. **Beautiful 3D sun visualization** with custom GLSL shaders
2. **Real-time dashboard** showing actual solar flux data
3. **Threshold-based nowcaster** that classifies flares and predicts risk
4. **Working deployment** at a public URL
5. **Clean code** with error handling, types, and tests

This is a solid hackathon submission. Not overengineered, not underdelivered.
