import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import ticketsReducer, { fetchTickets } from './ticketsSlice'
import type { Ticket } from './types'

const mockTickets: Ticket[] = [
  {
    id: 'tkt-001',
    price: 12700,
    carrier: 'SN',
    segments: [
      {
        origin: 'LHR',
        destination: 'DXB',
        date: '2026-06-12T14:50:00.000Z',
        stops: ['HEL'],
        duration: 420,
      },
      {
        origin: 'DXB',
        destination: 'LHR',
        date: '2026-06-19T19:50:00.000Z',
        stops: ['CDG'],
        duration: 520,
      },
    ],
  },
]

const initialState = {
  items: [],
  status: 'idle' as const,
  error: null,
}

describe('ticketsSlice', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ tickets: mockTickets }),
        }),
      ),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the initial state', () => {
    expect(ticketsReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('sets status to loading on pending', () => {
    const state = ticketsReducer(initialState, fetchTickets.pending('requestId'))
    expect(state.status).toBe('loading')
    expect(state.error).toBeNull()
  })

  it('sets status to succeeded and fills items on fulfilled', () => {
    const state = ticketsReducer(initialState, fetchTickets.fulfilled(mockTickets, 'requestId'))
    expect(state.status).toBe('succeeded')
    expect(state.items).toEqual(mockTickets)
  })

  it('sets status to failed and fills error on rejected', () => {
    const error = new Error('Failed to load tickets: 500')
    const state = ticketsReducer(initialState, fetchTickets.rejected(error, 'requestId'))
    expect(state.status).toBe('failed')
    expect(state.error).toBe('Failed to load tickets: 500')
  })
})
