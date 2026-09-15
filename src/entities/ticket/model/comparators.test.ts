import { describe, expect, it } from 'vitest'
import { byPrice, byDuration, byOptimal, SORT_COMPARATOR_FACTORIES } from './comparators'
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
        stops: Array.from({ length: stops1 }, (_, i) => `S${i}`),
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

describe('byOptimal', () => {
  it('prioritizes shorter total duration first, regardless of price', () => {
    const slowCheap = makeTicket('slow-cheap', 100, 200, 200)
    const fastExpensive = makeTicket('fast-expensive', 900, 50, 50)
    expect(byOptimal(fastExpensive, slowCheap)).toBeLessThan(0)
    expect(byOptimal(slowCheap, fastExpensive)).toBeGreaterThan(0)
  })

  it('breaks a duration tie by fewer stops', () => {
    const oneStop = makeTicket('one-stop', 900, 100, 100, 1)
    const twoStops = makeTicket('two-stops', 100, 100, 100, 2)
    expect(byOptimal(oneStop, twoStops)).toBeLessThan(0)
    expect(byOptimal(twoStops, oneStop)).toBeGreaterThan(0)
  })

  it('breaks a duration and stops tie by lower price', () => {
    const cheap = makeTicket('cheap', 100, 100, 100, 1)
    const expensive = makeTicket('expensive', 200, 100, 100, 1)
    expect(byOptimal(cheap, expensive)).toBeLessThan(0)
    expect(byOptimal(expensive, cheap)).toBeGreaterThan(0)
  })

  it('sorts a mixed list by duration, then stops, then price', () => {
    const directExpensive = makeTicket('direct-expensive', 300, 100, 100, 0)
    const oneStopCheap = makeTicket('one-stop-cheap', 100, 200, 200, 1)
    const twoStopFast = makeTicket('two-stop-fast', 200, 50, 50, 2)
    const tickets = [directExpensive, oneStopCheap, twoStopFast]

    const sorted = [...tickets].sort(byOptimal)

    expect(sorted.map((t) => t.id)).toEqual(['two-stop-fast', 'direct-expensive', 'one-stop-cheap'])
  })
})

describe('SORT_COMPARATOR_FACTORIES', () => {
  it.each([
    ['cheapest', byPrice],
    ['fastest', byDuration],
    ['optimal', byOptimal],
  ] as const)(
    '%s factory behaves like the underlying comparator regardless of the tickets argument',
    (key, comparator) => {
      const a = makeTicket('a', 100, 60, 60, 0)
      const b = makeTicket('b', 900, 200, 200, 1)
      expect(SORT_COMPARATOR_FACTORIES[key]([])(a, b)).toBe(comparator(a, b))
    },
  )
})
