import { useEffect } from 'react'
import './TicketsBoard.scss'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { selectTicketsError } from '../../../../entities/ticket/model'
import {
  selectVisibleTickets,
  selectBoardStatus,
  selectHasMoreTickets,
  selectRemainingTicketsCount,
} from '../../model'
import { selectSelectedStops } from '../../../../features/stops-filter/model'
import { selectActiveSort } from '../../../../features/tickets-sort/model'
import { showMore, resetPagination } from '../../../../features/tickets-pagination/model'
import TicketCard from '../../../../entities/ticket/ui/TicketCard'
import SortTabs from '../../../../features/tickets-sort/ui/SortTabs'
import Button from '../../../../shared/ui/Button'
import TicketsBoardStatus from '../TicketsBoardStatus'

function TicketsBoard() {
  const dispatch = useAppDispatch()
  const error = useAppSelector(selectTicketsError)
  const boardStatus = useAppSelector(selectBoardStatus)
  const visibleTickets = useAppSelector(selectVisibleTickets)
  const hasMore = useAppSelector(selectHasMoreTickets)
  const remainingCount = useAppSelector(selectRemainingTicketsCount)
  const selectedStops = useAppSelector(selectSelectedStops)
  const activeSort = useAppSelector(selectActiveSort)

  useEffect(() => {
    dispatch(resetPagination())
  }, [dispatch, selectedStops, activeSort])

  return (
    <div className="tickets-board">
      <SortTabs />
      {boardStatus === 'list' ? (
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
              Показати ще {remainingCount} квитків
            </Button>
          )}
        </>
      ) : (
        <TicketsBoardStatus status={boardStatus} error={error} />
      )}
    </div>
  )
}

export default TicketsBoard