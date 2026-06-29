import { mockNowcast, mockForecast, mockAlerts, mockMission, mockTeam } from './mock-data'
import { sleep } from './utils'
import type { NowcastData, ForecastData, SpaceWeatherAlert, Mission, TeamMember, ApiResponse } from './types'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

// Helper to simulate network latency
const withLatency = async <T>(data: T, ms = 800): Promise<ApiResponse<T>> => {
  await sleep(ms)
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  }
}

export const api = {
  getNowcast: async (): Promise<ApiResponse<NowcastData>> => {
    if (USE_MOCK) return withLatency(mockNowcast)
    throw new Error('Real API not implemented yet')
  },

  getForecast: async (): Promise<ApiResponse<ForecastData>> => {
    if (USE_MOCK) return withLatency(mockForecast)
    throw new Error('Real API not implemented yet')
  },

  getAlerts: async (): Promise<ApiResponse<SpaceWeatherAlert[]>> => {
    if (USE_MOCK) return withLatency(mockAlerts)
    throw new Error('Real API not implemented yet')
  },

  getMissionInfo: async (): Promise<ApiResponse<Mission>> => {
    if (USE_MOCK) return withLatency(mockMission, 400)
    throw new Error('Real API not implemented yet')
  },

  getTeam: async (): Promise<ApiResponse<TeamMember[]>> => {
    if (USE_MOCK) return withLatency(mockTeam, 200)
    throw new Error('Real API not implemented yet')
  }
}
