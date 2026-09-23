'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 5000

/** Deterministic PRNG so particle setup is pure across renders. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildParticleData() {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const sizes = new Float32Array(PARTICLE_COUNT)
  const velocities = new Float32Array(PARTICLE_COUNT)
  const random = mulberry32(0x5a17a)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const isEquatorial = random() > 0.3

    let theta: number
    let phi: number

    if (isEquatorial) {
      phi = Math.PI / 2 + (random() - 0.5) * 0.8
      theta = random() * Math.PI * 2
    } else {
      const pole = random() > 0.5 ? 0.1 : Math.PI - 0.1
      phi = pole + (random() - 0.5) * 0.25
      theta = random() * Math.PI * 2
    }

    const r = 2.1 + Math.pow(random(), 1.5) * 3.0

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const distFromSurface = r - 2.0
    sizes[i] = (0.015 + random() * 0.04) * Math.max(0.3, 1 - distFromSurface * 0.2)
    velocities[i] = 0.1 + random() * 0.3 + (isEquatorial ? 0.1 : 0)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  return { geometry, velocities }
}

export function SunParticles({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  const velocityRef = useRef<Float32Array | null>(null)

  const { geometry, velocities } = useMemo(() => buildParticleData(), [])

  useEffect(() => {
    velocityRef.current = velocities
    return () => {
      geometry.dispose()
      velocityRef.current = null
    }
  }, [geometry, velocities])

  useFrame(state => {
    if (!pointsRef.current || !velocityRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    const vels = velocityRef.current
    const time = state.clock.elapsedTime

    pointsRef.current.rotation.y = time * 0.015
    pointsRef.current.rotation.x = Math.sin(time * 0.008) * 0.05

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3
      const x = positions[idx]
      const y = positions[idx + 1]
      const z = positions[idx + 2]

      let r = Math.sqrt(x * x + y * y + z * z)
      const theta = Math.atan2(y, x)
      const phi = Math.acos(Math.max(-1, Math.min(1, z / Math.max(0.001, r))))

      r += vels[i] * 0.003
      if (r > 5.5) {
        r = 2.1 + (i % 17) * 0.02
      }

      const waveX = Math.sin(time * 0.5 + i * 0.01) * 0.02
      const waveY = Math.cos(time * 0.4 + i * 0.015) * 0.02
      const waveZ = Math.sin(time * 0.3 + i * 0.02) * 0.02

      positions[idx] = (r + waveX) * Math.sin(phi) * Math.cos(theta)
      positions[idx + 1] = (r + waveY) * Math.sin(phi) * Math.sin(theta)
      positions[idx + 2] = (r + waveZ) * Math.cos(phi)
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true

    if (materialRef.current) {
      materialRef.current.opacity =
        (0.5 - scrollProgress * 0.35) * (0.7 + Math.sin(time * 0.2) * 0.1)
    }

    const scale = 1 + scrollProgress * 5
    pointsRef.current.scale.set(scale, scale, scale)
  })

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
