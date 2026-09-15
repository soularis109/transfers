import { STOPS_OPTIONS } from '../model/types'
import type { Ticket, Segment, StopsCount } from '../model/types'

export function getOutboundSegment(ticket: Ticket): Segment {
  return ticket.segments[0]
}

export function getInboundSegment(ticket: Ticket): Segment {
  return ticket.segments[1]
}

function toStopsCount(count: number): StopsCount {
  if (STOPS_OPTIONS.includes(count as StopsCount)) return count as StopsCount
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