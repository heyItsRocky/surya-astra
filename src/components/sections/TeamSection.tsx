'use client'

import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function TeamSection() {
  const { data: teamResponse } = useQuery({
    queryKey: ['team'],
    queryFn: api.getTeam
  })

  const team = teamResponse?.data || []

  return (
    <section id="team" className="relative min-h-screen w-full flex flex-col items-center justify-center section-padding z-10 bg-space-900 border-t border-white/5">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 max-w-3xl"
      >
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
          THE <span className="text-solar-gold drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">CREW</span>
        </h2>
        <p className="text-gray-400 text-lg">
          Built by humans, accelerated by AI.
        </p>
      </motion.div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {team.map((member, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="bg-glass-dark p-8 rounded-xl border border-white/5 flex flex-col items-center text-center hover:bg-space-800 transition-colors"
          >
            <div className="w-24 h-24 rounded-full bg-space-700 border-2 border-solar-orange mb-6 flex items-center justify-center text-3xl">
              {member.name.charAt(0)}
            </div>
            <h3 className="font-display text-2xl text-white mb-2">{member.name}</h3>
            <div className="text-solar-orange text-sm font-display tracking-widest uppercase mb-4">{member.role}</div>
            <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.8 }}
        className="mt-32 text-center"
      >
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-gray-500 hover:text-white transition-colors text-sm font-display tracking-widest uppercase flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-t from-gray-500 to-transparent" />
          RETURN TO APEX
        </button>
      </motion.div>
    </section>
  )
}
