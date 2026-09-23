import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useCountUp } from './use-count-up'

// framer-motion useInView — force in-view so animation starts
vi.mock('framer-motion', () => ({
  useInView: () => true,
}))

describe('useCountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'Date'],
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts at the start value', () => {
    const { result } = renderHook(() => useCountUp(100, 1000, 0))
    expect(result.current.count).toBe(0)
    expect(result.current.ref).toBeDefined()
  })

  it('animates toward end and settles at end', async () => {
    const { result } = renderHook(() => useCountUp(50, 200, 0))

    // Drive animation frames past duration
    await act(async () => {
      for (let i = 0; i < 30; i++) {
        vi.advanceTimersByTime(20)
        // flush rAF callbacks scheduled by the hook
        await Promise.resolve()
      }
    })

    await waitFor(() => {
      expect(result.current.count).toBe(50)
    })
  })
})
