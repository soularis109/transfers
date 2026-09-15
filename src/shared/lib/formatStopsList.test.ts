import { describe, expect, it } from 'vitest'
import { formatStopsList } from './formatStopsList'

describe('formatStopsList', () => {
  it('joins stop codes with a comma', () => {
    expect(formatStopsList(['DXB', 'IST'])).toBe('DXB, IST')
  })

  it('returns an em dash for a direct flight', () => {
    expect(formatStopsList([])).toBe('—')
  })
})
