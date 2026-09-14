import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../../app/store'
import { SORT_COMPARATOR_FACTORIES } from './comparators'
import { getTicketStopsCount } from '../../../shared/lib/ticketStops'
import { selectSelectedStops } from '../../../features/stops-filter/model'
import { selectActiveSort } from '../../../features/tickets-sort/model'
import { selectVisibleCount } from '../../../features/tickets-pagination/model'

export const selectAllTickets = (state: RootState) => state.tickets.items
export const selectTicketsStatus = (state: RootState) => state.tickets.status
export const selectTicketsError = (state: RootState) => state.tickets.error

export const selectFilteredSortedTickets = createSelector(
  [selectAllTickets, selectSelectedStops, selectActiveSort],
  (tickets, selectedStops, activeSort) => {
    const filtered =
      selectedStops.length === 0
        ? tickets
        : tickets.filter((ticket) => selectedStops.includes(getTicketStopsCount(ticket)))

    const comparator = SORT_COMPARATOR_FACTORIES[activeSort](filtered)
    return filtered.slice().sort(comparator)
  },
)

export const selectFilteredTicketsCount = createSelector(
  [selectFilteredSortedTickets],
  (tickets) => tickets.length,
)

export const selectVisibleTickets = createSelector(
  [selectFilteredSortedTickets, selectVisibleCount],
  (tickets, visibleCount) => tickets.slice(0, visibleCount),
)
