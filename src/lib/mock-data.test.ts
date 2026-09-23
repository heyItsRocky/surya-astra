import { describe, it, expect } from 'vitest'
import { mockNowcast, mockForecast, mockAlerts, mockMission, mockTeam } from './mock-data'
import type { FluxClass, AlertLevel } from './types'

const FLUX_CLASSES: FluxClass[] = ['A', 'B', 'C', 'M', 'X']
const ALERT_LEVELS: AlertLevel[] = ['normal', 'watch', 'warning', 'extreme']

describe('mockNowcast', () => {
  it('has required NowcastData shape', () => {
    expect(mockNowcast).toMatchObject({
      currentClass: expect.any(String),
      currentFlux: expect.any(Number),
      peak24h: expect.any(Number),
      activeRegions: expect.any(Number),
      cmeRisk: expect.any(Number),
    })
    expect(FLUX_CLASSES).toContain(mockNowcast.currentClass)
    expect(mockNowcast.cmeRisk).toBeGreaterThanOrEqual(0)
    expect(mockNowcast.cmeRisk).toBeLessThanOrEqual(1)
    expect(mockNowcast.activeRegions).toBeGreaterThanOrEqual(0)
  })

  it('has fluxHistory readings with timestamp/value/class', () => {
    expect(Array.isArray(mockNowcast.fluxHistory)).toBe(true)
    expect(mockNowcast.fluxHistory.length).toBeGreaterThan(0)
    for (const reading of mockNowcast.fluxHistory) {
      expect(typeof reading.timestamp).toBe('string')
      expect(Number.isFinite(reading.value)).toBe(true)
      expect(FLUX_CLASSES).toContain(reading.class)
      expect(reading.value).toBeGreaterThan(0)
    }
  })
})

describe('mockForecast', () => {
  it('has C/M/X probabilities within 0-1', () => {
    const classes = mockForecast.probabilities.map(p => p.class)
    expect(classes).toEqual(expect.arrayContaining(['C', 'M', 'X']))
    for (const p of mockForecast.probabilities) {
      expect(p.probability).toBeGreaterThanOrEqual(0)
      expect(p.probability).toBeLessThanOrEqual(1)
      expect(p.confidence).toBeGreaterThanOrEqual(0)
      expect(p.confidence).toBeLessThanOrEqual(1)
    }
  })

  it('has valid trend and confidence', () => {
    expect(['increasing', 'stable', 'decreasing']).toContain(mockForecast.trend)
    expect(mockForecast.modelConfidence).toBeGreaterThanOrEqual(0)
    expect(mockForecast.modelConfidence).toBeLessThanOrEqual(1)
    expect(typeof mockForecast.validUntil).toBe('string')
  })
})

describe('mockAlerts', () => {
  it('each alert has id, level, title, message, timestamp, source', () => {
    expect(Array.isArray(mockAlerts)).toBe(true)
    for (const alert of mockAlerts) {
      expect(alert.id).toBeTruthy()
      expect(ALERT_LEVELS).toContain(alert.level)
      expect(alert.title).toBeTruthy()
      expect(alert.message).toBeTruthy()
      expect(alert.timestamp).toBeTruthy()
      expect(alert.source).toBeTruthy()
    }
  })
})

describe('mockMission', () => {
  it('describes Aditya-L1 with instruments', () => {
    expect(mockMission.name).toBe('Aditya-L1')
    expect(mockMission.instruments.length).toBeGreaterThan(0)
    expect(mockMission.instruments.some(i => i.includes('SoLEXS'))).toBe(true)
    expect(mockMission.instruments.some(i => i.includes('HEL1OS'))).toBe(true)
  })
})

describe('mockTeam', () => {
  it('has at least one member with name/role/bio', () => {
    expect(mockTeam.length).toBeGreaterThan(0)
    for (const member of mockTeam) {
      expect(member.name).toBeTruthy()
      expect(member.role).toBeTruthy()
      expect(member.bio).toBeTruthy()
    }
  })
})
