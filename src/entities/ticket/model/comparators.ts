import { getTicketStopsCount, getOutboundSegment, getInboundSegment } from '../lib/ticketStops'
import type { SortKey, Ticket } from './types'

export type Comparator = (a: Ticket, b: Ticket) => number
export type ComparatorFactory = (tickets: Ticket[]) => Comparator

const getTotalDuration = (ticket: Ticket) =>
  getOutboundSegment(ticket).duration + getInboundSegment(ticket).duration

export const byPrice: Comparator = (a, b) => a.price - b.price

export const byDuration: Comparator = (a, b) => getTotalDuration(a) - getTotalDuration(b)

export const byOptimal: Comparator = (a, b) =>
  getTotalDuration(a) - getTotalDuration(b) ||
  getTicketStopsCount(a) - getTicketStopsCount(b) ||
  a.price - b.price

const staticFactory =
  (comparator: Comparator): ComparatorFactory =>
  () =>
    comparator

export const SORT_COMPARATOR_FACTORIES: Record<SortKey, ComparatorFactory> = {
  cheapest: staticFactory(byPrice),
  fastest: staticFactory(byDuration),
  optimal: staticFactory(byOptimal),
}
