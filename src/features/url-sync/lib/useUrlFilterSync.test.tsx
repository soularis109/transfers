import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useUrlFilterSync } from './useUrlFilterSync'
import { stopsFilterReducer, toggleStop } from '@/features/stops-filter/model'
import { ticketsSortReducer, setSort } from '@/features/tickets-sort/model'

function SyncProbe() {
  useUrlFilterSync()
  const location = useLocation()
  return <span data-testid="search">{location.search}</span>
}

function renderWithStore(initialEntry: string) {
  const store = configureStore({
    reducer: {
      stopsFilter: stopsFilterReducer,
      ticketsSort: ticketsSortReducer,
    },
    preloadedState: {
      stopsFilter: { selectedStops: [] },
      ticketsSort: { activeSort: 'cheapest' as const },
    },
  })

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/" element={<SyncProbe />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

  return store
}

describe('useUrlFilterSync', () => {
  afterEach(() => {
    cleanup()
  })

  it('hydrates the store from stops/sort URL params on mount', async () => {
    const store = renderWithStore('/?stops=1,2&sort=fastest')

    await waitFor(() => {
      expect(store.getState().stopsFilter.selectedStops).toEqual([1, 2])
      expect(store.getState().ticketsSort.activeSort).toBe('fastest')
    })
  })

  it('deduplicates repeated stops values from the URL', async () => {
    const store = renderWithStore('/?stops=1,1,2&sort=cheapest')

    await waitFor(() => {
      expect(store.getState().stopsFilter.selectedStops).toEqual([1, 2])
    })
  })

  it('ignores invalid stops/sort values from the URL', async () => {
    const store = renderWithStore('/?stops=9,-1&sort=nonsense')

    await waitFor(() => {
      expect(screen.getByTestId('search')).toHaveTextContent('sort=cheapest')
    })
    expect(store.getState().stopsFilter.selectedStops).toEqual([])
    expect(store.getState().ticketsSort.activeSort).toBe('cheapest')
  })

  it('writes filter/sort changes back to the URL', async () => {
    const store = renderWithStore('/')

    store.dispatch(toggleStop(0))
    store.dispatch(setSort('optimal'))

    await waitFor(() => {
      expect(screen.getByTestId('search')).toHaveTextContent('stops=0')
      expect(screen.getByTestId('search')).toHaveTextContent('sort=optimal')
    })
  })
})