'use client'

import { useEffect, useState, useRef } from 'react'
import { createTimeline, stagger } from 'animejs'

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [isFinished, setIsFinished] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Lock scroll during intro
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)

    const tl = createTimeline({
      defaults: {
        ease: 'outExpo'
      },
      onComplete: () => {
        setIsFinished(true)
        document.body.style.overflow = 'auto'
        onComplete()
      }
    })

    // Animation sequence
    tl
    .add('.intro-text', {
      opacity: [0, 1],
      y: [20, 0],
      duration: 800,
      delay: stagger(200)
    })
    .add('.intro-progress-bar', {
      width: ['0%', '100%'],
      duration: 1500,
      ease: 'inOutQuart'
    })

    if (containerRef.current) {
      tl.add(containerRef.current, {
        opacity: [1, 0],
        duration: 800,
        ease: 'inQuad'
      })
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [onComplete])

  if (isFinished) return null

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-space-900 flex flex-col items-center justify-center p-6"
    >
      <div className="max-w-md w-full font-display text-center">
        <div className="intro-text text-solar-orange text-sm tracking-widest uppercase mb-4">
          ISRO Bharatiya Antriksh Hackathon '26
        </div>
        <div className="intro-text text-3xl md:text-4xl text-white font-bold mb-8 tracking-wider">
          INITIALIZING<br/>SURYA-ASTRA
        </div>
        
        <div className="intro-text text-xs text-gray-500 text-left mb-2 flex justify-between">
          <span>Establishing uplink to Aditya-L1...</span>
          <span>HEL1OS / SoLEXS</span>
        </div>
        
        <div className="w-full h-1 bg-space-700 overflow-hidden rounded-full">
          <div className="intro-progress-bar h-full w-0 bg-gradient-to-r from-solar-orange to-solar-gold glow-orange" />
        </div>
      </div>
    </div>
  )
}
