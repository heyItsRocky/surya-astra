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

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false)

  return (
    <main className="relative w-full">
      <IntroSequence onComplete={() => setIntroComplete(true)} />
      
      {/* Fixed 3D Background */}
      {introComplete && <SunSceneWrapper />}

      {/* Sections */}
      <div className="relative z-10" style={{ opacity: introComplete ? 1 : 0, transition: 'opacity 1s ease-in' }}>
        <HeroSection />
        <ProblemSection />
        <MissionSection />
        <SolutionSection />
        <DashboardSection />
        <TeamSection />
      </div>
    </main>
  )
}
