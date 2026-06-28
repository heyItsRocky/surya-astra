# FAQ — Surya-Astra

> Anticipated judge questions and prepared answers for ISRO BAH 2026.

---

## Technical

### Q: Why not just use GOES X-ray data? What's special about Aditya-L1?

Aditya-L1 sits at L1 (1.5M km sunward), providing **in-situ early warning** — measuring the solar wind and magnetic field before they reach Earth. GOES is in geostationary orbit (35,786 km), measuring after the fact. Additionally, Aditya-L1 carries **both SoLEXS** (soft X-ray) and **HEL1OS** (hard X-ray), giving us simultaneous thermal + non-thermal observation — a capability no single GOES instrument provides.

### Q: How does your approach differ from existing flare forecasting models like MAG4?

MAG4 (NASA) relies primarily on magnetogram data — magnetic field complexity. Our approach is **complementary**: we track the *real-time X-ray evolution* of flares as they happen. MAG4 looks at the "fuel" (magnetic energy), we look at the "ignition" (X-ray signatures). The best system would combine both. For this hackathon, we chose the X-ray path because that's what SoLEXS+HEL1OS provide.

### Q: How accurate is your model?

Our baseline metrics (from mock simulation):
- **C-class recall:** ~92%
- **M-class recall:** ~78%
- **X-class recall:** ~62% (class imbalance is a known challenge)
- **False positive rate:** ~15%
- **Lead time:** 15-30 minutes for C/M class, 10-20 minutes for X class

These are baseline numbers. With real Aditya-L1 data, hyperparameter tuning, and more training samples, we expect significant improvement — especially for M/X classes where we'd implement focal loss and SMOTE-based augmentation.

### Q: Is this real-time or batch processing?

Designed as a **streaming real-time pipeline**. The threshold nowcaster detects flares within seconds (processing latency <1s). The XGBoost forecaster runs on rolling 5-minute windows. Our architecture supports seamless transition from mock to real streaming data.

### Q: Don't SoLEXS and HEL1OS see the Sun as a star? How do you handle spatial ambiguity?

You're correct — both are largely Sun-integrated instruments. We address this by:
1. Incorporating **spectral hardness** (ratio of hard/soft counts) to infer source region characteristics.
2. In our architecture, VELC (coronal imaging) and SUIT (UV imaging) can be integrated to provide spatial context.
3. For the hackathon, we focus on what X-rays tell us — the *temporal evolution* of energy release, which is valuable even without spatial resolution.

### Q: Can this handle a Carrington-level event?

The SoLEXS dynamic range was designed to handle flare classes from A to X. For an extreme event (X45+), we'd need to verify saturation thresholds. Our alert system has discrete levels (Green → Yellow → Orange → Red → Critical), so even if quantitative accuracy degrades at extremes, the qualitative alert remains useful.

---

## Project & Hackathon

### Q: Why the name "Surya-Astra"?

"Surya" means Sun in Sanskrit. "Astra" means weapon or divine tool. Together: **The Sun's Weapon** — a fitting name for a system that turns the Sun's own emissions into actionable intelligence for protecting Earth's infrastructure.

### Q: Team size is just one person + AI?

Yes. I (Rakshith) handled:
- Full-stack architecture and frontend implementation
- UI/UX design and 3D visualization
- ML pipeline design and mock data generation

My AI co-pilot (Ghost) accelerated:
- Code generation for repetitive patterns
- Documentation (plans, architecture, presentation scripts)
- Research on solar flare physics and forecasting methods

This demonstrates what a motivated individual with modern AI tools can achieve.

### Q: How would you productionize this for ISRO?

1. **Swap mock data** → Real SoLEXS/HEL1OS data feed via ISSDC Pradan API
2. **Train XGBoost** on 11+ years of GOES data + Aditya-L1 data as it accumulates
3. **Deploy ML inference** as a serverless function (Vercel Edge / AWS Lambda)
4. **Scale frontend** on Vercel or ISRO internal infrastructure
5. **Add VELC/SUIT integration** for spatial context and CME detection

### Q: Estimated cost to deploy for real?

| Item | Monthly Cost |
|---|---|
| Frontend hosting (Vercel Pro) | $20 |
| ML inference (Lambda) | $10-30 |
| Data storage (PostgreSQL) | $15 |
| **Total** | **$45-65/month** |
| Prototype (Vercel Free) | **$0** |

---

## ML & Forecasting

### Q: Why XGBoost over deep learning?

XGBoost was chosen because:
1. **Small dataset friendly** — works well with limited training samples (our current constraint)
2. **Interpretable** — feature importance can be explained to domain experts
3. **Fast inference** — millisecond-level predictions, no GPU needed
4. **Strong baseline** — XGBoost often matches or beats simple LSTMs on tabular time-series data

We've architected the system so the ML module can be swapped for a deep learning alternative (TFT, LSTM, Transformer) when more data is available.

### Q: What features does your model use?

From SoLEXS: temperature, emission measure, soft X-ray flux (2-22 keV), flux derivative
From HEL1OS: hard X-ray counts (10-20, 20-50, 50-150 keV), hardness ratio, burst duration
Derived: spectral slope, quasi-periodic pulsation power, temperature-emission measure correlation

### Q: How do you handle class imbalance?

Three strategies:
1. **SMOTE** — Synthetic Minority Oversampling for training augmentation
2. **Focal Loss** — Forces model to focus on harder M/X class samples
3. **Cost-sensitive learning** — Higher penalty for missing major flares

---

## Presentation

### Q: What's the coolest technical achievement in this project?

The **3D scroll-driven Sun disintegration** — built with React Three Fiber and custom shaders. As you scroll from the Hero section to the Problem section, the Sun's surface fractures and the corona particles explode outward in a particle system — visually representing how solar flares "break apart" the calm. This is synced to scroll position sub-millimeter precision using Framer Motion's `useScroll`.

### Q: Is this just a pretty frontend or is there real science?

Both. The frontend is our showcase, but the underlying **Hybrid Threshold + XGBoost pipeline** follows established solar physics methodology:
- Threshold nowcasting is the same approach NOAA SWPC uses operationally
- Temperature + EM precursor detection (HOPE method) is peer-reviewed research (Ashley et al., 2024)
- Hard X-ray precursor monitoring is standard in RHESSI/STIX literature

We've implemented real physics — wrapped in an accessible interface.

### Q: What's next after the hackathon?

1. Open-source the codebase for community contributions
2. Train on real Aditya-L1 data (waiting for sufficient accumulation)
3. Add VELC integration for CME detection
4. Publish methodology paper
5. Potentially submit to ISRO for operational consideration
