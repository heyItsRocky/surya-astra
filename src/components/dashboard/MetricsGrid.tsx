'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { api } from '@/lib/api'
import { formatNumber } from '@/lib/utils'

export function MetricsGrid() {
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['metrics-nowcast'],
    queryFn: api.getNowcast,
    staleTime: 30_000,
    refetchInterval: 30_000,
  })

  const nowcast = response?.data

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 w-full">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="bg-glass p-4 rounded-xl border border-white/5 h-32 flex flex-col items-center justify-center gap-3"
          >
            <div className="w-6 h-6 rounded-full border-2 border-solar-orange border-t-transparent animate-spin" />
            <p className="text-gray-500 text-xs font-display">Loading metrics...</p>
          </div>
        ))}
      </div>
    )
  }

  if (isError || !nowcast) {
    return (
      <div className="mt-6 w-full">
        <div className="bg-glass p-6 rounded-xl border border-alert-red/20 flex flex-col items-center justify-center text-center min-h-[120px]">
          <p className="text-gray-400 text-sm mb-1 font-display">Metrics Unavailable</p>
          <p className="text-gray-500 text-xs mb-4 max-w-md">
            {error?.message || 'Unable to fetch telemetry metrics'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-solar-orange/20 text-solar-orange rounded-lg text-xs font-display hover:bg-solar-orange/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const fluxClassLabel = nowcast.currentClass
  const metrics = [
    {
      id: 'active-regions',
      title: 'Active Regions',
      value: formatNumber(nowcast.activeRegions),
      trend: nowcast.activeRegions > 6 ? 'Elevated' : 'Nominal',
      trendUp: nowcast.activeRegions > 6,
      data: Array.from({ length: 7 }, (_, i) => Math.max(1, nowcast.activeRegions + ((i * 7) % 3) - 1)),
      color: '#FF6B35',
    },
    {
      id: 'cme-risk',
      title: 'CME Risk',
      value: `${(nowcast.cmeRisk * 100).toFixed(0)}`,
      unit: '%',
      trend: nowcast.cmeRisk > 0.5 ? 'Rising' : 'Stable',
      trendUp: nowcast.cmeRisk > 0.5,
      data: Array.from({ length: 7 }, (_, i) => nowcast.cmeRisk * 100 + ((i * 11) % 5) - 2),
      color: '#8B5CF6',
    },
    {
      id: 'xray-class',
      title: 'X-Ray Class',
      value: fluxClassLabel,
      trend: nowcast.peak24h > 1e-5 ? 'M peak 24h' : 'C peak 24h',
      trendUp: nowcast.peak24h > 1e-5,
      data: nowcast.fluxHistory.slice(-7).map(p => Math.log10(Math.max(p.value, 1e-9))),
      color: '#00FF88',
    },
    {
      id: 'peak-24h',
      title: 'Peak 24h Flux',
      value: nowcast.peak24h.toExponential(1),
      unit: ' W/m²',
      trend: nowcast.peak24h >= 1e-5 ? 'M+' : 'Below M',
      trendUp: nowcast.peak24h >= 1e-5,
      data: nowcast.fluxHistory.slice(-7).map(p => Math.log10(Math.max(p.value, 1e-9))),
      color: '#FF3366',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 w-full">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
          className="bg-glass p-4 rounded-xl border border-white/5 flex flex-col justify-between h-32"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-500 uppercase tracking-wider">{metric.title}</span>
            <span
              className={`text-xs font-bold ${metric.trendUp ? 'text-alert-green' : 'text-solar-orange'}`}
            >
              {metric.trend}
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <span className="font-display font-bold text-2xl text-white">{metric.value}</span>
              {metric.unit && <span className="text-gray-500 text-xs">{metric.unit}</span>}
            </div>

            <div className="w-16 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metric.data.map(v => ({ value: v }))}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={metric.color}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
