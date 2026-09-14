import type { SortKey, Ticket } from './types'

export type Comparator = (a: Ticket, b: Ticket) => number

const getTotalDuration = (ticket: Ticket) =>
  ticket.segments[0].duration + ticket.segments[1].duration

export const byPrice: Comparator = (a, b) => a.price - b.price

export const byDuration: Comparator = (a, b) => getTotalDuration(a) - getTotalDuration(b)

export const byOptimal: Comparator = (a, b) => {
  const durationDiff = getTotalDuration(a) - getTotalDuration(b)
  if (durationDiff !== 0) return durationDiff

  const stopsDiff = a.segments[0].stops.length - b.segments[0].stops.length
  if (stopsDiff !== 0) return stopsDiff

  return byPrice(a, b)
}

export const SORT_COMPARATORS: Record<SortKey, Comparator> = {
  cheapest: byPrice,
  fastest: byDuration,
  optimal: byOptimal,
}