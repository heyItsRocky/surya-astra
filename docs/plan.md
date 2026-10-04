# ☀️ SURYA-ASTRA — Master Execution Plan

## Objective
Build a jaw-dropping prototype + PPT submission for ISRO BAH 2026 — single-page scroll narrative (animejs.com style) with 3D R3F Sun that disintegrates into particles, live dashboard widgets (mock data), and 10-slide PPT.

## Timeline
- **Deadline:** July 1, 2026 (3 days)
- **Team:** Rakshith (builder) + Ghost AI (co-pilot)

## Tech Stack
- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + dark theme
- **3D:** React Three Fiber + drei + postprocessing + Lamina
- **Animation:** Anime.js v4 + Lenis (smooth scroll) + Framer Motion (scroll tracking)
- **Charts:** Recharts (dashboard widgets)
- **UI:** shadcn/ui (Base UI primitives)
- **Data:** Mock data only (no backend)

## Theme
- **Background:** `#050510` (deep space black)
- **Accent:** `#FF6B35` (solar orange), `#FFD700` (gold)
- **Alert:** `#FF3366` (flare red)
- **Plasma:** `#8B5CF6` (purple)
- **Font:** Inter (body) + Orbitron (display/headings)

## 6 Website Sections
1. **Hero** — 3D Sun auto-rotates, boiling surface, particle corona, title "Surya-Astra"
2. **The Problem** — Flare impact stats (counters), 3 cards: Satellites/GPS/Grid
3. **The Mission** — Aditya-L1, SoLEXS/HEL1OS, orbit diagram, timeline
4. **The Solution** — Pipeline diagram (4 steps), Hybrid Threshold+XGBoost, metrics
5. **Live Dashboard** — Nowcast (flux chart), Forecast (probability rings), Events (timeline)
6. **Team** — Rakshith + Ghost AI, scroll-to-top

## Phase Breakdown

### Phase 0 — Foundation (30 min, Hellcat)
| # | File(s) | Description |
|---|---|---|
| 0.1 | `/mnt/e/Surya-Astra/surya-astra/` | `npx create-next-app@latest` with TS, Tailwind, App Router. Install: `@react-three/fiber @react-three/drei @react-three/postprocessing three animejs lenis recharts @tanstack/react-query class-variance-authority clsx tailwind-merge lucide-react date-fns`. Dev deps: `@types/three @types/react-plotly.js`. Run `npx shadcn@latest init`. Add components: `button card badge input select table tabs separator scroll-area skeleton` |
| 0.2 | `src/app/globals.css` | Tailwind v4 `@theme`: custom colors, dark mode base |
| 0.3 | `.env.local` | `NEXT_PUBLIC_USE_MOCK=true` |
| 0.4 | `src/lib/utils.ts` | `cn()` helper |

### Phase 1 — Scroll Shell & Nav (1 hr, Hellcat)
| # | File(s) | Description |
|---|---|---|
| 1.1 | `src/app/layout.tsx` | `<ReactLenis root>` wrapper, fonts, metadata |
| 1.2 | `src/components/navigation/section-dots.tsx` | Right-side 6-dot nav, active dot highlighted |
| 1.3 | `src/hooks/use-scroll-section.ts` | Tracks active section via Lenis scroll |
| 1.4 | `src/app/page.tsx` | 6 section containers, `scroll-snap-type: y mandatory` |
| 1.5 | `src/components/navigation/scroll-indicator.tsx` | Animated scroll-down arrow |

### Phase 1B — Providers & API (30 min, parallel Hellcat)
| # | File(s) | Description |
|---|---|---|
| 1B.1 | `src/components/providers.tsx` | TanStack Query provider |
| 1B.2 | `src/lib/types.ts` | TypeScript interfaces for all data |
| 1B.3 | `src/lib/mock-data.ts` | Mock data generators (realistic flare patterns) |
| 1B.4 | `src/lib/api.ts` | 5 API functions (all mock, 200-500ms delay) |

### Phase 2 — 3D Sun Hero (3 hrs, Architect→Hellcat, parallel with 1/1B)
| # | File(s) | Description |
|---|---|---|
| 2.1 | `src/components/three/dynamic-sun.tsx` | Dynamic import wrapper with `ssr: false` |
| 2.2 | `src/components/three/sun-canvas.tsx` | Canvas with camera, lights, Suspense |
| 2.3 | `src/components/three/sun-scene.tsx` | Scene: SunMesh, SunParticles, EffectComposer |
| 2.4 | `src/components/three/sun-mesh.tsx` | Sphere with shader — boiling surface, emissive glow |
| 2.5 | `src/components/three/sun-particles.tsx` | 2000-5000 corona particles with pulse animation |
| 2.6 | `src/components/three/scroll-manager.tsx` | Sun disintegration on scroll: intact → fracture → particles |
| 2.7 | `src/components/three/effects.tsx` | Bloom + ChromaticAberration post-processing |

