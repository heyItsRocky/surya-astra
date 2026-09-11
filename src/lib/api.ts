import { mockNowcast, mockForecast, mockAlerts, mockMission, mockTeam } from './mock-data'
import { sleep } from './utils'
import type { NowcastData, ForecastData, SpaceWeatherAlert, Mission, TeamMember, ApiResponse } from './types'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Helper to simulate network latency
const withLatency = async <T>(data: T, ms = 80): Promise<ApiResponse<T>> => {
  await sleep(ms)
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  }
}

// Helper to fetch from real API
const fetchApi = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  const res = await fetch(`${API_BASE}${endpoint}`)
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export const api = {
  getNowcast: async (): Promise<ApiResponse<NowcastData>> => {
    if (USE_MOCK) return withLatency(mockNowcast)
    return fetchApi<NowcastData>('/api/nowcast')
  },

  getForecast: async (): Promise<ApiResponse<ForecastData>> => {
    if (USE_MOCK) return withLatency(mockForecast)
    return fetchApi<ForecastData>('/api/forecast')
  },

  getAlerts: async (): Promise<ApiResponse<SpaceWeatherAlert[]>> => {
    if (USE_MOCK) return withLatency(mockAlerts)
    return fetchApi<SpaceWeatherAlert[]>('/api/alerts')
  },

  getMissionInfo: async (): Promise<ApiResponse<Mission>> => {
    if (USE_MOCK) return withLatency(mockMission, 400)
    return fetchApi<Mission>('/api/mission')
  },

  getTeam: async (): Promise<ApiResponse<TeamMember[]>> => {
    if (USE_MOCK) return withLatency(mockTeam, 200)
    return fetchApi<TeamMember[]>('/api/team')
  }
}
