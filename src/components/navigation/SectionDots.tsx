'use client'

import { useScrollSection } from '@/hooks/use-scroll-section'
import { cn } from '@/lib/utils'

export function SectionDots() {
  const { activeSection, scrollTo, sections } = useScrollSection()

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
      {sections.map(({ id, label }) => {
        const isActive = activeSection === id
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="group relative flex items-center justify-end"
            aria-label={`Scroll to ${label}`}
          >
            <span
              className={cn(
                'absolute right-8 px-2 py-1 rounded bg-glass text-xs font-display whitespace-nowrap opacity-0 translate-x-4 transition-all duration-300 pointer-events-none',
                'group-hover:opacity-100 group-hover:translate-x-0',
                isActive ? 'text-solar-orange border-glow' : 'text-gray-400'
              )}
            >
              {label}
            </span>
            <div
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-300 border border-transparent',
                isActive
                  ? 'bg-solar-orange scale-125 glow-orange'
                  : 'bg-space-600 hover:bg-space-500 hover:scale-110 hover:border-gray-500'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
