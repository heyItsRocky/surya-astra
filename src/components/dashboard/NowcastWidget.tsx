'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatNumber } from '@/lib/utils'

export function NowcastWidget() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['nowcast'],
    queryFn: api.getNowcast,
    staleTime: 30_000,    // Don't refetch for 30s
    refetchInterval: 30_000,
  })

  const data = response?.data

  if (isLoading || !data) {
    return (
      <div className="bg-glass p-6 rounded-xl border border-white/5 h-full flex flex-col justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-solar-orange border-t-transparent animate-spin" />
      </div>
    )
  }

  // Format data for chart
  const chartData = data.fluxHistory.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: d.value
  }))

  return (
    <div className="bg-glass p-6 rounded-xl border border-white/5 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-display text-lg text-white mb-1">X-Ray Flux Nowcast</h3>
          <p className="text-xs text-gray-400">Live telemetry from HEL1OS</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-alert-green animate-pulse" />
          <span className="text-xs font-display text-alert-green tracking-widest uppercase">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-space-800/50 p-4 rounded-lg">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Class</div>
          <div className="font-display text-3xl font-bold text-solar-orange">{data.currentClass}</div>
        </div>
        <div className="bg-space-800/50 p-4 rounded-lg">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">CME Risk</div>
          <div className="font-display text-3xl font-bold text-alert-red">{(data.cmeRisk * 100).toFixed(0)}%</div>
        </div>
      </div>

      <div className="flex-1 min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#4B5563" fontSize={10} tickMargin={10} />
            <YAxis 
              scale="log" 
              domain={['auto', 'auto']} 
              stroke="#4B5563" 
              fontSize={10}
              tickFormatter={(val) => val.toExponential(1)}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#050510', borderColor: '#1F2937', borderRadius: '8px' }}
              itemStyle={{ color: '#FF6B35' }}
              labelStyle={{ color: '#9CA3AF' }}
              formatter={(value: number) => value.toExponential(2)}
            />
            <Area type="monotone" dataKey="value" stroke="#FF6B35" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
