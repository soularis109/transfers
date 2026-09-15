import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Ticket } from './types'
import { isTicketsResponse } from './types'
import { checkTicketStopsConsistency } from '../lib/ticketStops'

interface TicketsState {
  items: Ticket[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: TicketsState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchTickets = createAsyncThunk<Ticket[]>('tickets/fetchTickets', async () => {
  const res = await fetch(`${import.meta.env.BASE_URL}data/tickets.json`)
  if (!res.ok) throw new Error(`Failed to load tickets: ${res.status}`)
  const data: unknown = await res.json()
  if (!isTicketsResponse(data)) throw new Error('Invalid tickets response shape')
  return data.tickets
})

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        action.payload.forEach(checkTicketStopsConsistency)
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unknown error'
      })
  },
})

export default ticketsSlice.reducer
