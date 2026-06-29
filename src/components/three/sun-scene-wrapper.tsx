'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const SunScene = dynamic(() => import('./sun-scene').then(mod => mod.SunScene), {
  ssr: false,
  loading: () => (
    <div className="canvas-container bg-space-900 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-solar-orange border-t-transparent animate-spin" />
    </div>
  )
})

export function SunSceneWrapper() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkMobile()
    
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile) {
    return (
      <div className="canvas-container bg-space-900 flex items-center justify-center overflow-hidden">
        {/* Fallback mobile background */}
        <div className="absolute w-[200vw] h-[200vw] bg-solar-orange/10 rounded-full blur-[100px]" />
        <div className="absolute w-[100vw] h-[100vw] bg-solar-gold/5 rounded-full blur-[80px]" />
      </div>
    )
  }

  return <SunScene />
}
