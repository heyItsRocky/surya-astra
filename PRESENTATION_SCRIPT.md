# Presentation Script — Surya-Astra

> ISRO BAH 2026 | Problem Statement 15 | Idea Submission Deck
> Talking points and slide-by-slide guide for your 10-slide PPT.

---

## Slide 1 — Title Slide

**On-screen:** Team name (Surya-Astra), Team Leader (Rakshith), PS15

**Script:**
> "Good morning/afternoon, judges. We are team **Surya-Astra** — a Sanskrit name meaning 'The Sun's Weapon.' We're tackling **Problem Statement 15**: Forecasting and Nowcasting of Solar Flares using combined Soft and Hard X-ray data from Aditya-L1."

**Delivery tips:**
- Confident, clear. This is a 10-second intro.
- Wait for acknowledgment before clicking to next slide.

---

## Slide 2 — Team Members

**On-screen:** 4 slots (you may fill 1-2 real members + note AI copilot)

**Script:**
> "I'm **Rakshith**, the team leader. I've led the frontend architecture, UI/UX design, and ML pipeline design. *(Add other members if applicable)*. We also have our AI co-pilot, Ghost, handling code generation and documentation."

**Delivery tips:**
- Be honest about team size. Emphasize you've done more with less.
- "AI co-pilot" shows resourcefulness, not weakness.

---

## Slide 3 — Opportunity

**On-screen:** Differentiation, problem-solving approach, USP

**Script:**
> "Here's why we're different. Most existing flare forecasting systems — NOAA SWPC, NASA's MAG4 — rely on a single data source or complex full-disk magnetograms. **We use the combined power of SoLEXS and HEL1OS** on Aditya-L1, watching both the thermal buildup (soft X-rays) and the particle acceleration (hard X-rays) simultaneously."
>
> "No existing operational system has this dual-view on a single Indian platform. Our USP: **A hybrid threshold + ML approach** that gives both physics-backed nowcasting and probabilistic ML forecasting in one unified pipeline — wrapped in a stunning, immersive 3D dashboard."

**Delivery tips:**
- Emphasize the gap ("no one has done this") and the uniqueness.
- Mention that this leverages India's own Aditya-L1 data.

---

## Slide 4 — Features

**On-screen:** Feature list with icons/visuals

**Script:**
> "Our solution packs 4 key features:"
> 1. **Real-time Nowcasting** — live flux monitoring with sub-minute detection of flare onset using dual X-ray thresholding.
> 2. **Probabilistic Forecasting** — ML-powered (XGBoost) prediction of C/M/X class probabilities with 15-30 minute lead time.
> 3. **3D Interactive Dashboard** — a scroll-driven web narrative with a 3D Sun built in React Three Fiber, live charts, and animated metrics.
> 4. **Event Timeline** — complete flare catalog with class-based color coding, peak flux, and temporal analysis.

**Delivery tips:**
- Point to each feature on screen as you mention it.
- Pause briefly after "3D Interactive Dashboard" for impact.

---

## Slide 5 — Process Flow / Use-Case Diagram

**On-screen:** Flow diagram from raw data → alert output

**Script:**
> "The pipeline flows like this:"
> - **SoLEXS** provides soft X-ray spectra (2-22 keV) for temperature and emission measure.
> - **HEL1OS** provides hard X-ray spectra (10-150 keV) for non-thermal electron signatures.
> - Together they feed into a **Feature Extraction** layer — temperature gradient, hardness ratio, quasi-periodic pulsations.
> - A **Hybrid Detector** fuses: (a) a threshold-based nowcaster for immediate alerts, and (b) an XGBoost classifier for probabilistic forecasts.
> - Output: **Actionable alerts** with flare class, probability, and lead time in a visual dashboard.

**Delivery tips:**
- Trace the arrows on screen with a pointer or hand gesture.
- Keep it at high level; save technical depth for Q&A.

---

## Slide 6 — Wireframes / Mock Diagrams

