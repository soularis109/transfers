import './SortTabs.scss'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { setSort, selectActiveSort } from '../../model'
import type { SortKey } from '../../../../entities/ticket/model'

const TABS: { key: SortKey; label: string }[] = [
  { key: 'cheapest', label: 'Найдешевший' },
  { key: 'fastest', label: 'Найшвидший' },
  { key: 'optimal', label: 'Оптимальний' },
]

function SortTabs() {
  const dispatch = useAppDispatch()
  const activeSort = useAppSelector(selectActiveSort)

  return (
    <div className="sort-tabs">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`sort-tabs__tab${tab.key === activeSort ? ' sort-tabs__tab--active' : ''}`}
          onClick={() => dispatch(setSort(tab.key))}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default SortTabs
