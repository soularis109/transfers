import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../../app/store'
import { SORT_COMPARATORS } from './comparators'
import { getTicketStopsCount } from '../../../shared/lib/ticketStops'
import { selectSelectedStops } from '../../../features/stops-filter/model/selectors'
import { selectActiveSort } from '../../../features/tickets-sort/model/selectors'
import { selectVisibleCount } from '../../../features/tickets-pagination/model/selectors'

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

    return filtered.slice().sort(SORT_COMPARATORS[activeSort])
  },
)

export const selectVisibleTickets = createSelector(
  [selectFilteredSortedTickets, selectVisibleCount],
  (tickets, visibleCount) => tickets.slice(0, visibleCount),
)