### Phase 3 — Content Sections (2 hrs, Hellcat)
| # | File(s) | Description |
|---|---|---|
| 3.1 | `src/components/sections/problem-section.tsx` | Stats counters + 3 impact cards |
| 3.2 | `src/components/sections/mission-section.tsx` | Orbit diagram + instrument cards + timeline |
| 3.3 | `src/components/sections/solution-section.tsx` | Pipeline flowchart + metrics |
| 3.4 | `src/components/sections/team-section.tsx` | Team profiles + scroll-to-top |

### Phase 4 — Dashboard Widgets (2 hrs, Hellcat)
| # | File(s) | Description |
|---|---|---|
| 4.1 | `src/components/sections/dashboard-section.tsx` | Tabs container for dashboard panels |
| 4.2 | `src/components/dashboard/nowcast-panel.tsx` | Flux chart + status badge + temperature gauge |
| 4.3 | `src/components/dashboard/forecast-panel.tsx` | 3 probability rings (SVG animated) |
| 4.4 | `src/components/dashboard/events-timeline.tsx` | Vertical events timeline |
| 4.5 | `src/components/dashboard/metrics-grid.tsx` | 4 mini stat cards with sparklines |

### Phase 5 — Animations & Polish (3 hrs, Hellcat)
| # | File(s) | Description |
|---|---|---|
| 5.1 | `src/components/sections/hero-section.tsx` | Wraps DynamicSunCanvas with overlay text |
| 5.2 | Anime.js entrance animations | Section entry: fade-up + stagger on children |
| 5.3 | Number counters | `useCountUp` hook via requestAnimationFrame |
| 5.4 | `src/components/layout/scroll-to-top.tsx` | Floating back-to-top button |
| 5.5 | Performance pass | Lazy load R3F, memoize chart data, bundler check |
| 5.6 | Responsive pass | 1440/1024/768/375px. Hide R3F on mobile |

### Phase 6 — PPT & Submission (2 hrs, Viper + Hellcat)
| # | File(s) | Description |
|---|---|---|
| 6.1 | `presentation/architecture.svg` | Pipeline architecture diagram |
| 6.2 | `presentation/wireframes.png` | 2x2 wireframe mockups |
| 6.3 | `presentation/screenshots/` | Full-page screenshots |
| 6.4 | PPT Template | Fill 10 slides (see template sections) |
| 6.5 | `presentation/README.md` | Talking points per slide |
| 6.6 | Final `npm run build` | Production build verification |

## PPT Content Outline (10 slides)
1. Title — Surya-Astra, Rakshith, Problem Statement 15
2. Team Members — 4 slots (user + AI fills remaining)
3. Opportunity — Hybrid SoLEXS+HEL1OS approach, real-time scroll UI
4. Features — Nowcast, Forecast, Events Timeline, 3D Visualization
5. Process Flow — Pipeline architecture diagram
6. Wireframes — App mockups
7. Architecture Diagram — Data ingestion + ML pipeline + frontend
8. Technologies — Next.js, R3F, Anime.js, XGBoost, Recharts
9. Estimated Cost — Open-source, hosting ~₹0
10. Thank You

## Risk Mitigations
- R3F + Next.js SSR: Use `dynamic(() => ..., { ssr: false })`
- Lenis vs Anime.js conflicts: Test early, fallback to CSS scroll-behavior
- Anime.js v4 API quirks: Fallback to Framer Motion useInView
- 3D Sun disintegration too complex: Tier 1 = simple particle explosion
- Time running out: Prioritize PPT with static screenshots first

## Verification Gates
- G0: After Phase 0 → `npm run build` clean
- G1: After Phase 2 → 3D Sun renders
- G2: After Phase 4 → Dashboard shows mock data
- G3: After Phase 5 → Full scroll experience works
- G4: Before Phase 6 → Production build succeeds
- G5: Final → Full app runs in production mode

## Execution Strategy (Maximizing big-pickle preset)
```
Ghost dispatches via /task tool → Hellcat implements
Parallel where possible:
  Task A: Phase 0 (scaffold)  +  Task B: code-architect R3F design
  After A → Task C: Phase 1 (shell)  
  After B → Task D: Phase 2 (3D Sun)
  After C → Task E1: Phase 3 + Task E2: Phase 4 (parallel)
  After E → Task F: Phase 5 (animations)
  After F → Task G: Phase 6 (PPT)
```
