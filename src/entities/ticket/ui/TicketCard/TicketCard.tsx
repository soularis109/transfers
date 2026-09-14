import './TicketCard.scss'
import type { Ticket } from '../../model/types'
import { formatTime } from '../../../../shared/lib/formatTime'
import { formatDuration } from '../../../../shared/lib/formatDuration'
import { pluralizeStops } from '../../../../shared/lib/pluralizeStops'

const priceFormatter = new Intl.NumberFormat('uk-UA')

interface TicketCardProps {
  ticket: Ticket
}

function TicketCard({ ticket }: TicketCardProps) {
  return (
    <article className="ticket-card">
      <div className="ticket-card__header">
        <span className="ticket-card__price">{priceFormatter.format(ticket.price)} $</span>
        <span className="ticket-card__carrier">{ticket.carrier}</span>
      </div>
      <div className="ticket-card__segments">
        {ticket.segments.map((segment, index) => (
          <div className="ticket-card__segment" key={index}>
            <div className="ticket-card__col">
              <span className="ticket-card__label">
                {segment.origin} – {segment.destination}
              </span>
              <span className="ticket-card__value">
                {formatTime(segment.date, segment.duration)}
              </span>
            </div>
            <div className="ticket-card__col">
              <span className="ticket-card__label">В дорозі</span>
              <span className="ticket-card__value">{formatDuration(segment.duration)}</span>
            </div>
            <div className="ticket-card__col">
              <span className="ticket-card__label">{pluralizeStops(segment.stops.length)}</span>
              <span className="ticket-card__value">
                {segment.stops.length > 0 ? segment.stops.join(', ') : '—'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default TicketCard
