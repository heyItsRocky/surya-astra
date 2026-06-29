import { NowcastData, ForecastData, Mission, TeamMember, SpaceWeatherAlert } from './types'

export const mockNowcast: NowcastData = {
  fluxHistory: Array.from({ length: 24 }).map((_, i) => ({
    timestamp: new Date(Date.now() - (24 - i) * 3600000).toISOString(),
    value: Math.pow(10, -8 + Math.random() * 4), // Range: A (10^-8) to M (10^-5)
    class: ['A', 'B', 'C', 'M'][Math.floor(Math.random() * 4)] as 'A' | 'B' | 'C' | 'M',
  })),
  currentClass: 'C',
  currentFlux: 3.2e-6, // C3.2
  peak24h: 5.4e-5, // M5.4
  activeRegions: 4,
  cmeRisk: 0.15,
}

export const mockForecast: ForecastData = {
  probabilities: [
    { class: 'C', probability: 0.85, confidence: 0.9, validUntil: '24h' },
    { class: 'M', probability: 0.35, confidence: 0.7, validUntil: '24h' },
    { class: 'X', probability: 0.05, confidence: 0.8, validUntil: '24h' },
  ],
  trend: 'increasing',
  modelConfidence: 0.82,
  validUntil: new Date(Date.now() + 24 * 3600000).toISOString(),
}

export const mockAlerts: SpaceWeatherAlert[] = [
  {
    id: 'alt-001',
    level: 'watch',
    title: 'M-Class Flare Watch',
    message: 'Active region AR3615 shows complex magnetic configuration (beta-gamma-delta). Risk of M-class flares elevated.',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    source: 'HEL1OS/Aditya-L1',
  },
]

export const mockMission: Mission = {
  name: 'Aditya-L1',
  status: 'active',
  launchDate: '2023-09-02',
  description: 'First Indian space-based observatory-class solar mission to study the Sun from a halo orbit around first Sun-Earth Lagrangian point (L1).',
  instruments: [
    'VELC (Visible Emission Line Coronagraph)',
    'SUIT (Solar Ultraviolet Imaging Telescope)',
    'SoLEXS (Solar Low Energy X-ray Spectrometer)',
    'HEL1OS (High Energy L1 Orbiting X-ray Spectrometer)',
    'ASPEX (Aditya Solar wind Particle Experiment)',
    'PAPA (Plasma Analyser Package for Aditya)',
    'MAG (Advanced Tri-axial High Resolution Digital Magnetometers)',
  ],
  orbit: 'Halo orbit at L1 (1.5 million km from Earth)',
  keyFact: 'Provides uninterrupted view of the Sun without any occultation/eclipses.',
}

export const mockTeam: TeamMember[] = [
  {
    name: 'Rakshith',
    role: 'Lead Developer & Architect',
    bio: 'Full-stack engineer specializing in performant web applications and data visualization.',
  },
  {
    name: 'Ghost AI',
    role: 'AI Co-pilot',
    bio: 'Agentic coding assistant providing rapid implementation, architecture guidance, and specialized problem solving.',
  }
]
