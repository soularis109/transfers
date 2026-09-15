import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { STOPS_OPTIONS, SORT_KEYS } from '@/entities/ticket/model'
import type { SortKey, StopsCount } from '@/entities/ticket/model'
import { setStops, selectSelectedStops } from '@/features/stops-filter/model'
import { setSort, selectActiveSort } from '@/features/tickets-sort/model'

/** Синхронізує фільтр пересадок і сортування з `?stops=1,2&sort=cheapest` у URL. */
export function useUrlFilterSync() {
  const dispatch = useAppDispatch()
  const selectedStops = useAppSelector(selectSelectedStops)
  const activeSort = useAppSelector(selectActiveSort)
  const [searchParams, setSearchParams] = useSearchParams()
  const didApplyUrlState = useRef(false)

  useEffect(() => {
    if (didApplyUrlState.current) return
    didApplyUrlState.current = true

    const stopsParam = searchParams.get('stops')
    if (stopsParam) {
      const stops = stopsParam
        .split(',')
        .map(Number)
        .filter((value): value is StopsCount => STOPS_OPTIONS.includes(value as StopsCount))

      dispatch(setStops(stops))
    }

    const sortParam = searchParams.get('sort')
    if (sortParam && SORT_KEYS.includes(sortParam as SortKey)) {
      dispatch(setSort(sortParam as SortKey))
    }
  }, [dispatch, searchParams])

  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedStops.length > 0) {
      params.set('stops', selectedStops.join(','))
    }
    params.set('sort', activeSort)
    setSearchParams(params, { replace: true })
  }, [selectedStops, activeSort, setSearchParams])
}