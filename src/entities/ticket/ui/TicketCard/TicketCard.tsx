import { memo } from 'react'
import './TicketCard.scss'
import type { Ticket } from '../../model'
import { formatTime } from '../../../../shared/lib/formatTime'
import { formatDuration } from '../../../../shared/lib/formatDuration'
import { pluralizeStops } from '../../../../shared/lib/pluralizeStops'
import { formatPrice } from '../../../../shared/lib/formatPrice'
import { formatStopsList } from '../../../../shared/lib/formatStopsList'
import a4eLogo from '../../../../shared/assets/images/a4e.webp'

interface TicketCardProps {
  ticket: Ticket
}

function TicketCard({ ticket }: TicketCardProps) {
  return (
    <article className="ticket-card">
      <div className="ticket-card__header">
        <span className="ticket-card__price">{formatPrice(ticket.price)}</span>
        <img className="ticket-card__carrier" src={a4eLogo} alt="A4E" />
      </div>
      <div className="ticket-card__segments">
        {ticket.segments.map((segment) => (
          <div className="ticket-card__segment" key={segment.origin + segment.destination}>
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
              <span className="ticket-card__value">{formatStopsList(segment.stops)}</span>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default memo(TicketCard)
