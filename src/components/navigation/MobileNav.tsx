'use client'

import { useState } from 'react'
import { useScrollSection } from '@/hooks/use-scroll-section'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { activeSection, scrollTo, sections } = useScrollSection()

  const handleNav = (id: string) => {
    scrollTo(id as 'hero' | 'problem' | 'mission' | 'solution' | 'dashboard' | 'team')
    setIsOpen(false)
  }

  return (
    <div className="md:hidden fixed top-4 right-4 z-50">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-glass rounded-lg border border-white/10 flex items-center justify-center backdrop-blur-md"
        aria-label="Toggle navigation menu"
      >
        <div className="flex flex-col gap-1.5">
          <span
            className={cn(
              'w-5 h-0.5 bg-white transition-all duration-300',
              isOpen && 'rotate-45 translate-y-2'
            )}
          />
          <span
            className={cn(
              'w-5 h-0.5 bg-white transition-all duration-300',
              isOpen && 'opacity-0'
            )}
          />
          <span
            className={cn(
              'w-5 h-0.5 bg-white transition-all duration-300',
              isOpen && '-rotate-45 -translate-y-2'
            )}
          />
        </div>
      </button>

      {/* Navigation Menu */}
      <div
        className={cn(
          'absolute top-14 right-0 w-48 bg-glass rounded-xl border border-white/10 backdrop-blur-md overflow-hidden transition-all duration-300',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        )}
      >
        <nav className="py-2">
          {sections.map(({ id, label }) => {
            const isActive = activeSection === id
            return (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={cn(
                  'w-full px-4 py-3 text-left text-sm font-display transition-colors',
                  isActive
                    ? 'text-solar-orange bg-solar-orange/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      isActive ? 'bg-solar-orange' : 'bg-space-600'
                    )}
                  />
                  {label}
                </div>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
