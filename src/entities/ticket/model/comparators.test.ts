import { describe, expect, it } from 'vitest'
import {
  byPrice,
  byDuration,
  getOptimalBounds,
  getOptimalScore,
  createOptimalComparator,
  SORT_COMPARATOR_FACTORIES,
} from './comparators'
import type { Ticket } from './types'

function makeTicket(
  id: string,
  price: number,
  duration1: number,
  duration2: number,
  stops1 = 0,
): Ticket {
  return {
    id,
    price,
    carrier: 'AB',
    segments: [
      {
        origin: 'AAA',
        destination: 'BBB',
        date: '2026-01-01T00:00:00.000Z',
        stops: Array.from({ length: stops1 }, (_, i) => `S${i}`),
        duration: duration1,
      },
      {
        origin: 'BBB',
        destination: 'AAA',
        date: '2026-01-02T00:00:00.000Z',
        stops: [],
        duration: duration2,
      },
    ],
  }
}

describe('byPrice', () => {
  it('sorts ascending by price', () => {
    const cheap = makeTicket('cheap', 100, 60, 60)
    const expensive = makeTicket('expensive', 200, 60, 60)
    expect(byPrice(cheap, expensive)).toBeLessThan(0)
    expect(byPrice(expensive, cheap)).toBeGreaterThan(0)
    expect(byPrice(cheap, cheap)).toBe(0)
  })
})

describe('byDuration', () => {
  it('sorts ascending by total duration across both segments', () => {
    const fast = makeTicket('fast', 100, 60, 60)
    const slow = makeTicket('slow', 100, 200, 200)
    expect(byDuration(fast, slow)).toBeLessThan(0)
    expect(byDuration(slow, fast)).toBeGreaterThan(0)
  })
})

describe('getOptimalBounds', () => {
  it('computes min/max price and duration across the tickets', () => {
    const tickets = [
      makeTicket('direct-expensive', 300, 100, 100),
      makeTicket('one-stop-cheap', 100, 200, 200),
      makeTicket('two-stop-fast', 200, 50, 50),
    ]
    expect(getOptimalBounds(tickets)).toEqual({
      minPrice: 100,
      maxPrice: 300,
      minDuration: 100,
      maxDuration: 400,
    })
  })

  it('does not throw on an empty array', () => {
    expect(() => getOptimalBounds([])).not.toThrow()
  })
})

describe('getOptimalScore', () => {
  const directExpensive = makeTicket('direct-expensive', 300, 100, 100)
  const oneStopCheap = makeTicket('one-stop-cheap', 100, 200, 200)
  const twoStopFast = makeTicket('two-stop-fast', 200, 50, 50)
  const bounds = getOptimalBounds([directExpensive, oneStopCheap, twoStopFast])

  it('weighs normalized price and duration equally', () => {
    expect(getOptimalScore(twoStopFast, bounds)).toBeCloseTo(0.25)
    expect(getOptimalScore(oneStopCheap, bounds)).toBeCloseTo(0.5)
    expect(getOptimalScore(directExpensive, bounds)).toBeCloseTo(0.6667)
  })

  it('falls back to 0 for price when every ticket has the same price (no NaN)', () => {
    const a = makeTicket('a', 150, 100, 100)
    const b = makeTicket('b', 150, 200, 200)
    const sameBounds = getOptimalBounds([a, b])
    expect(getOptimalScore(a, sameBounds)).not.toBeNaN()
    expect(getOptimalScore(a, sameBounds)).toBeLessThan(getOptimalScore(b, sameBounds))
  })

  it('falls back to 0 for duration when every ticket has the same duration (no NaN)', () => {
    const a = makeTicket('a', 100, 100, 100)
    const b = makeTicket('b', 200, 100, 100)
    const sameBounds = getOptimalBounds([a, b])
    expect(getOptimalScore(a, sameBounds)).not.toBeNaN()
    expect(getOptimalScore(a, sameBounds)).toBeLessThan(getOptimalScore(b, sameBounds))
  })
})

describe('createOptimalComparator', () => {
  it('sorts tickets by ascending weighted price/duration score', () => {
    const directExpensive = makeTicket('direct-expensive', 300, 100, 100)
    const oneStopCheap = makeTicket('one-stop-cheap', 100, 200, 200)
    const twoStopFast = makeTicket('two-stop-fast', 200, 50, 50)
    const tickets = [directExpensive, oneStopCheap, twoStopFast]

    const sorted = [...tickets].sort(createOptimalComparator(tickets))

    expect(sorted.map((t) => t.id)).toEqual(['two-stop-fast', 'one-stop-cheap', 'direct-expensive'])
  })
})

describe('SORT_COMPARATOR_FACTORIES', () => {
  it('cheapest factory behaves like byPrice regardless of the tickets argument', () => {
    const cheap = makeTicket('cheap', 100, 60, 60)
    const expensive = makeTicket('expensive', 200, 60, 60)
    expect(SORT_COMPARATOR_FACTORIES.cheapest([])(cheap, expensive)).toBe(byPrice(cheap, expensive))
  })

  it('fastest factory behaves like byDuration regardless of the tickets argument', () => {
    const fast = makeTicket('fast', 100, 60, 60)
    const slow = makeTicket('slow', 100, 200, 200)
    expect(SORT_COMPARATOR_FACTORIES.fastest([])(fast, slow)).toBe(byDuration(fast, slow))
  })

  it('optimal factory is createOptimalComparator', () => {
    expect(SORT_COMPARATOR_FACTORIES.optimal).toBe(createOptimalComparator)
  })
})
