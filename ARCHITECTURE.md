# Architecture — Surya-Astra

> Component tree and data flow for the Surya-Astra solar flare intelligence dashboard.

---

## 1. High-Level Architecture (3 Layers)

```
┌────────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                             │
│  Next.js 16 App (src/)                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │ Hero     │ │ Content  │ │ Dashboard│ │ UI Comp  │ │ 3D Sun   ││
│  │ Section  │ │ Sections │ │ Panels   │ │ Library  │ │ (R3F)    ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘│
├────────────────────────────────────────────────────────────────────┤
│                       LOGIC LAYER                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────────┐  │
│  │API Client│ │ TanStack │ │ Mock Data│ │ Custom Hooks         │  │
│  │ (lib/api)│ │ Query    │ │ Generator│ │ (useScrollSection,   │  │
│  │          │ │ Provider │ │          │ │  useCountUp)         │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────────┘  │
├────────────────────────────────────────────────────────────────────┤
│                       DATA LAYER                                   │
│  ┌──────────────────────┐ ┌──────────────────────────────────────┐ │
│  │ Mock SoLEXS+HEL1OS   │ │ Real Aditya-L1 Source (future)       │ │
│  │ Time-Series Generator│ │ ISSDC Pradan API / Data Files        │ │
│  └──────────────────────┘ └──────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Tree

```
<RootLayout>                         ← src/app/layout.tsx
  <ReactLenis>                        ← Smooth scroll
    <Providers>                       ← TanStack Query
      <SidebarNavigation>            ← Section dots (fixed right)
        <SectionDot /> × 6
      <main>
        <HeroSection>                 ← src/components/sections/hero-section.tsx
          <DynamicSunCanvas>          ← src/components/three/dynamic-sun.tsx (SSR disabled)
            <SunScene>
              <SunMesh />             ← Boiling surface sphere
              <SunParticles />        ← Corona particle system
              <ScrollManager />       ← Scroll → 3D sync
              <PostProcessing />      ← Bloom + ChromaticAberration
          <HeroTextOverlay />         ← Title, subtitle, scroll indicator
        </HeroSection>

        <ProblemSection>              ← The threat (stats + 3 cards)
          <StatCounter /> × 3         ← Animated number counters
          <ThreatCard /> × 3          ← Satcomms, GPS, Grid
        </ProblemSection>

        <MissionSection>              ← Aditya-L1
          <OrbitDiagram />            ← Inline SVG orbit
          <InstrumentCard /> × 2      ← SoLEXS + HEL1OS specs
          <Timeline />                ← Mission timeline
        </MissionSection>

        <SolutionSection>             ← Pipeline
          <PipelineFlow /> × 4        ← Animated pipeline steps
          <MetricCard /> × 4          ← Accuracy metrics
        </SolutionSection>

        <DashboardSection>            ← Live mock data
          <Tabs>
            <NowcastPanel>            ← Flux chart + status
              <FluxChart />           ← Recharts LineChart
              <AlertBadge />          ← Green/Yellow/Red
            </NowcastPanel>
            <ForecastPanel>           ← Probability rings
              <ProbabilityRing /> × 3 ← SVG arcs
            </ForecastPanel>
            <EventsTimeline>          ← Event history
              <EventItem /> × N       ← Timestamp + badge
            </EventsTimeline>
          </Tabs>
        </DashboardSection>

        <TeamSection>                 ← Credentials
          <ProfileCard /> × 2         ← Rakshith + Ghost
          <ScrollToTop />             ← Floating button
        </TeamSection>
      </main>
    </ReactLenis>
  </Providers>
