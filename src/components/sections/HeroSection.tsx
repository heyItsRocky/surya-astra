'use client'

import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen w-full flex items-center justify-center section-padding z-10"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-900/50 to-space-900 pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass border-glow text-sm text-solar-orange mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-solar-orange animate-pulse-glow" />
          Live Telemetry Active
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight drop-shadow-lg"
        >
          SURYA<span className="text-gradient-solar">-ASTRA</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 drop-shadow"
        >
          Predictive Solar Flare Intelligence Dashboard powered by Aditya-L1 data streams. 
          Defending Earth&apos;s infrastructure from space weather anomalies.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="animate-float"
        >
          <button 
            onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-solar-orange to-solar-gold text-space-900 font-display font-bold hover:shadow-[0_0_30px_rgba(255,107,53,0.5)] transition-shadow"
          >
            INITIALIZE DASHBOARD
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-xs font-display tracking-widest text-gray-500">SYSTEM STATUS</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-solar-orange to-transparent" />
      </motion.div>
    </section>
  )
}
