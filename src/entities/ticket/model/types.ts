export type AirportCode = string

export type CarrierCode = string

export interface Segment {
  origin: AirportCode
  destination: AirportCode
  date: string
  stops: AirportCode[]
  duration: number
}

export interface Ticket {
  id: string
  price: number
  carrier: CarrierCode
  segments: [Segment, Segment]
}

export interface TicketsResponse {
  tickets: Ticket[]
}

export function isTicketsResponse(data: unknown): data is TicketsResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray((data as { tickets?: unknown }).tickets)
  )
}

export type StopsCount = 0 | 1 | 2 | 3

export const STOPS_OPTIONS: readonly StopsCount[] = [0, 1, 2, 3] as const

export type SortKey = 'cheapest' | 'fastest' | 'optimal'

export const SORT_LABELS: Record<SortKey, string> = {
  cheapest: 'Найдешевший',
  fastest: 'Найшвидший',
  optimal: 'Оптимальний',
}

export const SORT_KEYS = Object.keys(SORT_LABELS) as SortKey[]

export const PAGE_SIZE = 5
