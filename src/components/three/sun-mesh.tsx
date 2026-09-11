'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

// ─── Vertex Shader ───────────────────────────────────────────────────────────
const vertexShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vDisplacement;
  varying float vLimb;

  // Layered pseudo-noise for granulation
  float fbm(vec3 p) {
    float n = 0.0;
    float amp = 0.5;
    float freq = 1.5;
    for (int i = 0; i < 4; i++) {
      vec3 q = p * freq;
      n += amp * (sin(q.x * 2.3 + q.y * 3.7 + q.z * 5.1 + uTime * 0.25) *
                  cos(q.y * 1.9 + q.z * 4.3 + q.x * 2.7 + uTime * 0.18) *
                  sin(q.z * 3.1 + q.x * 5.9 + q.y * 1.3 + uTime * 0.12));
      amp *= 0.5;
      freq *= 2.0;
    }
    return n;
  }

  void main() {
    vec3 pos = position;
    vec3 norm = normalize(normal);

    // Multi-octave noise for granulation displacement
    float n = fbm(pos * 1.2);

    // Sunspot modulation — large cool darker patches
    float spotAngle = sin(pos.x * 0.4 + 1.2) * cos(pos.y * 0.6 + 0.8) * sin(pos.z * 0.5 + 2.1);
    float spot = smoothstep(0.65, 0.95, abs(spotAngle)) * 0.18;

    float displacement = n * 0.18 - spot * 0.22;
    vDisplacement = displacement;

    pos += norm * displacement;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vec3 viewDir = normalize(cameraPosition - worldPos.xyz);
    vNormal = normalize(normalMatrix * norm);

    // Limb darkening factor — edges darker
    vLimb = 1.0 - max(0.0, dot(viewDir, vNormal)) * 0.55;

    vViewPosition = (viewMatrix * worldPos).xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

// ─── Fragment Shader ─────────────────────────────────────────────────────────
const fragmentShader = `
  uniform float uTime;
  uniform float uScrollProgress;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vDisplacement;
  varying float vLimb;

  // Same FBM for fragment detail
  float fbm(vec3 p) {
    float n = 0.0;
    float amp = 0.5;
    float freq = 1.5;
    for (int i = 0; i < 4; i++) {
      vec3 q = p * freq;
      n += amp * (sin(q.x * 2.3 + q.y * 3.7 + q.z * 5.1 + uTime * 0.25) *
                  cos(q.y * 1.9 + q.z * 4.3 + q.x * 2.7 + uTime * 0.18) *
                  sin(q.z * 3.1 + q.x * 5.9 + q.y * 1.3 + uTime * 0.12));
      amp *= 0.5;
      freq *= 2.0;
    }
    return n;
  }

  void main() {
    // Surface detail intensity from noise (fragment-space)
    float detail = fbm(vNormal * 2.5) * 0.3 + 0.5;

    // Hot flare spots — brief bright eruptions
    float flareSeed = sin(vNormal.x * 12.0 + uTime * 0.6) *
                      cos(vNormal.y * 14.0 + uTime * 0.4) *
                      sin(vNormal.z * 10.0 + uTime * 0.5);
    float flare = max(0.0, flareSeed * flareSeed - 0.92) * 8.0;

    // Intensity combines displacement height + noise detail + flares
    float intensity = smoothstep(-0.3, 0.6, vDisplacement * 1.2 + detail * 0.6) + flare;

    // Color palette — 4-stop gradient: deep red → orange → yellow → white-hot
    vec3 c1 = vec3(0.55, 0.08, 0.02);  // deep red (cooler / limb)
    vec3 c2 = vec3(1.0, 0.35, 0.05);   // orange (mid)
    vec3 c3 = vec3(1.0, 0.75, 0.20);   // golden yellow (hot)
    vec3 c4 = vec3(1.0, 0.95, 0.80);   // white-hot (flares / core)

    vec3 color = mix(c1, c2, smoothstep(0.0, 0.35, intensity));
    color = mix(color, c3, smoothstep(0.35, 0.65, intensity));
    color = mix(color, c4, smoothstep(0.65, 1.0, intensity));

    // Apply limb darkening (edges are darker and redder)
    color *= mix(0.65, 1.0, vLimb);

    // Subtle pulsation
    float pulse = 1.0 + sin(uTime * 0.15) * 0.025;
    color *= pulse;

    // Strong emissive glow
    float emissive = 0.4 + intensity * 0.5;
    color += vec3(1.0, 0.35, 0.05) * emissive * 0.35;

    // Scroll-based fade-out (disintegration effect)
    color = mix(color, vec3(0.0), uScrollProgress);

    gl_FragColor = vec4(color, 1.0 - uScrollProgress * 0.7);
  }
`

// ─── Corona Fresnel Shader ───────────────────────────────────────────────────
const coronaVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const coronaFragmentShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    // Fresnel effect — bright at edges, transparent in center
    float fresnel = 1.0 - max(0.0, dot(vViewDir, vNormal));
    fresnel = pow(fresnel, 2.5);

    // Wispy noise animation
    float shimmer = sin(vNormal.x * 15.0 + uTime * 0.3) *
                    cos(vNormal.y * 12.0 + uTime * 0.4) *
                    sin(vNormal.z * 18.0 + uTime * 0.2);
    shimmer = shimmer * 0.3 + 0.7;

    float alpha = fresnel * 0.5 * shimmer * (1.0 - uScrollProgress * 0.9);

    vec3 coronaColor = mix(
      vec3(1.0, 0.3, 0.05),
      vec3(1.0, 0.6, 0.15),
      fresnel
    );

    gl_FragColor = vec4(coronaColor, alpha);
  }
`

// ─── React Components ────────────────────────────────────────────────────────

/** The main photosphere surface with custom shader */
function SunSurface({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const clockRef = useRef({ time: 0 })

  useFrame((state) => {
    clockRef.current.time = state.clock.elapsedTime
    if (ref.current) {
      const mat = ref.current.material as THREE.ShaderMaterial
      mat.uniforms.uTime.value = state.clock.elapsedTime
      mat.uniforms.uScrollProgress.value = scrollProgress
    }
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScrollProgress: { value: 0 },
  }), [])

  return (
    <Sphere ref={ref} args={[2, 96, 96]}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </Sphere>
  )
}

/** Ethereal corona glow around the sun */
function SunCorona({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.ShaderMaterial
      mat.uniforms.uTime.value = state.clock.elapsedTime
      mat.uniforms.uScrollProgress.value = scrollProgress
    }
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScrollProgress: { value: 0 },
  }), [])

  return (
    <Sphere ref={ref} args={[2.35, 48, 48]}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={coronaVertexShader}
        fragmentShader={coronaFragmentShader}
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Sphere>
  )
}

/** Warm inner glow core */
function SunCore() {
  return (
    <Sphere args={[1.85, 32, 32]}>
      <meshBasicMaterial
        color="#FFD700"
        transparent
        opacity={0.3}
        toneMapped={false}
      />
    </Sphere>
  )
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function SunMesh({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04
      // Scroll-based scale for disintegration
      const scale = 1 - scrollProgress * 0.85
      groupRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group ref={groupRef}>
      <SunCore />
      <SunSurface scrollProgress={scrollProgress} />
      <SunCorona scrollProgress={scrollProgress} />
    </group>
  )
}
