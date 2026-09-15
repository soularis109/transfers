import type { Ticket, StopsCount } from '../model/types'

function toStopsCount(count: number): StopsCount {
  if (count === 0 || count === 1 || count === 2 || count === 3) return count
  throw new Error(`Unexpected stops count: ${count}`)
}

export function getTicketStopsCount(ticket: Ticket): StopsCount {
  return toStopsCount(ticket.segments[0].stops.length)
}

export function checkTicketStopsConsistency(ticket: Ticket): void {
  const outboundStops = ticket.segments[0].stops.length
  const inboundStops = ticket.segments[1].stops.length

  if (outboundStops !== inboundStops) {
    console.warn(
      `Ticket ${ticket.id}: outbound stops (${outboundStops}) and inbound stops (${inboundStops}) differ; using outbound.`,
    )
  }
}