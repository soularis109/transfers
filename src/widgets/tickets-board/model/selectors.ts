import { createSelector } from '@reduxjs/toolkit'
import {
  selectAllTickets,
  selectTicketsStatus,
  SORT_COMPARATOR_FACTORIES,
  PAGE_SIZE,
} from '@/entities/ticket/model'
import type { TicketsStatus } from '@/entities/ticket/model'
import { getTicketStopsCount } from '@/entities/ticket/lib'
import { selectSelectedStops } from '@/features/stops-filter/model'
import { selectActiveSort } from '@/features/tickets-sort/model'
import { selectVisibleCount } from '@/features/tickets-pagination/model'
import { assertNever } from '@/shared/lib/assertNever'

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

export const selectHasMoreTickets = createSelector(
  [selectFilteredTicketsCount, selectVisibleCount],
  (filteredCount, visibleCount) => visibleCount < filteredCount,
)

export const selectRemainingTicketsCount = createSelector(
  [selectFilteredTicketsCount, selectVisibleCount],
  (filteredCount, visibleCount) => Math.min(PAGE_SIZE, filteredCount - visibleCount),
)

export const BOARD_STATUSES = ['loading', 'failed', 'empty', 'list'] as const
export type BoardStatus = (typeof BOARD_STATUSES)[number]

export const selectBoardStatus = createSelector(
  [selectTicketsStatus, selectFilteredTicketsCount],
  (ticketsStatus: TicketsStatus, filteredCount): BoardStatus => {
    switch (ticketsStatus) {
      case 'idle':
      case 'loading':
        return 'loading'
      case 'failed':
        return 'failed'
      case 'succeeded':
        return filteredCount === 0 ? 'empty' : 'list'
      default:
        return assertNever(ticketsStatus)
    }
  },
)