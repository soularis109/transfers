import { PAGE_SIZE } from '@/entities/ticket/model'
import type { BoardStatus } from '../../model'
import { assertNever } from '@/shared/lib/assertNever'

interface TicketsBoardStatusProps {
  status: Exclude<BoardStatus, 'list'>
  error: string | null
}

function TicketsBoardStatus({ status, error }: TicketsBoardStatusProps) {
  switch (status) {
    case 'loading':
      return (
        <ul className="tickets-board__list" aria-label="Завантаження…">
          {Array.from({ length: PAGE_SIZE }, (_, index) => (
            <li key={index} className="tickets-board__skeleton" />
          ))}
        </ul>
      )
    case 'failed':
      return <p className="tickets-board__status">Помилка: {error}</p>
    case 'empty':
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