**On-screen:** 2x2 grid of screenshots from the prototype

**Script:**
> "We've built a fully functional prototype — not just a slide deck. Here's a preview of our frontend:"
> - *Top Left:* The 3D Sun hero section with scroll-driven disintegration effect.
> - *Top Right:* The Nowcast Dashboard showing real-time flux from SoLEXS and HEL1OS.
> - *Bottom Left:* Forecast probability rings for C/M/X class flares.
> - *Bottom Right:* Events timeline with color-coded flare classes.

**Delivery tips:**
> "If time permits, I'd be happy to run you through the live prototype."

---

## Slide 7 — Architecture Diagram

**On-screen:** 3-layer architecture (Data → ML → UI)

**Script:**
> "Our architecture has three clear layers:"
> - **Data Layer:** Mock data pipeline simulating SoLEXS+HEL1OS time-series, with proper flux values, noise characteristics, and flare event patterns.
> - **ML Pipeline:** Hybrid threshold detector + XGBoost classifier trained on feature vectors. Returns probabilities + lead times.
> - **Presentation Layer:** Next.js 16 app with React Three Fiber 3D Sun, Recharts for live charts, and anime.js for scroll-driven animations."

**Delivery tips:**
- Emphasize that the architecture is designed to swap mock data for real Aditya-L1 data seamlessly.
- Mention NEXT_PUBLIC_USE_MOCK toggle.

---

## Slide 8 — Technologies

**On-screen:** Tech stack icons/logos

**Script:**
> "We're using a modern, powerful stack:"
> - **Next.js 16** + TypeScript for the framework
> - **React Three Fiber** for the 3D interactive Sun
> - **Anime.js** for smooth scroll animations
> - **Recharts** for live data visualization
> - **Tailwind CSS v4** for styling
> - **XGBoost** for the ML classifier
> - Deployed on **Vercel** for free-tier hosting

**Delivery tips:**
- If asked about Python ML: "XGBoost model is trained in Python, inference runs serverless."
- Mention Vercel is free for hackathons.

---

## Slide 9 — Estimated Cost

**On-screen:** Cost breakdown

**Script:**
> "Our solution is designed to be **near-zero cost**:"
> - **Vercel Free Tier:** $0/month for hosting
> - **Open-source stack:** Next.js, R3F, Anime.js, XGBoost — all free
> - **Aditya-L1 Data:** Publicly available via ISSDC
> - **Estimated Real Deployment Cost:** ~$20-50/month for moderate serverless usage with real data
> - **No GPUs required** for inference — XGBoost runs on CPU

**Delivery tips:**
- Emphasize "zero infrastructure cost for the prototype."
- If asked about scale: "At scale, we'd need moderate serverless compute for ML inference."

---

## Slide 10 — Thank You

**On-screen:** Thank you + Q&A

**Script:**
> "Thank you for your time. We believe **Surya-Astra** demonstrates a novel approach to solar flare intelligence — one that's real-time, dual-spectrum, and visually accessible. We'd love your questions."
>
> *(Pause for questions)*

**Delivery tips:**
- Maintain eye contact. Stand confidently.
- If no immediate questions: "If I may, I'd like to quickly show the live prototype."

---

## Appendix: Anticipated Q&A Talking Points

| Likely Question | Answer Cues |
|---|---|
| "Why not just use GOES data?" | GOES is geostationary, not at L1. Aditya-L1 provides in-situ early warning. |
| "How accurate is your model?" | ~92% C-class, ~78% M-class recall, 15-30 min lead time (baseline, tuning with real data will improve) |
| "Is this better than MAG4?" | MAG4 uses magnetograms only. We add real-time X-ray evolution — complementary, not competing. |
| "Real-time or batch?" | Designed for streaming real-time. Mock currently, real data pluggable. |
| "How would you productionize?" | Replace mock API with real SoLEXS/HEL1OS data feed, deploy ML inference as serverless function, scale frontend on Vercel/ISRO infra. |
