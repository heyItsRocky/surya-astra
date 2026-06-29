'use client'

import { useState, useEffect } from 'react'
import type { SectionId } from '@/lib/types'

import { SECTIONS } from '@/lib/constants'

export function useScrollSection() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero')

  useEffect(() => {
    const observers = new Map<Element, IntersectionObserver>()
    
    // Create an observer for each section
    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // If the section is crossing the 50% threshold, make it active
            if (entry.isIntersecting) {
              setActiveSection(id as SectionId)
            }
          })
        },
        {
          root: null,
          rootMargin: '-40% 0px -40% 0px', // Triggers when element is near center of screen
          threshold: 0,
        }
      )

      observer.observe(element)
      observers.set(element, observer)
    })

    return () => {
      observers.forEach((observer, element) => observer.unobserve(element))
    }
  }, [])

  const scrollTo = (id: SectionId) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return { activeSection, scrollTo, sections: SECTIONS }
}
