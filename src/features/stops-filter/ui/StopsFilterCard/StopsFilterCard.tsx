import type { KeyboardEvent } from 'react'
import './StopsFilterCard.scss'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import {
  toggleStop,
  selectAll,
  clearAll,
  selectSelectedStops,
  selectIsAllStopsSelected,
} from '../../model'
import { STOPS_OPTIONS } from '../../../../entities/ticket/model'
import type { StopsCount } from '../../../../entities/ticket/model'

type RowValue = StopsCount | 'all'

interface StopsRow {
  value: RowValue
  label: string
}

const STOPS_LABELS: Record<StopsCount, string> = {
  0: 'Без пересадок',
  1: '1 пересадка',
  2: '2 пересадки',
  3: '3 пересадки',
}

const ROWS: StopsRow[] = [
  { value: 'all', label: 'Всі' },
  ...STOPS_OPTIONS.map((option) => ({ value: option, label: STOPS_LABELS[option] })),
]

function StopsFilterCard() {
  const dispatch = useAppDispatch()
  const selectedStops = useAppSelector(selectSelectedStops)
  const isAllSelected = useAppSelector(selectIsAllStopsSelected)

  const isChecked = (value: RowValue) =>
    value === 'all' ? isAllSelected : selectedStops.includes(value)

  const handleToggle = (value: RowValue) => {
    if (value === 'all') {
      dispatch(isAllSelected ? clearAll() : selectAll())
    } else {
      dispatch(toggleStop(value))
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>, value: RowValue) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleToggle(value)
    }
  }

  return (
    <div className="stops-filter">
      <h2 className="stops-filter__title">Кількість пересадок</h2>
      <ul className="stops-filter__list">
        {ROWS.map((row) => {
          const checked = isChecked(row.value)
          return (
            <li
              key={row.value}
              className="stops-filter__row"
              role="checkbox"
              aria-checked={checked}
              tabIndex={0}
              onClick={() => handleToggle(row.value)}
              onKeyDown={(event) => handleKeyDown(event, row.value)}
            >
              <span
                className={`stops-filter__checkbox${
                  checked ? ' stops-filter__checkbox--checked' : ''
                }`}
              >
                {checked && (
                  <svg className="stops-filter__check-icon" viewBox="0 0 12 10" aria-hidden="true">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M1 5l3.5 3.5L11 1"
                    />
                  </svg>
                )}
              </span>
              <span className="stops-filter__label">{row.label}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default StopsFilterCard
