'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts'

export function ForecastWidget() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['forecast'],
    queryFn: api.getForecast
  })

  const data = response?.data

  if (isLoading || !data) {
    return (
      <div className="bg-glass p-6 rounded-xl border border-white/5 h-full flex flex-col justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-plasma border-t-transparent animate-spin" />
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
