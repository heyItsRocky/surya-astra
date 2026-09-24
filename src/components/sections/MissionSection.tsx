'use client'

import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function MissionSection() {
  const { data: missionResponse, isLoading } = useQuery({
    queryKey: ['mission'],
    queryFn: api.getMissionInfo
  })

  const mission = missionResponse?.data

  return (
    <section id="mission" className="relative min-h-screen w-full flex items-center justify-center section-padding z-10 bg-space-900/95 backdrop-blur-md border-t border-white/5">
      <div className="max-w-6xl w-full mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:w-1/2"
        >
          <div className="inline-block px-3 py-1 rounded bg-plasma/20 border border-plasma/50 text-plasma-light text-xs font-display tracking-widest uppercase mb-4">
            Our Vantage Point
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            ADITYA-<span className="text-solar-gold drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">L1</span>
          </h2>
          
          {isLoading || !mission ? (
            <div className="h-32 flex items-center">
              <div className="w-6 h-6 border-2 border-solar-orange border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                {mission.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-glass p-4 rounded-lg border-l-2 border-solar-orange">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Orbit</div>
                  <div className="text-sm text-gray-200 font-display">{mission.orbit}</div>
                </div>
                <div className="bg-glass p-4 rounded-lg border-l-2 border-plasma">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
                  <div className="text-sm text-alert-green font-display flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-alert-green animate-pulse" />
                    {mission.status.toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Key Instruments Utilized</div>
                <div className="flex flex-wrap gap-2">
                  {mission.instruments.slice(0, 3).map((inst, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                      {inst.split(' ')[0]}
                    </span>
                  ))}
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-500">
                    +{mission.instruments.length - 3} more
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Decorative L1 Point Diagram */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[600px] hidden lg:block opacity-30 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-500 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-solar-orange rounded-full blur-[120px]" />
        
        {/* Orbital rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[40%] border border-dashed border-white/20 rounded-[100%] rotate-12" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[30%] border border-dashed border-solar-orange/30 rounded-[100%] -rotate-6" />
      </div>
    </section>
  )
}
