# Changelog — Surya-Astra

> Build progress for the Surya-Astra solar flare intelligence dashboard.
> All notable changes will be documented here.

---

## [Unreleased]

### Session 2026-09-23 — Submission-ready hardening
- Migrated to ESLint 9 flat config (`eslint.config.mjs`); removed `.eslintrc.json`
- Fixed lint/purity issues: seeded PRNG in `sun-particles.tsx`, throttled scroll state in `sun-scene.tsx`, apostrophes in sections
- Rewrote `MetricsGrid` with React Query, skeleton, error + retry (4th widget complete)
- Added `public/favicon.ico`
- Added Vitest + Testing Library: 29 frontend tests (utils, mock shapes, useCountUp)
- Added `backend/tests/test_nowcaster.py`: 22 pytest cases (classify, CME risk, forecast, trend, confidence)
- Added `.github/workflows/ci.yml` (lint, tsc, test, build, pytest)
- Scripts: `lint`, `typecheck`, `test`, `test:watch`, `test:backend`, `analyze`
- Rewrote `README.md` (mock + real API quickstart); added `docs/DEPLOY.md`
- Added `presentation/` (deck outline, architecture.svg, screenshot slot)
- Updated `COMPLETION_GUIDE.md` checkboxes; superseded `HANDOVER_PROMPT.md`
- Backend verified: all 6 endpoints HTTP 200 with `{success,data}` envelope
- Optional polish: `next/font` (Inter/Orbitron, clears font lint warning), `@next/bundle-analyzer`, skip link + focus/aria on nav & widgets, mobile type scale
- BLOCKED: Vercel/Railway account login for live deploy

### Phase 0 — Foundation
- [ ] Initialize Next.js 16 project with TypeScript + Tailwind v4
- [ ] Install all dependencies (R3F, drei, postprocessing, animejs, lenis, recharts, tanstack-query, shadcn/ui)
- [ ] Configure Tailwind v4 dark theme with custom colors
- [ ] Set up shadcn/ui components (button, card, badge, tabs, input, select, table)
- [ ] Add .env.local with NEXT_PUBLIC_USE_MOCK=true
- [ ] Run first production build to verify compilation

### Phase 1 — Scroll Shell & Navigation
- [ ] Build root layout with Lenis smooth scroll
- [ ] Create section dots navigation component
- [ ] Build useScrollSection hook
- [ ] Create single-page layout with 6 sections
- [ ] Build scroll indicator (down arrow on hero)

### Phase 1B — Mock API Layer
- [ ] Define TypeScript types (FlareEvent, NowcastData, ForecastData, MetricsData)
- [ ] Implement mock data generators
- [ ] Build API client with mock fallback
- [ ] Set up TanStack Query providers

### Phase 2 — 3D Sun Hero
- [ ] Build R3F Canvas with dynamic SSR-safe import
- [ ] Create Sun mesh with boiling surface material
- [ ] Build corona particle system (2000-5000 points)
- [ ] Implement scroll-driven disintegration effect
- [ ] Add post-processing (bloom + chromatic aberration)
- [ ] Verify 3D performance and fallback handling

### Phase 3 — Content Sections
- [ ] Build Problem section (threat stats + cards)
- [ ] Build Mission section (Aditya-L1 instrument specs)
- [ ] Build Solution section (pipeline flow + metrics)
- [ ] Build Team section (profiles + acknowledgments)

### Phase 4 — Dashboard Widgets
- [ ] Build Nowcast panel (flux chart + alert badge)
- [ ] Build Forecast panel (probability rings)
- [ ] Build Events timeline
- [ ] Build Metrics grid (TSS, HSS, Precision, Recall)
- [ ] Wire dashboard tabs with mock data polling

### Phase 5 — Animations & Polish
- [ ] Add Anime.js entrance animations to all sections
- [ ] Implement stat counter animations
- [ ] Build scroll-to-top button
- [ ] Performance optimization pass
- [ ] Responsive design pass (1440, 1024, 768, 375)

### Phase 6 — PPT & Submission
- [ ] Generate architecture diagram SVG
- [ ] Generate wireframe mockups
- [ ] Take full-page screenshots
- [ ] Fill 10-slide PPT template
- [ ] Final production build verification
- [ ] Submission

---

## [0.1.0] — 2026-06-28

### Added
- Project initialized with Next.js 16 (Turbopack)
- Documentation repository created
- Master plan (plan.md) with 6 execution phases
- User experience walkthrough (user-experience.md)
- Execution strategy with agent dispatch sequence (execution-strategy.md)
- README with project overview and setup guide
- RESOURCES.md with curated links (inspiration, libraries, physics)
- PRESENTATION_SCRIPT.md with slide-by-slide talking points
- ARCHITECTURE.md with component tree and data flow
- FAQ.md with anticipated judge questions
- CHANGELOG.md (this file)
- GitHub repository initialized: heyItsRocky/surya-astra
