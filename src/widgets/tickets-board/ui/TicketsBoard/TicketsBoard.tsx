import { useEffect } from 'react'
import './TicketsBoard.scss'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import {
  selectTicketsStatus,
  selectTicketsError,
  PAGE_SIZE,
} from '../../../../entities/ticket/model'
import { selectVisibleTickets, selectFilteredTicketsCount } from '../../model'
import { selectSelectedStops } from '../../../../features/stops-filter/model'
import { selectActiveSort } from '../../../../features/tickets-sort/model'
import {
  selectVisibleCount,
  showMore,
  resetPagination,
} from '../../../../features/tickets-pagination/model'
import TicketCard from '../../../../entities/ticket/ui/TicketCard'
import SortTabs from '../../../../features/tickets-sort/ui/SortTabs'
import Button from '../../../../shared/ui/Button'

function TicketsBoard() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectTicketsStatus)
  const error = useAppSelector(selectTicketsError)
  const visibleTickets = useAppSelector(selectVisibleTickets)
  const filteredCount = useAppSelector(selectFilteredTicketsCount)
  const visibleCount = useAppSelector(selectVisibleCount)
  const selectedStops = useAppSelector(selectSelectedStops)
  const activeSort = useAppSelector(selectActiveSort)

  const hasMore = visibleCount < filteredCount

  useEffect(() => {
    dispatch(resetPagination())
  }, [dispatch, selectedStops, activeSort])

  return (
    <div className="tickets-board">
      <SortTabs />
      {status === 'loading' || status === 'idle' ? (
        <ul className="tickets-board__list" aria-label="Завантаження…">
          {Array.from({ length: PAGE_SIZE }, (_, index) => (
            <li key={index} className="tickets-board__skeleton" />
          ))}
        </ul>
      ) : status === 'failed' ? (
        <p className="tickets-board__status">Помилка: {error}</p>
      ) : filteredCount === 0 ? (
        <p className="tickets-board__empty">
          За обраними фільтрами квитків не знайдено. Спробуйте зняти частину фільтрів.
        </p>
      ) : (
        <>
          <ul className="tickets-board__list">
            {visibleTickets.map((ticket) => (
              <li key={ticket.id}>
                <TicketCard ticket={ticket} />
              </li>
            ))}
          </ul>
          {hasMore && (
            <Button className="tickets-board__more" onClick={() => dispatch(showMore())}>
              Показати ще {Math.min(PAGE_SIZE, filteredCount - visibleCount)} квитків
            </Button>
          )}
        </>
      )}
    </div>
  )
}

export default TicketsBoard
