import { describe, expect, it } from 'vitest'
import { formatDuration } from './formatDuration'

describe('formatDuration', () => {
  it('formats minutes as hours and minutes', () => {
    expect(formatDuration(2055)).toBe('34г 15хв')
  })

  it('handles a duration under an hour', () => {
    expect(formatDuration(45)).toBe('0г 45хв')
  })

  it('handles an exact multiple of 60', () => {
    expect(formatDuration(420)).toBe('7г 0хв')
  })
})
