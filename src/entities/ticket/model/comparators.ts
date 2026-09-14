import type { SortKey, Ticket } from './types'

export type Comparator = (a: Ticket, b: Ticket) => number
export type ComparatorFactory = (tickets: Ticket[]) => Comparator

const getTotalDuration = (ticket: Ticket) =>
  ticket.segments[0].duration + ticket.segments[1].duration

export const byPrice: Comparator = (a, b) => a.price - b.price

export const byDuration: Comparator = (a, b) => getTotalDuration(a) - getTotalDuration(b)

const OPTIMAL_PRICE_WEIGHT = 0.5
const OPTIMAL_DURATION_WEIGHT = 0.5

interface OptimalBounds {
  minPrice: number
  maxPrice: number
  minDuration: number
  maxDuration: number
}

export const getOptimalBounds = (tickets: Ticket[]): OptimalBounds => {
  const prices = tickets.map((ticket) => ticket.price)
  const durations = tickets.map(getTotalDuration)
  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    minDuration: Math.min(...durations),
    maxDuration: Math.max(...durations),
  }
}

const normalize = (value: number, min: number, max: number) =>
  max === min ? 0 : (value - min) / (max - min)

export const getOptimalScore = (ticket: Ticket, bounds: OptimalBounds): number =>
  OPTIMAL_PRICE_WEIGHT * normalize(ticket.price, bounds.minPrice, bounds.maxPrice) +
  OPTIMAL_DURATION_WEIGHT *
    normalize(getTotalDuration(ticket), bounds.minDuration, bounds.maxDuration)

export const createOptimalComparator: ComparatorFactory = (tickets) => {
  const bounds = getOptimalBounds(tickets)
  return (a, b) => getOptimalScore(a, bounds) - getOptimalScore(b, bounds)
}

const staticFactory =
  (comparator: Comparator): ComparatorFactory =>
  () =>
    comparator

export const SORT_COMPARATOR_FACTORIES: Record<SortKey, ComparatorFactory> = {
  cheapest: staticFactory(byPrice),
  fastest: staticFactory(byDuration),
  optimal: createOptimalComparator,
}
