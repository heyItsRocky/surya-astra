'use client'

import { motion } from 'framer-motion'
import { useCountUp } from '@/hooks/use-count-up'

function MetricCard({ impact, index }: { impact: any, index: number }) {
  const { count, ref } = useCountUp(impact.numericValue, 2000)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="bg-glass-dark p-8 rounded-xl border-glow relative overflow-hidden group"
    >
      <div className={`absolute top-0 left-0 w-full h-1 opacity-50 transition-opacity group-hover:opacity-100 ${impact.color.replace('text-', 'bg-')}`} />
      
      <h3 className="font-display text-xl text-white mb-4">{impact.title}</h3>
      <div className={`font-display text-4xl sm:text-5xl font-bold mb-2 ${impact.color}`}>
        <span ref={ref}>
          {impact.isFloat ? count.toFixed(1) : Math.floor(count)}
        </span>
        {impact.suffix}
      </div>
      <div className="text-sm tracking-wider text-gray-500 uppercase mb-4">
        {impact.metric}
      </div>
      <p className="text-gray-400 text-sm">
        {impact.desc}
      </p>
    </motion.div>
  )
}

export function ProblemSection() {
  const impacts = [
    {
      title: 'Satellite Disruption',
      numericValue: 2.4,
      isFloat: true,
      suffix: 'B+',
      metric: 'Assets at Risk (USD)',
      desc: 'High-energy particles degrade solar panels and scramble electronics.',
      color: 'text-solar-orange'
    },
    {
      title: 'GPS/Nav Errors',
      numericValue: 45,
      isFloat: false,
      suffix: 'm',
      metric: 'Max Deviation',
      desc: 'Ionospheric disturbances cause significant positioning errors.',
      color: 'text-plasma-light'
    },
    {
      title: 'Grid Blackouts',
      numericValue: 9,
      isFloat: false,
      suffix: 'h',
      metric: 'Average Downtime',
      desc: 'Geomagnetically induced currents overload power transformers.',
      color: 'text-alert-red'
    }
  ]

  return (
    <section id="problem" className="relative min-h-screen w-full flex items-center justify-center section-padding z-10 bg-space-900/90 backdrop-blur-sm border-t border-white/5">
      <div className="max-w-6xl w-full mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
            THE INVISIBLE <span className="text-alert-red drop-shadow-[0_0_15px_rgba(255,51,102,0.5)]">THREAT</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Solar flares and Coronal Mass Ejections (CMEs) pose an existential threat to modern civilization&apos;s technological backbone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {impacts.map((impact, i) => (
            <MetricCard key={i} impact={impact} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
