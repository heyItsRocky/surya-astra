'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function SunParticles({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  const velocityRef = useRef<Float32Array | null>(null)

  const PARTICLE_COUNT = 5000

  // ── Generate particle geometry ──────────────────────────────────────────
  const geometry = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const velocities = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Coronal loop distribution:
      //  - Most particles cluster near equatorial latitudes (±30°)
      //  - A secondary population forms polar plumes
      //  - Random radius between 2.1 and 5.0
      const isEquatorial = Math.random() > 0.3

      let theta: number
      let phi: number

      if (isEquatorial) {
        // Equatorial band — concentrated within ±30° latitude
        phi = Math.PI / 2 + (Math.random() - 0.5) * 0.8   // ±23°
        theta = Math.random() * Math.PI * 2
      } else {
        // Polar plumes — two jets at poles
        const pole = Math.random() > 0.5 ? 0.1 : Math.PI - 0.1
        phi = pole + (Math.random() - 0.5) * 0.25
        theta = Math.random() * Math.PI * 2
      }

      // Radius distribution: dense near surface, thinning out
      const r = 2.1 + Math.pow(Math.random(), 1.5) * 3.0

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      // Size: larger near surface, smaller further out
      const distFromSurface = r - 2.0
      sizes[i] = (0.015 + Math.random() * 0.04) * Math.max(0.3, 1 - distFromSurface * 0.2)

      // Velocity (outward drift speed, stored for useFrame)
      velocities[i] = 0.1 + Math.random() * 0.3 + (isEquatorial ? 0.1 : 0)
    }

    velocityRef.current = velocities

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return geo
  }, [])

  // ── Animation loop ──────────────────────────────────────────────────────
  useFrame((state) => {
    if (!pointsRef.current || !velocityRef.current) return

    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array
    const velocities = velocityRef.current
    const time = state.clock.elapsedTime
    const count = PARTICLE_COUNT

    // Slow rotation of the entire particle field
    pointsRef.current.rotation.y = time * 0.015
    pointsRef.current.rotation.x = Math.sin(time * 0.008) * 0.05

    // Animate individual particles: outward drift + recycle
    for (let i = 0; i < count; i++) {
      const idx = i * 3

      // Current position as spherical coords
      const x = positions[idx]
      const y = positions[idx + 1]
      const z = positions[idx + 2]

      let r = Math.sqrt(x * x + y * y + z * z)
      const theta = Math.atan2(y, x)
      const phi = Math.acos(Math.max(-1, Math.min(1, z / Math.max(0.001, r))))

      // Outward drift
      r += velocities[i] * 0.003

      // If too far, recycle back near surface
      if (r > 5.5) {
        r = 2.1 + Math.random() * 0.3
      }

      // Add gentle wavy motion (coronal loop oscillation)
      const waveX = Math.sin(time * 0.5 + i * 0.01) * 0.02
      const waveY = Math.cos(time * 0.4 + i * 0.015) * 0.02
      const waveZ = Math.sin(time * 0.3 + i * 0.02) * 0.02

      positions[idx]     = (r + waveX) * Math.sin(phi) * Math.cos(theta)
      positions[idx + 1] = (r + waveY) * Math.sin(phi) * Math.sin(theta)
      positions[idx + 2] = (r + waveZ) * Math.cos(phi)
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Material animation
    if (materialRef.current) {
      // Opacity: fade with scroll
      materialRef.current.opacity = (0.5 - scrollProgress * 0.35) * (0.7 + Math.sin(time * 0.2) * 0.1)
    }

    // Scroll-based scale expansion (disintegration effect)
    const scale = 1 + scrollProgress * 5
    pointsRef.current.scale.set(scale, scale, scale)
  })

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        size={0.035}
        color="#FF8C42"
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
