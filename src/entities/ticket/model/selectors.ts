import type { RootState } from '../../../app/store'

export const selectAllTickets = (state: RootState) => state.tickets.items
export const selectTicketsStatus = (state: RootState) => state.tickets.status
export const selectTicketsError = (state: RootState) => state.tickets.error