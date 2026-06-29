'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

export function MetricsGrid() {
  const metrics = [
    {
      id: 'active-regions',
      title: 'Active Regions',
      value: '12',
      trend: '+2',
      trendUp: true,
      data: [10, 10, 11, 10, 12, 11, 12],
      color: '#FF6B35'
    },
    {
      id: 'solar-wind',
      title: 'Solar Wind Speed',
      value: '450',
      unit: ' km/s',
      trend: '-15%',
      trendUp: false,
      data: [500, 480, 490, 470, 460, 440, 450],
      color: '#8B5CF6'
    },
    {
      id: 'xray-bg',
      title: 'X-Ray Background',
      value: 'B4.5',
      trend: 'Stable',
      trendUp: true,
      data: [4.1, 4.2, 4.5, 4.4, 4.5, 4.6, 4.5],
      color: '#00FF88'
    },
    {
      id: 'kp-index',
      title: 'Kp Index',
      value: '3.2',
      unit: ' / 9',
      trend: '+0.5',
      trendUp: true,
      data: [2.0, 2.3, 2.5, 2.8, 3.0, 3.1, 3.2],
      color: '#FF3366'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 w-full">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
          className="bg-glass p-4 rounded-xl border border-white/5 flex flex-col justify-between h-32"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-500 uppercase tracking-wider">{metric.title}</span>
            <span className={`text-xs font-bold ${metric.trendUp ? 'text-alert-green' : 'text-solar-orange'}`}>
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
