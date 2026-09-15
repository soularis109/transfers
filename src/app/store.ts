import { configureStore } from '@reduxjs/toolkit'
import { ticketsReducer } from '@/entities/ticket/model'
import { stopsFilterReducer } from '@/features/stops-filter/model'
import { ticketsSortReducer } from '@/features/tickets-sort/model'
import { ticketsPaginationReducer } from '@/features/tickets-pagination/model'

export const store = configureStore({
  reducer: {
    tickets: ticketsReducer,
    stopsFilter: stopsFilterReducer,
    ticketsSort: ticketsSortReducer,
    ticketsPagination: ticketsPaginationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
