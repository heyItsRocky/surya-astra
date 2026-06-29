'use client'

import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'

export function Effects() {
  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={0.2} 
        mipmapBlur 
        intensity={2.5} 
      />
      <Noise opacity={0.02} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  )
}
