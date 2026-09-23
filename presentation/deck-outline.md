# Surya-Astra — 10-Slide Deck Outline

Companion to `../PRESENTATION_SCRIPT.md`.

---

### Slide 1 — Title
- **Title:** Surya-Astra — Solar Flare Intelligence Dashboard  
- **Subtitle:** PS15 · Bharatiya Antriksh Hackathon 2026  
- **Team:** Rakshith (+ Ghost AI co-pilot)  
- **Visual:** dark space + sun mark from `public/favicon.svg`

### Slide 2 — Team
- Rakshith — Lead, architecture, frontend, pipeline design  
- Ghost AI — Agentic co-pilot (codegen, docs)  
- Note: lean team, full-stack delivery

### Slide 3 — Opportunity / USP
- Dual soft+hard X-ray view (SoLEXS + HEL1OS) on **Indian L1 platform**  
- Gap: most systems use single source or magnetograms only  
- USP: threshold nowcast (physics) + path to probabilistic forecast, immersive dashboard

### Slide 4 — Features
1. Real-time nowcasting (class + CME risk)  
2. 24h C/M/X probabilities  
3. 3D scroll narrative + live charts  
4. Alerts timeline with severity levels

### Slide 5 — Process flow
```
SoLEXS/HEL1OS flux → Feature window → Threshold nowcaster
                              ↓
                    Probabilistic forecast (C/M/X)
                              ↓
                    Dashboard + alert levels
```
(Include seed/NOAA SWPC input as current data plane.)

### Slide 6 — Wireframes / demo screens
- Hero 3D sun  
- Nowcast flux chart  
- Forecast rings  
- Alerts + metrics  
→ `presentation/screenshots/`

### Slide 7 — Architecture
- **Presentation:** Next.js 16, R3F, Recharts, React Query  
- **Logic:** `lib/api.ts` mock/real toggle, ErrorBoundary, widgets  
- **Data:** FastAPI threshold nowcaster + seed/NOAA feed  
→ `presentation/architecture.svg`

### Slide 8 — Technologies
Next.js 16 · React 19 · TypeScript · Tailwind v4 · R3F · Recharts · TanStack Query · FastAPI · Pydantic · Vercel/Railway free tier · GitHub Actions CI

### Slide 9 — Cost
- Prototype: **$0** (Vercel free + Railway/Render free + open source)  
- Scale estimate: modest serverless + data pipeline budget (~$20–50/mo illustrative)

### Slide 10 — Thank you / Q&A
- Live demo offer → local mock mode or deployed URL  
- Point judges to README + FAQ.md
