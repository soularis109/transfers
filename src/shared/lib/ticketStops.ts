import type { Ticket, StopsCount } from '../../entities/ticket/model/types'

export function getTicketStopsCount(ticket: Ticket): StopsCount {
  const outboundStops = ticket.segments[0].stops.length
  const inboundStops = ticket.segments[1].stops.length

  if (outboundStops !== inboundStops) {
    console.warn(
      `Ticket ${ticket.id}: outbound stops (${outboundStops}) and inbound stops (${inboundStops}) differ; using outbound.`,
    )
  }

  return outboundStops as StopsCount
}