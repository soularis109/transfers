import { describe, expect, it } from 'vitest'
import { formatPrice } from './formatPrice'

describe('formatPrice', () => {
  it('formats a price with thousands separator', () => {
    expect(formatPrice(12345)).toBe('12 345 $')
  })

  it('formats a price without a separator', () => {
    expect(formatPrice(999)).toBe('999 $')
  })

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('0 $')
  })
})
