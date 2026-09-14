import { describe, expect, it } from 'vitest'
import { pluralizeStops } from './pluralizeStops'

describe('pluralizeStops', () => {
  it('returns "Без пересадок" for zero stops', () => {
    expect(pluralizeStops(0)).toBe('Без пересадок')
  })

  it('returns singular form for one stop', () => {
    expect(pluralizeStops(1)).toBe('1 пересадка')
  })

  it('returns plural form for two and three stops', () => {
    expect(pluralizeStops(2)).toBe('2 пересадки')
    expect(pluralizeStops(3)).toBe('3 пересадки')
  })
})
