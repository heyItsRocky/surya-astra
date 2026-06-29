'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function SunParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  
  const particleCount = 2000
  
  const [positions, scales, originalRadii] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const scale = new Float32Array(particleCount)
    const radii = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution around the sun
      const radius = 2.2 + Math.random() * 2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)
      
      scale[i] = Math.random()
      radii[i] = radius
    }
    
    return [pos, scale, radii]
  }, [])

  useFrame((state) => {
    const scrollY = window.scrollY
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll))

    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
      pointsRef.current.rotation.z = state.clock.elapsedTime * 0.01

      // Expand particles as we scroll down to simulate disintegration/explosion
      const scale = 1 + scrollProgress * 6
      pointsRef.current.scale.set(scale, scale, scale)
    }

    if (materialRef.current) {
      // Fade out slightly, but let them scatter
      materialRef.current.opacity = 0.6 - (scrollProgress * 0.4)
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.05}
        color="#FF8C42"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
