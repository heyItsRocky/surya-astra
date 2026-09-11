'use client'

import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

export function Effects() {
  return (
    <EffectComposer>
      {/* Bloom — strong glow for the sun */}
      <Bloom
        luminanceThreshold={0.1}
        luminanceSmoothing={0.9}
        mipmapBlur
        intensity={2.0}
      />

      {/* Chromatic aberration — subtle color fringing near bright edges */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0015, 0.0008]}
      />

      {/* Subture film grain for texture */}
      <Noise opacity={0.015} />

      {/* Vignette — darkens edges to focus on center */}
      <Vignette eskil={false} offset={0.15} darkness={0.9} />
    </EffectComposer>
  )
}
