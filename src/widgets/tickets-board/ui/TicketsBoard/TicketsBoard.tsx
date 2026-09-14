import './TicketsBoard.scss'
import { useAppDispatch, useAppSelector } from '../../../../shared/lib/hooks'
import {
  selectVisibleTickets,
  selectFilteredSortedTickets,
  selectTicketsStatus,
  selectTicketsError,
} from '../../../../entities/ticket/model/selectors'
import { selectVisibleCount } from '../../../../features/tickets-pagination/model/selectors'
import { showMore } from '../../../../features/tickets-pagination/model/paginationSlice'
import TicketCard from '../../../../entities/ticket/ui/TicketCard'
import SortTabs from '../../../../features/tickets-sort/ui/SortTabs'
import Button from '../../../../shared/ui/Button'

function TicketsBoard() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectTicketsStatus)
  const error = useAppSelector(selectTicketsError)
  const visibleTickets = useAppSelector(selectVisibleTickets)
  const filteredCount = useAppSelector(selectFilteredSortedTickets).length
  const visibleCount = useAppSelector(selectVisibleCount)

  const hasMore = visibleCount < filteredCount

  return (
    <div className="tickets-board">
      <SortTabs />
      {status === 'loading' || status === 'idle' ? (
        <p className="tickets-board__status">Завантаження…</p>
      ) : status === 'failed' ? (
        <p className="tickets-board__status">Помилка: {error}</p>
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
              Показати ще 5 квитків
            </Button>
          )}
        </>
      )}
    </div>
  )
}

export default TicketsBoard