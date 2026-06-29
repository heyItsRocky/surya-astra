'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function TopNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between',
        scrolled ? 'bg-space-900/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent'
      )}
    >
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-solar-orange to-solar-gold glow-orange flex items-center justify-center">
          <span className="text-space-900 font-display font-bold text-sm">S</span>
        </div>
        <span className="font-display font-bold text-xl tracking-wider text-white">
          SURYA<span className="text-solar-orange">-ASTRA</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-display text-gray-400">
          <span className="w-2 h-2 rounded-full bg-alert-green animate-pulse" />
          SYSTEM ONLINE
        </div>
        <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-display text-gray-300">
          ISRO Hackathon &apos;26
        </div>
      </div>
    </header>
  )
}
