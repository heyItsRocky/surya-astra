// ============================================
// SURYA-ASTRA — Type Definitions
// Solar Flare Intelligence Dashboard
// ============================================

// --- Solar Data Types ---

/** NOAA X-ray flux class */
export type FluxClass = 'A' | 'B' | 'C' | 'M' | 'X'

/** Solar flare event */
export interface SolarFlare {
  id: string
  timestamp: string
  class: FluxClass
  magnitude: number // e.g. 1.5 for M1.5, 3.2 for X3.2
  region: string // Active region number
  location: string
  duration?: number // minutes
  cme?: boolean // Coronal mass ejection associated
  peak_flux?: number // W/m²
}

/** Real-time flux reading */
export interface FluxReading {
  timestamp: string
  value: number // W/m²
  class: FluxClass
}

/** Forecast probability */
export interface FlareProbability {
  class: FluxClass
  probability: number // 0–1
  confidence: number // 0–1
  validUntil: string
}

/** Space weather alert */
export type AlertLevel = 'normal' | 'watch' | 'warning' | 'extreme'

export interface SpaceWeatherAlert {
  id: string
  level: AlertLevel
  title: string
  message: string
  timestamp: string
  source: string
}

// --- Dashboard Types ---

/** Nowcast data */
export interface NowcastData {
  fluxHistory: FluxReading[]
  currentClass: FluxClass
  currentFlux: number
  peak24h: number
  activeRegions: number
  cmeRisk: number // 0–1
}

/** Forecast data */
export interface ForecastData {
  probabilities: FlareProbability[]
  trend: 'increasing' | 'stable' | 'decreasing'
  modelConfidence: number
  validUntil: string
}

/** Mission info */
export interface Mission {
  name: string
  status: 'active' | 'planned' | 'completed'
  launchDate?: string
  description: string
  instruments: string[]
  orbit?: string
  keyFact?: string
}

/** Team member */
export interface TeamMember {
  name: string
  role: string
  bio: string
  image?: string
}

// --- UI Types ---

/** Section ID for scroll tracking */
export type SectionId =
  | 'hero'
  | 'problem'
  | 'mission'
  | 'solution'
  | 'dashboard'
  | 'team'

/** Scroll section state */
export interface ScrollSectionState {
  activeSection: SectionId
  progress: number // 0–1 within section
  isVisible: boolean
}

/** Animation config */
export interface AnimationConfig {
  duration: number
  delay: number
  easing?: string
}

// --- API Response Types ---

export interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  error?: string
}
