# SURYA-ASTRA — Completion Guide

**Project**: Solar Flare Intelligence Dashboard — ISRO BAH 2026 (PS15)
**Status**: 60% built | Needs: error handling, tests, SEO, deployment
**Stack**: Next.js 16, React 19, Three.js/R3F, Tailwind v4, Recharts v2, Anime.js

---

## Tech Stack Assessment

### Keep As-Is (Optimal)
| Library | Version | Why |
|---------|---------|-----|
| **Next.js** | 16.x (App Router) | Latest, SSR/SSG for SEO, zero-config Vercel deploy |
| **React** | 19.x | Latest concurrent features, R3F compatible |
| **React Three Fiber** | r155+ | R3F v9 on React 19, first-class support |
| **Drei** | latest | R3F utility library, barrel exports work fine |
| **Three.js** | r155+ | Used directly for custom GLSL shaders — no Abii or Troika needed |
| **Tailwind CSS** | v4.x | Latest, @tailwindcss/postcss plugin |
| **Recharts** | 2.x | Dashboard charts, responsive, lightweight |
| **Anime.js** | 4.x (ESM) | IntroSequence animations, v4 is latest |
| **Lenis** | latest | Smooth scrolling |

### Add (Missing)
| Library | Why |
|---------|-----|
| **vitest** + `@testing-library/react` + `@testing-library/jest-dom` | Zero test files currently |
| **Error boundary component** | Wrap 3D + dashboard in fallbacks |
| **`next-sitemap`** or manual `sitemap.xml` | SEO sitemap generation |
| **`@next/bundle-analyzer`** | Production bundle analysis |
| **`next/metadata`** API (built-in) | Open Graph + Twitter cards |

### Remove
| Library | Why |
|---------|-----|
| **@react-three/postprocessing** | Not installed, no FX needed for this scope |

### Replace
| Current | Replacement | Why |
|---------|-------------|-----|
| (none) | — | Stack is clean |

---

## What Exists

| Layer | Status | Files |
|-------|--------|-------|
| **3D Sun** | ✅ Custom GLSL shaders (granulation, corona, flares) | `sun-mesh.tsx`, `sun-scene.tsx`, `sun-particles.tsx`, `effects.tsx` |
| **6 Page Sections** | ✅ Hero, Problem, Mission, Solution, Dashboard, Team | `sections/*.tsx` |
| **Dashboard** | ✅ 4 Recharts widgets with mock data | `dashboard/*.tsx` |
| **Navigation** | ✅ TopNav + SectionDots | `navigation/*.tsx` |
| **Animations** | ✅ IntroSequence (Anime.js), Lenis smooth scroll | `layout/*.tsx` |
| **Types + Mock API** | ✅ 14 interfaces, 5 API functions | `lib/*.ts` |

---

## What's Missing

### Priority 1 — Critical (blocks deployment)
- [ ] **Error Boundaries** — Wrap 3D + dashboard in `<ErrorBoundary>` fallbacks
- [ ] **API Error States** — Dashboard widgets show spinner forever on failure
- [ ] **SEO** — Open Graph, Twitter cards, sitemap.xml, robots.txt
- [ ] **Favicon + public/** — No icons, no PWA manifest
- [ ] **.env.example** — Document `NEXT_PUBLIC_USE_MOCK`

### Priority 2 — Quality
- [ ] **Tests** — Zero test files (vitest + @testing-library/react)
- [ ] **Mobile nav** — Section dots hidden on mobile, no hamburger
- [ ] **Lazy loading** — Dashboard widgets load eagerly
- [ ] **Responsive pass** — Test 1440/1024/768/375px
- [ ] **Accessibility** — ARIA labels, keyboard navigation

### Priority 3 — Production
- [ ] **CI/CD** — GitHub Actions (lint, typecheck, test, build)
- [ ] **Vercel config** — vercel.json
- [ ] **Bundle analyzer** — @next/bundle-analyzer

---

## Completion Procedure

### Step 1: Error Handling (30 min)
```
1. Create src/components/ui/error-boundary.tsx
2. Wrap SunSceneWrapper in ErrorBoundary (fallback: gradient blob)
3. Wrap DashboardSection in ErrorBoundary (fallback: "Dashboard unavailable")
4. Add isError/isLoading states to all 4 dashboard widgets
5. Add retry buttons on error states
```

### Step 2: SEO + Public Assets (1 hr)
```
1. Create public/ directory with favicon.ico, robots.txt, sitemap.xml
2. Add Open Graph image (1200x630) to public/
3. Update layout.tsx metadata: openGraph, twitter, icons
4. Add structured data (JSON-LD) for project description
```

### Step 3: Environment (5 min)
```
1. Create .env.example:
   NEXT_PUBLIC_USE_MOCK=true
   NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 4: Tests (3-4 hrs)
```
1. Install: vitest, @testing-library/react, @testing-library/jest-dom
2. Add vitest.config.ts
3. Write tests for:
   - lib/utils.ts (cn, formatNumber, clamp, lerp, mapRange)
   - lib/mock-data.ts (data shape validation)
   - hooks/useCountUp.ts
   - hooks/useScrollSection.ts
4. Add test script to package.json
```

### Step 5: Mobile + Responsive (2 hrs)
```
1. Add hamburger menu component for mobile
2. Show hamburger on mobile (<768px), hide SectionDots
3. Test all sections at 375px, 768px, 1024px, 1440px
4. Fix any overflow, spacing, or layout issues
```

### Step 6: Performance (1 hr)
```
1. Lazy-load dashboard widgets with next/dynamic
2. Memoize chart data with useMemo
3. Add loading skeletons for dashboard
4. Run build, check bundle sizes
```

### Step 7: Deploy (1 hr)
```
1. Create .github/workflows/ci.yml (lint, typecheck, build)
2. Create vercel.json (if needed)
3. Push to GitHub
4. Connect repo to Vercel (free tier)
5. Verify deployment, run Lighthouse
```

---

## Deployment (Zero Budget)

| Platform | Free Tier | Notes |
|----------|-----------|-------|
| **Vercel** | 100GB bandwidth, serverless | Best for Next.js (native) |
| **Cloudflare Pages** | Unlimited bandwidth | Static export only |

**Recommended**: Vercel — zero config for Next.js.

---

## Commands

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Test
npm run test

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

---

## Key Files to Modify

| File | Changes |
|------|---------|
| `src/app/layout.tsx` | Add Open Graph metadata, icons |
| `src/app/page.tsx` | Wrap sections in ErrorBoundary |
| `src/components/three/sun-scene-wrapper.tsx` | Add ErrorBoundary fallback |
| `src/components/dashboard/DashboardSection.tsx` | Add error states |
| `src/components/navigation/SectionDots.tsx` | Mobile hamburger |
| `src/app/globals.css` | Responsive adjustments |
| `package.json` | Add test scripts, devDeps |
| `next.config.ts` | Add bundle analyzer |

---

## Estimated Time: 8-10 hours

| Phase | Hours |
|-------|-------|
| Error handling | 0.5 |
| SEO + assets | 1 |
| Environment | 0.1 |
| Tests | 3.5 |
| Mobile + responsive | 2 |
| Performance | 1 |
| Deploy | 1 |
| **Total** | **~9** |
