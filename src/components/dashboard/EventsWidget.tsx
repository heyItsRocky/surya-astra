'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function EventsWidget() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: api.getAlerts,
    refetchInterval: 10000,
  })

  const alerts = response?.data || []

  if (isLoading) {
    return (
      <div className="bg-glass p-6 rounded-xl border border-white/5 h-full flex flex-col justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-alert-red border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-glass p-6 rounded-xl border border-white/5 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-display text-lg text-white mb-1">Space Weather Alerts</h3>
          <p className="text-xs text-gray-400">Automated Threat Detection</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-alert-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-alert-red"></span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="text-center text-gray-500 py-8 text-sm">
            No active alerts
          </div>
        ) : (
          alerts.map((alert) => {
            let borderColor = 'border-alert-green'
            let bgColor = 'bg-alert-green/10'
            let textColor = 'text-alert-green'
            
            if (alert.level === 'watch') {
              borderColor = 'border-solar-gold'
              bgColor = 'bg-solar-gold/10'
              textColor = 'text-solar-gold'
            } else if (alert.level === 'warning') {
              borderColor = 'border-solar-orange'
              bgColor = 'bg-solar-orange/10'
              textColor = 'text-solar-orange'
            } else if (alert.level === 'extreme') {
              borderColor = 'border-alert-red'
              bgColor = 'bg-alert-red/10'
              textColor = 'text-alert-red'
            }

            return (
              <div key={alert.id} className={`p-4 rounded-lg border-l-2 ${borderColor} ${bgColor}`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-display font-bold text-sm ${textColor}`}>{alert.title}</h4>
                  <span className="text-xs text-gray-500">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  {alert.message}
                </p>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Source: {alert.source}</span>
                  <span className="uppercase tracking-wider">{alert.level}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
