'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts'

export function ForecastWidget() {
  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['forecast'],
    queryFn: api.getForecast,
    staleTime: 60_000,
  })

  const data = response?.data

  if (isLoading) {
    return (
      <div className="bg-glass p-6 rounded-xl border border-white/5 h-full flex flex-col justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-plasma border-t-transparent animate-spin" />
        <p className="text-gray-500 text-xs mt-3 font-display">Loading forecast...</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="bg-glass p-6 rounded-xl border border-alert-red/20 h-full flex flex-col justify-center items-center min-h-[300px]">
        <div className="w-10 h-10 rounded-full bg-alert-red/10 flex items-center justify-center mb-3">
          <svg className="w-5 h-5 text-alert-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm mb-1 font-display">Forecast Unavailable</p>
        <p className="text-gray-500 text-xs mb-4 max-w-xs text-center">
          {error?.message || 'Unable to fetch forecast data'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-plasma/20 text-plasma-light rounded-lg text-xs font-display hover:bg-plasma/30 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  // Format data for RadialBar
  const chartData = data.probabilities.map((p, i) => {
    let fill = '#00FF88' // C class
    if (p.class === 'M') fill = '#FFD700'
    if (p.class === 'X') fill = '#FF3366'
    
    return {
      name: `Class ${p.class}`,
      value: p.probability * 100,
      fill
    }
  })

  return (
    <div className="bg-glass p-6 rounded-xl border border-white/5 h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-display text-lg text-white mb-1">24h Forecast</h3>
          <p className="text-xs text-gray-400">Hybrid ML Pipeline Prediction</p>
        </div>
        <div className="px-2 py-1 rounded bg-plasma/20 text-plasma-light text-xs font-display">
          Conf: {(data.modelConfidence * 100).toFixed(0)}%
        </div>
      </div>

      <div className="flex-1 min-h-[250px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="30%" 
            outerRadius="100%" 
            barSize={15} 
            data={chartData}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              background={{ fill: 'rgba(255,255,255,0.05)' }}
              dataKey="value"
              cornerRadius={10}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#050510', borderColor: '#1F2937', borderRadius: '8px' }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Probability']}
            />
            <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" wrapperStyle={{ fontSize: '12px' }} />
          </RadialBarChart>
        </ResponsiveContainer>
        
        {/* Center label */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-xs text-gray-500 uppercase">Trend</div>
          <div className={`font-display font-bold ${data.trend === 'increasing' ? 'text-alert-red' : 'text-alert-green'}`}>
            {data.trend.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  )
}
