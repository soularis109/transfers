import './SortTabs.scss'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { setSort, selectActiveSort } from '../../model'
import { SORT_LABELS } from '../../../../entities/ticket/model'
import type { SortKey } from '../../../../entities/ticket/model'

const SORT_KEYS = Object.keys(SORT_LABELS) as SortKey[]

function SortTabs() {
  const dispatch = useAppDispatch()
  const activeSort = useAppSelector(selectActiveSort)

  return (
    <div className="sort-tabs">
      {SORT_KEYS.map((key) => (
        <button
          key={key}
          type="button"
          className={`sort-tabs__tab${key === activeSort ? ' sort-tabs__tab--active' : ''}`}
          onClick={() => dispatch(setSort(key))}
        >
          {SORT_LABELS[key]}
        </button>
      ))}
    </div>
  )
}

export default SortTabs
