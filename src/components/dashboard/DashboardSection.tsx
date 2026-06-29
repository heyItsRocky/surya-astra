'use client'

import { motion } from 'framer-motion'
import { NowcastWidget } from './NowcastWidget'
import { ForecastWidget } from './ForecastWidget'
import { EventsWidget } from './EventsWidget'
import { MetricsGrid } from './MetricsGrid'

export function DashboardSection() {
  return (
    <section id="dashboard" className="relative min-h-screen w-full flex flex-col items-center justify-center section-padding z-10 bg-space-900 border-t border-white/5">
      <div className="w-full max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4"
        >
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              COMMAND <span className="text-alert-red">CENTER</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Real-time telemetry and predictive models
            </p>
          </div>
          <div className="flex gap-4 text-xs font-display text-gray-500 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-alert-green animate-pulse" />
              API CONNECTED
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-plasma animate-pulse" />
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
