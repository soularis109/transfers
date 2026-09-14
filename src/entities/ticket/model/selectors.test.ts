import { describe, expect, it } from 'vitest'
import {
  selectFilteredSortedTickets,
  selectVisibleTickets,
} from './selectors'
import type { RootState } from '../../../app/store'
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

const tickets: Ticket[] = [
  makeTicket('direct-expensive', 300, 100, 100, 0),
  makeTicket('one-stop-cheap', 100, 200, 200, 1),
  makeTicket('two-stop-fast', 200, 50, 50, 2),
]

function makeState(
  overrides: Partial<{
    selectedStops: (0 | 1 | 2 | 3)[]
    activeSort: 'cheapest' | 'fastest' | 'optimal'
    visibleCount: number
  }> = {},
): RootState {
  return {
    tickets: { items: tickets, status: 'succeeded', error: null },
    stopsFilter: { selectedStops: overrides.selectedStops ?? [] },
    ticketsSort: { activeSort: overrides.activeSort ?? 'cheapest' },
    ticketsPagination: { visibleCount: overrides.visibleCount ?? 5 },
  } as RootState
}

describe('selectFilteredSortedTickets', () => {
  it('returns all tickets when no stops are selected', () => {
    const result = selectFilteredSortedTickets(makeState({ selectedStops: [] }))
    expect(result).toHaveLength(3)
  })

  it('keeps only tickets matching the selected stops count', () => {
    const result = selectFilteredSortedTickets(makeState({ selectedStops: [1] }))
    expect(result.map((t) => t.id)).toEqual(['one-stop-cheap'])
  })

  it('sorts by price for "cheapest"', () => {
    const result = selectFilteredSortedTickets(makeState({ activeSort: 'cheapest' }))
    expect(result.map((t) => t.id)).toEqual([
      'one-stop-cheap',
      'two-stop-fast',
      'direct-expensive',
    ])
  })

  it('sorts by total duration for "fastest"', () => {
    const result = selectFilteredSortedTickets(makeState({ activeSort: 'fastest' }))
    expect(result.map((t) => t.id)).toEqual([
      'two-stop-fast',
      'direct-expensive',
      'one-stop-cheap',
    ])
  })

  it('sorts by duration, then stops, then price for "optimal"', () => {
    const result = selectFilteredSortedTickets(makeState({ activeSort: 'optimal' }))
    expect(result.map((t) => t.id)).toEqual([
      'two-stop-fast',
      'direct-expensive',
      'one-stop-cheap',
    ])
  })
})

describe('selectVisibleTickets', () => {
  it('slices the filtered/sorted list to visibleCount', () => {
    const result = selectVisibleTickets(makeState({ visibleCount: 2 }))
    expect(result).toHaveLength(2)
  })
})