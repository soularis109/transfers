import './TicketsBoard.scss'
import { useAppSelector } from '../../../../shared/lib/hooks'
import {
  selectAllTickets,
  selectTicketsStatus,
  selectTicketsError,
} from '../../../../entities/ticket/model/selectors'
import { PAGE_SIZE } from '../../../../entities/ticket/model/types'
import TicketCard from '../../../../entities/ticket/ui/TicketCard'
import SortTabs from '../../../../features/tickets-sort/ui/SortTabs'
import Button from '../../../../shared/ui/Button'

function TicketsBoard() {
  const tickets = useAppSelector(selectAllTickets)
  const status = useAppSelector(selectTicketsStatus)
  const error = useAppSelector(selectTicketsError)

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
            {tickets.slice(0, PAGE_SIZE).map((ticket) => (
              <li key={ticket.id}>
                <TicketCard ticket={ticket} />
              </li>
            ))}
          </ul>
          <Button className="tickets-board__more">Показати ще 5 квитків</Button>
        </>
      )}
    </div>
  )
}

export default TicketsBoard