</RootLayout>
```

---

## 3. Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA FLOW DIAGRAM                            │
└─────────────────────────────────────────────────────────────────────┘

                  Mock Data Generator (lib/mock-data.ts)
                              │
                              ▼
                    API Client (lib/api.ts)
                    ┌─────────────────────┐
                    │ fetchNowcast()       │
                    │ fetchForecast()      │
                    │ fetchEvents()        │
                    │ fetchLightcurve()    │
                    │ fetchMetrics()       │
                    └─────────┬───────────┘
                              │
                      TanStack Query
                    (useQuery hooks)
                              │
                    ┌─────────┴──────────┐
                    │                    │
                    ▼                    ▼
            Dashboard Panels      Content Sections
            (recharts, alerts)    (stats, counters)
```

---

## 4. Route Map

| Route | Type | Description |
|---|---|---|
| `/` | Single page | 6 scroll-snapped sections |
| (no sub-routes) | — | All content on one page |

All routes are `'use client'` (App Router) with scroll-based navigation.

---

## 5. Key Design Decisions

| Decision | Rationale |
|---|---|
| **Single page, not multi-page** | Matches animejs.com scroll narrative pattern. Better for immersive experience. |
| **Mock data, not real API** | No backend running. Build first, plug real data later. Toggle via `NEXT_PUBLIC_USE_MOCK`. |
| **R3F dynamic import** | Next.js SSR cannot handle WebGL. `dynamic(() => ..., { ssr: false })` prevents hydration errors. |
| **Lenis + IntersectionObserver** | Lenis for smooth scroll feel. IntersectionObserver (inside `useScrollSection`) for section tracking. |
| **Recharts over Plotly** | Smaller bundle (~30KB vs ~500KB), better React integration, SSR-compatible (wrapped in dynamic). |
| **Anime.js for entrance animations** | Lighter than GSAP for scroll-triggered stagger/fade. Provides the "animejs.com" look we're replicating. |

---

## 6. File Map

```
/mnt/e/Surya-Astra/surya-astra/
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← Root layout (Lenis, Providers, fonts)
│   │   ├── page.tsx                ← Main single page (6 sections)
│   │   └── globals.css             ← Tailwind v4 theme + dark mode
│   ├── components/
│   │   ├── sections/
│   │   │   ├── hero-section.tsx
│   │   │   ├── problem-section.tsx
│   │   │   ├── mission-section.tsx
│   │   │   ├── solution-section.tsx
│   │   │   ├── dashboard-section.tsx
│   │   │   └── team-section.tsx
│   │   ├── three/
│   │   │   ├── dynamic-sun.tsx      ← SSR-safe dynamic import wrapper
│   │   │   ├── sun-canvas.tsx       ← R3F Canvas + postprocessing
│   │   │   ├── sun-scene.tsx        ← Lights + composition
│   │   │   ├── sun-mesh.tsx         ← Sun sphere + boiling shader
│   │   │   ├── sun-particles.tsx    ← Corona particle system
│   │   │   └── scroll-manager.tsx   ← Scroll position → 3D state
│   │   ├── dashboard/
│   │   │   ├── nowcast-panel.tsx
│   │   │   ├── forecast-panel.tsx
│   │   │   ├── events-timeline.tsx
│   │   │   ├── flux-chart.tsx
│   │   │   ├── metrics-grid.tsx
│   │   │   └── alert-badge.tsx
│   │   ├── navigation/
│   │   │   ├── section-dots.tsx
│   │   │   └── scroll-indicator.tsx
│   │   ├── layout/
│   │   │   ├── providers.tsx
│   │   │   └── scroll-to-top.tsx
│   │   └── ui/                     ← shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       ├── tabs.tsx
│   │       └── skeleton.tsx
│   ├── hooks/
│   │   ├── use-scroll-section.ts
│   │   └── use-count-up.ts
│   └── lib/
│       ├── api.ts
│       ├── mock-data.ts
│       ├── types.ts
│       └── utils.ts
├── presentation/                    ← PPT materials
│   ├── screenshots/
│   └── architecture-diagram.png
└── documentation/                   ← Docs
    ├── plan.md
    ├── user-experience.md
    ├── execution-strategy.md
    ├── architecture.md
    ├── presentation-script.md
    ├── faq.md
    ├── changelog.md
    └── resources.md
```
