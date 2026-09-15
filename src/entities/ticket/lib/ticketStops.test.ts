import { describe, expect, it, vi } from 'vitest'
import { getTicketStopsCount, checkTicketStopsConsistency } from './ticketStops'
import type { Ticket } from '../model/types'

function makeTicket(outboundStops: number, inboundStops: number): Ticket {
  return {
    id: 't1',
    price: 100,
    carrier: 'AB',
    segments: [
      {
        origin: 'AAA',
        destination: 'BBB',
        date: '2026-01-01T00:00:00.000Z',
        stops: Array.from({ length: outboundStops }, (_, i) => `S${i}`),
        duration: 100,
      },
      {
        origin: 'BBB',
        destination: 'AAA',
        date: '2026-01-02T00:00:00.000Z',
        stops: Array.from({ length: inboundStops }, (_, i) => `S${i}`),
        duration: 100,
      },
    ],
  }
}

describe('getTicketStopsCount', () => {
  it('returns the outbound stops count', () => {
    expect(getTicketStopsCount(makeTicket(2, 2))).toBe(2)
  })
})

describe('checkTicketStopsConsistency', () => {
  it('warns when outbound and inbound stops differ', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    checkTicketStopsConsistency(makeTicket(1, 2))

    expect(warnSpy).toHaveBeenCalledTimes(1)
    warnSpy.mockRestore()
  })

  it('does not warn when outbound and inbound stops match', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    checkTicketStopsConsistency(makeTicket(1, 1))

    expect(warnSpy).not.toHaveBeenCalled()
    warnSpy.mockRestore()
  })
})