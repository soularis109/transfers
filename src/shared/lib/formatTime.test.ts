import { describe, expect, it } from 'vitest'
import { formatTime } from './formatTime'

describe('formatTime', () => {
  it('formats departure and arrival as HH:MM – HH:MM', () => {
    expect(formatTime('2026-06-12T14:50:00.000Z', 420)).toBe('14:50 – 21:50')
  })

  it('rolls over to the next day correctly', () => {
    expect(formatTime('2026-06-12T23:00:00.000Z', 90)).toBe('23:00 – 00:30')
  })
})
