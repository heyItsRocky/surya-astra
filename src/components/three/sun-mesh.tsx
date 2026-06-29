'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export function SunMesh() {
  const groupRef = useRef<THREE.Group>(null)
  const materialRef = useRef<any>(null)
  const innerMatRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame((state, delta) => {
    const scrollY = window.scrollY
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll))

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
      
      // Fracture/disintegrate effect on scroll
      const scale = 1 - (scrollProgress * 0.9)
      groupRef.current.scale.set(scale, scale, scale)
    }
    
    // Animate the distort material for a "boiling" effect
    if (materialRef.current) {
      materialRef.current.distort = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + (scrollProgress * 1.5)
      materialRef.current.opacity = 1 - scrollProgress
      materialRef.current.transparent = true
    }

    if (innerMatRef.current) {
      innerMatRef.current.opacity = 1 - scrollProgress
      innerMatRef.current.transparent = true
    }
  })

  return (
    <group ref={groupRef}>
      <Sphere args={[2, 64, 64]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#FF4400"
          emissive="#FF2200"
          emissiveIntensity={2}
          roughness={0.4}
          metalness={0.1}
          distort={0.4}
          speed={2}
        />
      </Sphere>
      
      {/* Inner core for dense color */}
      <Sphere args={[1.9, 32, 32]}>
        <meshBasicMaterial ref={innerMatRef} color="#FFDD00" />
      </Sphere>
    </group>
  )
}
