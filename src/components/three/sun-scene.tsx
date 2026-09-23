'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { SunMesh } from './sun-mesh'
import { SunParticles } from './sun-particles'
import { Effects } from './effects'

/** Tracks scroll progress on the R3F frame loop and exposes it as state (throttled). */
function ScrollTracker({ children }: { children: (scroll: number) => React.ReactNode }) {
  const [scroll, setScroll] = useState(0)

  useFrame(() => {
    if (typeof window === 'undefined') return
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const next = Math.min(1, Math.max(0, window.scrollY / maxScroll))
    setScroll(prev => (Math.abs(prev - next) > 0.002 ? next : prev))
  })

  return <>{children(scroll)}</>
}

export function SunScene() {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 40 }}
        gl={{ antialias: false, alpha: true }}
      >
        <color attach="background" args={['#050510']} />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.3} />

        <Suspense fallback={null}>
          <ScrollTracker>
            {scrollProgress => (
              <>
                <SunMesh scrollProgress={scrollProgress} />
                <SunParticles scrollProgress={scrollProgress} />
              </>
            )}
          </ScrollTracker>
          <Effects />
          <Environment preset="night" />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  )
}
