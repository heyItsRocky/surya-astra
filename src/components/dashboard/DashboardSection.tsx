'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const NowcastWidget = dynamic(() => import('./NowcastWidget').then(mod => mod.NowcastWidget), {
  loading: () => (
    <div className="bg-glass p-6 rounded-xl border border-white/5 h-full flex flex-col justify-center items-center min-h-[300px]" role="status" aria-busy="true">
      <div className="w-8 h-8 rounded-full border-2 border-solar-orange border-t-transparent animate-spin" aria-hidden="true" />
      <p className="text-gray-500 text-xs mt-3 font-display">Loading widget...</p>
    </div>
  ),
  ssr: false,
})

const ForecastWidget = dynamic(() => import('./ForecastWidget').then(mod => mod.ForecastWidget), {
  loading: () => (
    <div className="bg-glass p-6 rounded-xl border border-white/5 h-full flex flex-col justify-center items-center min-h-[300px]" role="status" aria-busy="true">
      <div className="w-8 h-8 rounded-full border-2 border-plasma border-t-transparent animate-spin" aria-hidden="true" />
      <p className="text-gray-500 text-xs mt-3 font-display">Loading widget...</p>
    </div>
  ),
  ssr: false,
})

const EventsWidget = dynamic(() => import('./EventsWidget').then(mod => mod.EventsWidget), {
  loading: () => (
    <div className="bg-glass p-6 rounded-xl border border-white/5 h-full flex flex-col justify-center items-center min-h-[300px]" role="status" aria-busy="true">
      <div className="w-8 h-8 rounded-full border-2 border-alert-red border-t-transparent animate-spin" aria-hidden="true" />
      <p className="text-gray-500 text-xs mt-3 font-display">Loading widget...</p>
    </div>
  ),
  ssr: false,
})

const MetricsGrid = dynamic(() => import('./MetricsGrid').then(mod => mod.MetricsGrid), {
  loading: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 w-full" role="status" aria-busy="true">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-glass p-4 rounded-xl border border-white/5 h-32 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-gray-500 border-t-transparent animate-spin" aria-hidden="true" />
        </div>
      ))}
    </div>
  ),
  ssr: false,
})

export function DashboardSection() {
  return (
    <section
      id="dashboard"
      aria-labelledby="dashboard-heading"
      className="relative min-h-screen w-full flex flex-col items-center justify-center section-padding z-10 bg-space-900 border-t border-white/5"
    >
      <div className="w-full max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          <div>
            <h2 id="dashboard-heading" className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              COMMAND <span className="text-alert-red">CENTER</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Real-time telemetry and predictive models
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-display text-gray-500 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-alert-green animate-pulse" aria-hidden="true" />
              API CONNECTED
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-plasma animate-pulse" aria-hidden="true" />
              ML ENGINE ACTIVE
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 h-[400px]"
          >
            <NowcastWidget />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[400px]"
          >
            <ForecastWidget />
          </motion.div>
        </div>
        
        <MetricsGrid />

        <div className="grid grid-cols-1 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="h-[300px]"
          >
            <EventsWidget />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
