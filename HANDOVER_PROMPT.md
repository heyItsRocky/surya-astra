# Surya-Astra — New Session Handover Prompt

> Copy this entire file as your first message in a new opencode session.

---

## Context

I'm working on **Surya-Astra** — a Solar Flare Intelligence Dashboard built for ISRO Bharatiya Antriksh Hackathon 2026 (PS15). The frontend is ~90% done. The backend is 0%. There is no deadline — this is a completion project.

**Repository:** `~/Projects/ISRO-Projects/ISRO-BAH-2026/`
**GitHub:** `heyItsRocky/surya-astra`
**Stack:** Next.js 16, React 19, Three.js/R3F, Tailwind v4, TypeScript 5.9

## Current State

### What Exists (Frontend — Solid)
- Custom GLSL shaders for 3D Sun visualization (270 lines of shader code)
- 5,000-particle coronal system with scroll-driven disintegration
- Post-processing pipeline: Bloom, ChromaticAberration, Noise, Vignette
- 6 page sections: Hero, Problem, Mission, Solution, Dashboard, Team
- 4 dashboard widgets: Nowcast, Forecast, Metrics, Events
- Navigation: TopNav, SectionDots, IntroSequence
- Mock API layer with `NEXT_PUBLIC_USE_MOCK` toggle
- 5 commits already pushed to GitHub

### What's Missing
1. **No `public/` directory** — no favicon, robots.txt, sitemap.xml, OG images
2. **No Error Boundaries** — 3D scene or dashboard crash = whole app dies
3. **No loading/error states** — dashboard widgets show spinner forever on API failure
4. **No SEO** — no Open Graph, no Twitter cards
5. **No `.env.example`**
6. **No tests** — zero test files, no vitest configured
7. **No mobile nav** — SectionDots hidden on mobile, no hamburger
8. **No backend** — all 5 API endpoints throw `Error('Real API not implemented yet')`
9. **No deployment config** — no vercel.json, no CI/CD

### Git Status
8 modified files (safe improvements to shaders + dashboard widgets), 1 new plan file. Ready to commit.

## What To Build

### Phase 1: Commit + Frontend Polish
1. Commit the 8 modified files (shaders, dashboard widgets, api.ts, lockfile)
2. Create `public/` with favicon, robots.txt, sitemap.xml, OG placeholder
3. Add SEO metadata (Open Graph, Twitter cards) to `src/app/layout.tsx`
4. Create `src/components/ui/error-boundary.tsx` — wrap 3D scene + dashboard
5. Add loading/error/retry states to all 4 dashboard widgets
6. Create `.env.example` with `NEXT_PUBLIC_USE_MOCK` and `NEXT_PUBLIC_API_URL`
7. Lazy-load dashboard widgets with `next/dynamic`
8. Add mobile hamburger nav for <768px
9. Create `vercel.json`
10. Commit + push

### Phase 2: Python Backend (Threshold Nowcaster)
Build a simple Python/FastAPI backend:

```
backend/
├── main.py              # FastAPI app with CORS
├── nowcaster.py         # Threshold-based flare classification
├── models.py            # Pydantic response models
├── data_fetcher.py      # Load seed data or fetch NOAA JSON
├── seed_data.json       # 7 days of realistic synthetic solar flux data
├── requirements.txt     # fastapi, uvicorn, httpx, pydantic
└── .env.example
```

**Core logic in `nowcaster.py`:**
- `classify_flux(value)` → maps W/m² to A/B/C/M/X class
- `compute_cme_risk(flux_history)` → 0-1 risk score from recent spike detection
- `compute_forecast_probabilities(flux_history)` → C/M/X probabilities for next 24h
- All based on simple threshold math, no ML

**Seed data:** Generate 7 days of realistic X-ray flux readings (A-class background with occasional C/M spikes). Store as JSON.

**Endpoints:**
```
GET /api/nowcast     → current flux, class, CME risk, active regions
GET /api/forecast    → 24h flare probabilities
GET /api/alerts      → active space weather alerts
GET /api/mission     → Aditya-L1 mission info
GET /api/health      → backend health check
```

**Wire frontend:** Update `src/lib/api.ts` to hit the real backend when `USE_MOCK=false`.

### Phase 3: Deploy
- Frontend → Vercel (free tier, connect GitHub repo)
- Backend → Railway or Render (free tier, Python app)

## Key Files to Read First
- `src/lib/types.ts` — all type definitions
- `src/lib/api.ts` — API layer (currently mock-only)
- `src/lib/mock-data.ts` — what the dashboard expects
- `src/app/layout.tsx` — metadata lives here
- `src/components/dashboard/` — all 4 widgets
- `src/components/three/` — 3D scene components
- `COMPLETION_GUIDE.md` — detailed completion checklist
- `PLAN_OPTION_A.md` — full execution plan (already written)

## Constraints
- Zero budget — use free tiers only
- No deadline — take time to do it right
- Frontend must work with mock data (toggle) AND real backend
- Backend is Python/FastAPI, not Node.js
- Deploy frontend to Vercel, backend separately

## Your Task
1. Read the files listed above
2. Execute Phase 1 (commit + frontend polish)
3. Execute Phase 2 (Python backend)
4. Verify everything works together
5. Prepare for Phase 3 (deployment — I'll handle the Vercel/Railway accounts)

Start by reading the project files, then begin with Phase 1. Let me know if anything needs clarification.
