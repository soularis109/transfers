import { createSelector } from '@reduxjs/toolkit'
import { selectAllTickets, SORT_COMPARATOR_FACTORIES } from '../../../entities/ticket/model'
import { getTicketStopsCount } from '../../../entities/ticket/lib'
import { selectSelectedStops } from '../../../features/stops-filter/model'
import { selectActiveSort } from '../../../features/tickets-sort/model'
import { selectVisibleCount } from '../../../features/tickets-pagination/model'

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