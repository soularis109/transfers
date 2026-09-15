import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Ticket } from './types'
import { isTicketsResponse } from './types'
import { checkTicketStopsConsistency } from '../lib/ticketStops'
import type { RootState } from '@/app/store'

export const TICKETS_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
} as const

export type TicketsStatus = (typeof TICKETS_STATUS)[keyof typeof TICKETS_STATUS]

interface TicketsState {
  items: Ticket[]
  status: TicketsStatus
  error: string | null
}

const initialState: TicketsState = {
  items: [],
  status: TICKETS_STATUS.IDLE,
  error: null,
}

export const fetchTickets = createAsyncThunk<Ticket[], void, { state: RootState }>(
  'tickets/fetchTickets',
  async () => {
    const res = await fetch(`${import.meta.env.BASE_URL}data/tickets.json`)
    if (!res.ok) throw new Error(`Failed to load tickets: ${res.status}`)
    const data: unknown = await res.json()
    if (!isTicketsResponse(data)) throw new Error('Invalid tickets response shape')
    return data.tickets
  },
  {
    condition: (_, { getState }) => getState().tickets.status === TICKETS_STATUS.IDLE,
  },
)

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.status = TICKETS_STATUS.LOADING
        state.error = null
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = TICKETS_STATUS.SUCCEEDED
        state.items = action.payload
        action.payload.forEach(checkTicketStopsConsistency)
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = TICKETS_STATUS.FAILED
        state.error = action.error.message ?? 'Unknown error'
      })
  },
})

export default ticketsSlice.reducer
