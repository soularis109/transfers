import { describe, expect, it } from 'vitest'
import { byPrice, byDuration, byOptimal, SORT_COMPARATORS } from './comparators'
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
    const fast = makeTicket('fast', 100, 60, 60) // total 120
    const slow = makeTicket('slow', 100, 200, 200) // total 400
    expect(byDuration(fast, slow)).toBeLessThan(0)
    expect(byDuration(slow, fast)).toBeGreaterThan(0)
  })
})

describe('byOptimal', () => {
  it('sorts by duration first', () => {
    const fast = makeTicket('fast', 200, 60, 60)
    const slow = makeTicket('slow', 100, 200, 200)
    expect(byOptimal(fast, slow)).toBeLessThan(0)
  })

  it('breaks a duration tie by number of stops', () => {
    const directTicket = makeTicket('direct', 200, 100, 100, 0)
    const oneStopTicket = makeTicket('one-stop', 100, 100, 100, 1)
    expect(byOptimal(directTicket, oneStopTicket)).toBeLessThan(0)
  })

  it('breaks a duration and stops tie by price', () => {
    const cheaper = makeTicket('cheaper', 100, 100, 100, 1)
    const pricier = makeTicket('pricier', 200, 100, 100, 1)
    expect(byOptimal(cheaper, pricier)).toBeLessThan(0)
  })
})

describe('SORT_COMPARATORS', () => {
  it('maps each sort key to the matching comparator', () => {
    expect(SORT_COMPARATORS.cheapest).toBe(byPrice)
    expect(SORT_COMPARATORS.fastest).toBe(byDuration)
    expect(SORT_COMPARATORS.optimal).toBe(byOptimal)
  })
})