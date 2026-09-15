import { PAGE_SIZE } from '@/entities/ticket/model'
import { BOARD_STATUS } from '../../model'
import type { BoardStatus } from '../../model'
import { assertNever } from '@/shared/lib/assertNever'

interface TicketsBoardStatusProps {
  status: Exclude<BoardStatus, typeof BOARD_STATUS.LIST>
  error: string | null
}

function TicketsBoardStatus({ status, error }: TicketsBoardStatusProps) {
  switch (status) {
    case BOARD_STATUS.LOADING:
      return (
        <ul className="tickets-board__list" aria-label="Завантаження…">
          {Array.from({ length: PAGE_SIZE }, (_, index) => (
            <li key={index} className="tickets-board__skeleton" />
          ))}
        </ul>
      )
    case BOARD_STATUS.FAILED:
      return <p className="tickets-board__status">Помилка: {error}</p>
    case BOARD_STATUS.EMPTY:
      return (
        <p className="tickets-board__empty">
          За обраними фільтрами квитків не знайдено. Спробуйте зняти частину фільтрів.
        </p>
      )
    default:
      return assertNever(status)
  }
}

export default TicketsBoardStatus