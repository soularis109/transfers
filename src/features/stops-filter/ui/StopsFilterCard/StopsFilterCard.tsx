import type { KeyboardEvent } from 'react'
import './StopsFilterCard.scss'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import {
  toggleStop,
  selectAll,
  clearAll,
  selectSelectedStops,
  selectIsAllStopsSelected,
  ALL_STOPS_VALUE,
  STOPS_ROWS,
} from '../../model'
import type { StopsRowValue } from '../../model'

function StopsFilterCard() {
  const dispatch = useAppDispatch()
  const selectedStops = useAppSelector(selectSelectedStops)
  const isAllSelected = useAppSelector(selectIsAllStopsSelected)

  const isChecked = (value: StopsRowValue) =>
    value === ALL_STOPS_VALUE ? isAllSelected : selectedStops.includes(value)

  const handleToggle = (value: StopsRowValue) => {
    if (value === ALL_STOPS_VALUE) {
      dispatch(isAllSelected ? clearAll() : selectAll())
    } else {
      dispatch(toggleStop(value))
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>, value: StopsRowValue) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleToggle(value)
    }
  }

  return (
    <div className="stops-filter">
      <h2 className="stops-filter__title">Кількість пересадок</h2>
      <ul className="stops-filter__list">
        {STOPS_ROWS.map((row) => {
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