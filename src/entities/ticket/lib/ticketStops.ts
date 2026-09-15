import type { Ticket, StopsCount } from '../model/types'

export function getTicketStopsCount(ticket: Ticket): StopsCount {
  return ticket.segments[0].stops.length as StopsCount
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