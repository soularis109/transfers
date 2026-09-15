import './StopsFilterCard.scss'
import Checkbox from '@/shared/ui/Checkbox'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store/hooks'
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

const CHECKBOX_CLASS_NAMES = {
  root: 'stops-filter__row',
  box: 'stops-filter__checkbox',
  boxChecked: 'stops-filter__checkbox--checked',
  icon: 'stops-filter__check-icon',
  label: 'stops-filter__label',
}

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

  return (
    <div className="stops-filter">
      <h2 className="stops-filter__title">Кількість пересадок</h2>
      <ul className="stops-filter__list">
        {STOPS_ROWS.map((row) => (
          <Checkbox
            key={row.value}
            as="li"
            checked={isChecked(row.value)}
            onChange={() => handleToggle(row.value)}
            label={row.label}
            classNames={CHECKBOX_CLASS_NAMES}
          />
        ))}
      </ul>
    </div>
  )
}

export default StopsFilterCard