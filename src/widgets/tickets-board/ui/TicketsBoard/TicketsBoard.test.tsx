import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import TicketsBoard from './TicketsBoard'
import { ticketsReducer } from '@/entities/ticket/model'
import { stopsFilterReducer, toggleStop } from '@/features/stops-filter/model'
import { ticketsSortReducer } from '@/features/tickets-sort/model'
import { ticketsPaginationReducer } from '@/features/tickets-pagination/model'
import type { Ticket } from '@/entities/ticket/model'

function makeTicket(id: string, price: number): Ticket {
  return {
    id,
    price,
    carrier: 'AB',
    segments: [
      {
        origin: 'AAA',
        destination: 'BBB',
        date: '2026-01-01T00:00:00.000Z',
        stops: [],
        duration: 100,
      },
      {
        origin: 'BBB',
        destination: 'AAA',
        date: '2026-01-02T00:00:00.000Z',
        stops: [],
        duration: 100,
      },
    ],
  }
}

const tickets = Array.from({ length: 7 }, (_, i) => makeTicket(`t${i}`, 100 + i))

function renderWithStore() {
  const store = configureStore({
    reducer: {
      tickets: ticketsReducer,
      stopsFilter: stopsFilterReducer,
      ticketsSort: ticketsSortReducer,
      ticketsPagination: ticketsPaginationReducer,
    },
    preloadedState: {
      tickets: { items: tickets, status: 'succeeded' as const, error: null },
      stopsFilter: { selectedStops: [] },
      ticketsSort: { activeSort: 'cheapest' as const },
      ticketsPagination: { visibleCount: 5 },
    },
  })

  render(
    <Provider store={store}>
      <TicketsBoard />
    </Provider>,
  )

  return store
}

describe('TicketsBoard', () => {
  afterEach(() => {
    cleanup()
  })

  it('shows the first page of tickets and a "show more" button', () => {
    renderWithStore()

    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    expect(screen.getByRole('button', { name: /Показати ще 2 квитків/ })).toBeInTheDocument()
  })

  it('reveals the rest of the tickets on "show more" click', async () => {
    const user = userEvent.setup()
    renderWithStore()

    await user.click(screen.getByRole('button', { name: /Показати ще/ }))

    expect(screen.getAllByRole('listitem')).toHaveLength(7)
    expect(screen.queryByRole('button', { name: /Показати ще/ })).not.toBeInTheDocument()
  })

  it('resets pagination when the sort changes', async () => {
    const user = userEvent.setup()
    renderWithStore()

    await user.click(screen.getByRole('button', { name: /Показати ще/ }))
    expect(screen.getAllByRole('listitem')).toHaveLength(7)

    await user.click(screen.getByRole('button', { name: 'Найшвидший' }))

    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })

  it('resets pagination when the stops filter changes', async () => {
    const user = userEvent.setup()
    const store = renderWithStore()

    await user.click(screen.getByRole('button', { name: /Показати ще/ }))
    expect(screen.getAllByRole('listitem')).toHaveLength(7)

    store.dispatch(toggleStop(0))

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(5))
  })
})
