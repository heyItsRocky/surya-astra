import { describe, it, expect } from 'vitest'
import { cn, formatNumber, formatPercent, clamp, lerp, mapRange, sleep, simpleHash } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('resolves conflicting tailwind classes (last wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('handles conditional falsy values', () => {
    expect(cn('base', false && 'hidden', undefined)).toBe('base')
  })
})

describe('formatNumber', () => {
  it('formats with no decimals by default', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })

  it('formats with requested decimals', () => {
    expect(formatNumber(3.14159, 2)).toBe('3.14')
  })
})

describe('formatPercent', () => {
  it('converts fraction to percent string', () => {
    expect(formatPercent(0.856, 1)).toBe('85.6%')
  })

  it('defaults to 1 decimal place', () => {
    expect(formatPercent(0.5)).toBe('50.0%')
  })
})

describe('clamp', () => {
  it('clamps below min', () => {
    expect(clamp(-5, 0, 10)).toBe(0)
  })
  it('clamps above max', () => {
    expect(clamp(50, 0, 10)).toBe(10)
  })
  it('passes through in-range values', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })
})

describe('lerp', () => {
  it('interpolates at t=0', () => {
    expect(lerp(0, 100, 0)).toBe(0)
  })
  it('interpolates at t=1', () => {
    expect(lerp(0, 100, 1)).toBe(100)
  })
  it('interpolates at t=0.5', () => {
    expect(lerp(0, 100, 0.5)).toBe(50)
  })
  it('clamps t outside [0,1]', () => {
    expect(lerp(0, 100, 2)).toBe(100)
    expect(lerp(0, 100, -1)).toBe(0)
  })
})

describe('mapRange', () => {
  it('maps linearly between ranges', () => {
    expect(mapRange(5, 0, 10, 0, 100)).toBe(50)
  })
  it('maps endpoints', () => {
    expect(mapRange(0, 0, 10, 0, 100)).toBe(0)
    expect(mapRange(10, 0, 10, 0, 100)).toBe(100)
  })
})

describe('sleep', () => {
  it('resolves after delay', async () => {
    const start = Date.now()
    await sleep(20)
    expect(Date.now() - start).toBeGreaterThanOrEqual(15)
  })
})

describe('simpleHash', () => {
  it('is stable for same input', () => {
    expect(simpleHash('surya')).toBe(simpleHash('surya'))
  })
  it('differs for different inputs', () => {
    expect(simpleHash('surya')).not.toBe(simpleHash('astra'))
  })
  it('returns non-negative integer', () => {
    const h = simpleHash('aditya-l1')
    expect(Number.isInteger(h)).toBe(true)
    expect(h).toBeGreaterThanOrEqual(0)
  })
})
