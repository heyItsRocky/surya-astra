# 🧑‍🚀 Surya-Astra — User Experience Walkthrough

## The "WTF" Factor
This frontend is designed to make judges stop and ask: *"Wait, how did they build this?"* Every scroll, every animation, every transition is intentionally crafted for maximum visual impact.

---

## 0. Loading Screen (~3s)
Pure black screen. Orange glow pulses from center. Text fades in letter-by-letter like a movie title sequence:
```
SURYA-ASTRA
```
Below it: subtitle + pulsing scroll-down arrow.

---

## 1. Hero Section — "The Sun"
**What user sees:**
- Fully 3D, rotatable Sun in screen center — not flat, a sphere with boiling glowing surface (simplex noise shader)
- Orange/gold plasma swirls, tiny particle dots orbit like solar corona
- Auto-rotates slowly, mesmerizing
- Right side: 6 vertical navigation dots, top dot highlighted orange
- Clicking a dot smooth-scrolls to that section
- Scrolling down triggers the magic...

## 2. Problem Section — "The Threat"
**Transition:**
- As user enters this section, the 3D Sun begins to FRACTURE — mesh splits, particles explode outward, glow fades
- Smooth scroll (Lenis) makes it feel cinematic

**Content:**
- Heading: *"The Quiet Before the Storm"*
- 3 animated stat counters (0 → target):
  - **$2B** — Est. daily cost of Carrington-level event
  - **93%** — GPS accuracy degradation during X-flare
  - **1989** — Quebec grid collapse in 90 seconds
- 3 cards: Satellites 📡 | GPS 🛰️ | Power Grid ⚡ with descriptions

## 3. Mission Section — "India's Watchtower"
**Transition:** Background particles re-form into orbital diagram

**Content:**
- Orbital diagram: Earth → L1 point → Aditya-L1 halo orbit (wavy ellipse)
- Instrument cards with spec badges:
  - **SoLEXS** (2-22 keV, soft X-rays, thermal plasma)
  - **HEL1OS** (10-150 keV, hard X-rays, particle acceleration)
- Animated timeline: Sep 2023 → Jan 2024 → Today

## 4. Solution Section — "Where Physics Meets Intelligence"
**Transition:** Pipeline diagram builds itself step-by-step

**Content:**
- Animated pipeline: SoLEXS + HEL1OS → Feature Extraction → Hybrid Model → Alert
- Each of 4 steps highlights sequentially:
  1. Data Ingestion (SoLEXS + HEL1OS streams)
  2. Feature Extraction (Temperature, EM, Hardness Ratio, QPP)
  3. Hybrid Detector (Threshold + XGBoost)
  4. Alert Output (Probability, Class C/M/X, Lead Time)
- Metric cards: **92% accuracy**, **78% recall**, **15-30 min lead time**

## 5. Dashboard Section — "Live Intelligence"
**Content:**
- Mission control panel, dark glass-morphism cards
- Tabs: Nowcast | Forecast | Events

**Tab: NOWCAST**
- Dual-line chart (SoLEXS orange, HEL1OS red) — updates every 10s
- Status badge: 🟢 Active / 🟡 Warning / 🔴 Flare Detected
- Temperature + Emission Measure gauges

**Tab: FORECAST**
- 3 glowing SVG rings: C 92% | M 64% | X 18%
- Countdown: "Next potential event: ~24 min"

**Tab: EVENTS**
- Vertical timeline, last 24h
- Each event: timestamp, class badge (color A→X), peak flux
- New events slide in from bottom

## 6. Team Section — "The Crew"
- Rakshith profile card + Ghost AI card
- Badge: Built for Bharatiya Antriksh Hackathon 2026
- Glowing button: ⬆ Back to Top → smooth scroll to Hero

---

## Magic Throughout
| Effect | When |
|---|---|
| Section dots highlight | Active section tracks |
| Text fades + slides up | Every heading/card on entry |
| Counters animate 0→target | Stats and metrics |
| Sun state changes | Intact → fracturing → dispersed |
| Bloom glow | Sun and accent elements |
| Smooth scroll | Lenis — 1.5s duration, 0.08 lerp |

## Mobile Experience
- 3D Sun → static glowing image (no WebGL)
- Cards stack vertically
- Section dots → hamburger menu
- Everything still smooth scrolls
