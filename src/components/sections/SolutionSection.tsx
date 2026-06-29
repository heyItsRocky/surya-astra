'use client'

import { motion } from 'framer-motion'

export function SolutionSection() {
  const steps = [
    { num: '01', title: 'Data Ingestion', desc: 'Real-time telemetry from HEL1OS and SoLEXS via ISRO ISSDC.' },
    { num: '02', title: 'Preprocessing', desc: 'Noise reduction and flux normalization using sliding windows.' },
    { num: '03', title: 'Hybrid Model', desc: 'Threshold-based trigger + XGBoost for magnitude classification.' },
    { num: '04', title: 'Actionable Alert', desc: 'Latency < 2s notification to grid operators and satellite control.' }
  ]

  return (
    <section id="solution" className="relative min-h-screen w-full flex flex-col items-center justify-center section-padding z-10 bg-space-900 border-t border-white/5">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 max-w-3xl"
      >
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
          THE <span className="text-plasma-light drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]">PIPELINE</span>
        </h2>
        <p className="text-gray-400 text-lg">
          Our intelligent pipeline processes raw X-ray flux data through a hybrid machine learning model to predict solar flare magnitude with 92% accuracy.
        </p>
      </motion.div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {/* Connecting line for desktop */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-space-700 via-plasma to-space-700 -translate-y-1/2 z-0" />
        
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="relative z-10 bg-glass p-6 rounded-xl border border-white/10 hover:border-plasma transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-space-800 border-2 border-plasma flex items-center justify-center font-display font-bold text-plasma-light mb-6 mx-auto md:mx-0 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              {step.num}
            </div>
            <h3 className="text-white font-display text-lg mb-2 text-center md:text-left">{step.title}</h3>
            <p className="text-gray-400 text-sm text-center md:text-left">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
