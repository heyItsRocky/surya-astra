# ☀️ Surya-Astra

**Solar Flare Intelligence for the Next Generation**  
*A submission for Bharatiya Antriksh Hackathon 2026 — Problem Statement 15*

> **"Forecasting and/or Nowcasting of Solar Flares using combined Soft and Hard X-ray data from Aditya-L1"**

---

## 🚀 Overview

Surya-Astra is a stunning single-page web application that visualizes real-time solar flare intelligence using data from ISRO's Aditya-L1 mission. It combines a **3D interactive Sun** with scroll-driven narrative storytelling (inspired by [animejs.com](https://animejs.com)), a **live mission control dashboard**, and a hybrid flare forecasting pipeline.

Built for the **Bharatiya Antriksh Hackathon 2026**, this prototype demonstrates a complete nowcast/forecast system using mock SoLEXS + HEL1OS data, with a production-ready frontend architecture.

---

## ✨ Features

| Feature | Description |
|---|---|
| **3D Interactive Sun** | R3F-powered sphere with boiling surface, particle corona, and scroll-driven disintegration |
| **Scroll Narrative** | 6-section single-page experience with smooth scrolling (Lenis) and section navigation dots |
| **Anime.js Animations** | Cinematic entrance animations, stagger effects, and counter transitions |
| **Live Dashboard** | Mock nowcast flux chart, forecast probability rings, and events timeline |
| **Hybrid Model Pipeline** | Visual pipeline showing Threshold Nowcast + XGBoost Forecast flow |
| **10-Slide PPT** | Ready-to-submit idea presentation for ISRO BAH 2026 |

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) + TypeScript |
| **Styling** | Tailwind CSS v4 + dark theme |
| **3D Graphics** | React Three Fiber + drei + postprocessing |
| **Animation** | Anime.js v4 + Lenis (smooth scroll) + Framer Motion |
| **Charts** | Recharts |
| **UI Library** | shadcn/ui (Base UI primitives) |
| **State** | TanStack React Query v5 |
| **Data** | Mock data (no backend required) |

---

## 📂 Project Structure

```
surya-astra/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Lenis + providers
│   │   ├── page.tsx            # Main single-page (6 sections)
│   │   └── globals.css         # Tailwind v4 + dark theme
│   ├── components/
│   │   ├── three/              # 3D Sun components (R3F)
│   │   │   ├── sun-canvas.tsx
│   │   │   ├── sun-mesh.tsx
│   │   │   ├── sun-particles.tsx
│   │   │   ├── scroll-manager.tsx
│   │   │   └── effects.tsx
│   │   ├── sections/           # Page sections
│   │   │   ├── hero-section.tsx
│   │   │   ├── problem-section.tsx
│   │   │   ├── mission-section.tsx
│   │   │   ├── solution-section.tsx
│   │   │   ├── dashboard-section.tsx
│   │   │   └── team-section.tsx
│   │   ├── dashboard/          # Dashboard widgets
│   │   │   ├── nowcast-panel.tsx
│   │   │   ├── forecast-panel.tsx
│   │   │   ├── events-timeline.tsx
│   │   │   └── metrics-grid.tsx
│   │   ├── navigation/         # Nav components
│   │   ├── ui/                 # shadcn/ui components
│   │   └── providers.tsx
│   ├── hooks/
│   │   ├── use-scroll-section.ts
│   │   └── use-count-up.ts
│   └── lib/
│       ├── api.ts              # Mock API functions
│       ├── mock-data.ts        # Data generators
│       ├── types.ts            # TypeScript interfaces
│       └── utils.ts            # cn() helper
├── presentation/               # PPT materials
│   ├── screenshots/
│   ├── architecture.svg
│   └── wireframes.png
└── public/
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repo
git clone https://github.com/heyItsRocky/surya-astra.git
cd surya-astra

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🧭 User Experience

The app is a **scroll-driven narrative** with 6 sections:

1. **Hero** — 3D Sun with auto-rotation and particle corona
2. **The Problem** — Flare impact statistics with animated counters
3. **The Mission** — Aditya-L1 instrument overview with orbital diagram
4. **The Solution** — Hybrid model pipeline visualization
5. **Live Dashboard** — Mock nowcast/forecast/events panels
6. **Team** — Creator profiles and back-to-top

Navigation dots on the right side allow section jumping. The 3D Sun disintegrates into particles as you scroll through the problem section — a signature visual effect.

---

## 🎯 Problem Statement

[**Problem Statement 15**](https://bharatiya-antriksh-hackathon.in) — Forecasting and/or Nowcasting of Solar Flares using combined Soft and Hard X-ray data from Aditya-L1:

> Solar flares are sudden, intense bursts of radiation originating from the release of magnetic energy in the solar atmosphere. These events can trigger severe space weather disruptions, impacting Earth-bound satellite communications, GPS navigation, and power grids.

ISRO's **Aditya-L1** monitors the Sun from Lagrange Point L1 using:
- **SoLEXS** — Solar Low Energy X-ray Spectrometer (soft X-rays, 2–22 keV)
- **HEL1OS** — High Energy L1 Orbiting X-ray Spectrometer (hard X-rays, 10–150 keV)

---

## 📊 Approach

**Hybrid Model: Threshold Nowcasting + XGBoost Forecasting**

| Stage | Method | Input | Output |
|---|---|---|---|
| Nowcast | Threshold + HOPE detection | SoLEXS/HEL1OS flux | Flare alert (Y/N) |
| Forecast | XGBoost classifier | Temperature, EM, Hardness Ratio, QPP | Class probability (C/M/X) |

---

## 👥 Team

- **Rakshith** — Builder, ML Engineer, Frontend Developer
- **Ghost AI** — Co-pilot, Architecture & Code Generation

---

## 📝 License

MIT — Built for ISRO's Bharatiya Antriksh Hackathon 2026.

---

*"From the Sun to the Earth — watching, waiting, and warning."* ☀️🛡️
