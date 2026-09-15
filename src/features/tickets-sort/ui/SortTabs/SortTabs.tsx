import './SortTabs.scss'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store/hooks'
import { setSort, selectActiveSort } from '../../model'
import { SORT_LABELS, SORT_KEYS } from '@/entities/ticket/model'

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
