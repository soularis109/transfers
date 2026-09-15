import { STOPS_OPTIONS } from '../../../entities/ticket/model'
import type { StopsCount } from '../../../entities/ticket/model'
import { pluralizeStops } from '../../../shared/lib/pluralizeStops'

export const ALL_STOPS_VALUE = 'all' as const

export type StopsRowValue = StopsCount | typeof ALL_STOPS_VALUE

export interface StopsRow {
  value: StopsRowValue
  label: string
}

export const STOPS_ROWS: StopsRow[] = [
  { value: ALL_STOPS_VALUE, label: 'Всі' },
  ...STOPS_OPTIONS.map((option) => ({ value: option, label: pluralizeStops(option) })),
]