'use client'

import { useState } from 'react'
import { SECTIONS } from '@/lib/constants'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProblemSection } from '@/components/sections/ProblemSection'
import { MissionSection } from '@/components/sections/MissionSection'
import { SolutionSection } from '@/components/sections/SolutionSection'
import { DashboardSection } from '@/components/dashboard/DashboardSection'
import { TeamSection } from '@/components/sections/TeamSection'
import { SunSceneWrapper } from '@/components/three/sun-scene-wrapper'
import { IntroSequence } from '@/components/layout/IntroSequence'
import { ErrorBoundary } from '@/components/ui/error-boundary'

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false)

  return (
    <main className="relative w-full">
      <IntroSequence onComplete={() => setIntroComplete(true)} />
      
      {/* Fixed 3D Background */}
      {introComplete && (
        <ErrorBoundary
          fallback={
            <div className="canvas-container bg-space-900 flex items-center justify-center overflow-hidden">
              <div className="absolute w-[200vw] h-[200vw] bg-solar-orange/10 rounded-full blur-[100px]" />
              <div className="absolute w-[100vw] h-[100vw] bg-solar-gold/5 rounded-full blur-[80px]" />
            </div>
          }
        >
          <SunSceneWrapper />
        </ErrorBoundary>
      )}

      {/* Sections */}
      <div className="relative z-10" style={{ opacity: introComplete ? 1 : 0, transition: 'opacity 1s ease-in' }}>
        <HeroSection />
        <ProblemSection />
        <MissionSection />
        <SolutionSection />
        <ErrorBoundary
          fallback={
            <section id="dashboard" className="relative min-h-screen w-full flex flex-col items-center justify-center section-padding z-10 bg-space-900 border-t border-white/5">
              <div className="w-full max-w-7xl mx-auto text-center">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                  COMMAND <span className="text-alert-red">CENTER</span>
                </h2>
                <p className="text-gray-400 text-sm mb-6">Dashboard temporarily unavailable</p>
                <div className="bg-glass p-8 rounded-xl border border-alert-red/20 max-w-md mx-auto">
                  <p className="text-gray-300 text-sm">
                    The solar flare dashboard encountered an error. Please refresh the page to try again.
                  </p>
                </div>
              </div>
            </section>
          }
        >
          <DashboardSection />
        </ErrorBoundary>
        <TeamSection />
      </div>
    </main>
  )
}
