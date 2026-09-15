import type { Ticket, Segment, StopsCount } from '../model/types'

export function getOutboundSegment(ticket: Ticket): Segment {
  return ticket.segments[0]
}

export function getInboundSegment(ticket: Ticket): Segment {
  return ticket.segments[1]
}

function toStopsCount(count: number): StopsCount {
  if (count === 0 || count === 1 || count === 2 || count === 3) return count
  throw new Error(`Unexpected stops count: ${count}`)
}

export function getTicketStopsCount(ticket: Ticket): StopsCount {
  return toStopsCount(getOutboundSegment(ticket).stops.length)
}

export function checkTicketStopsConsistency(ticket: Ticket): void {
  const outboundStops = getOutboundSegment(ticket).stops.length
  const inboundStops = getInboundSegment(ticket).stops.length

  if (outboundStops !== inboundStops) {
    console.warn(
      `Ticket ${ticket.id}: outbound stops (${outboundStops}) and inbound stops (${inboundStops}) differ; using outbound.`,
    )
  }
}