/**
 * src/entities/ticket/model/types.ts
 *
 * Модель даних. Формат свідомо близький до реальних авіа-API:
 * duration у хвилинах, date в ISO, час прильоту обчислюється як date + duration.
 */

/** IATA-код аеропорту, напр. "LHR", "DXB", "IST". */
export type AirportCode = string

/** IATA-код перевізника, напр. "BA", "EK", "QR". */
export type CarrierCode = string

export interface Segment {
  /** Аеропорт вильоту. */
  origin: AirportCode
  /** Аеропорт призначення. */
  destination: AirportCode
  /** Дата й час вильоту, ISO 8601. */
  date: string
  /** Аеропорти пересадок по порядку. Порожній масив = прямий рейс. */
  stops: AirportCode[]
  /** Загальний час у дорозі, ХВИЛИНИ. */
  duration: number
}

export interface Ticket {
  /**
   * Доданий нами ідентифікатор. В оригінальному форматі API його немає,
   * але без нього доводиться робити key за індексом — а індекс міняється
   * при сортуванні й ламає узгодження стану React.
   */
  id: string
  /** Ціна за квиток у доларах, ціле число. */
  price: number
  carrier: CarrierCode
  /** Рівно два сегменти: [туди, назад]. */
  segments: [Segment, Segment]
}

export interface TicketsResponse {
  tickets: Ticket[]
}

/**
 * Кількість пересадок. У межах квитка вона однакова в обидва боки —
 * це гарантія з ТЗ, на неї спирається фільтр.
 */
export type StopsCount = 0 | 1 | 2 | 3

export const STOPS_OPTIONS: StopsCount[] = [0, 1, 2, 3]

export type SortKey = 'cheapest' | 'fastest' | 'optimal'

export const SORT_LABELS: Record<SortKey, string> = {
  cheapest: 'Найдешевший',
  fastest: 'Найшвидший',
  optimal: 'Оптимальний',
}

export const SORT_KEYS = Object.keys(SORT_LABELS) as SortKey[]

export const PAGE_SIZE = 5
