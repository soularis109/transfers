import './SortTabs.scss'

const TABS = [
  { key: 'cheapest', label: 'Найдешевший' },
  { key: 'fastest', label: 'Найшвидший' },
  { key: 'optimal', label: 'Оптимальний' },
] as const

function SortTabs() {
  return (
    <div className="sort-tabs">
      {TABS.map((tab, index) => (
        <button
          key={tab.key}
          type="button"
          className={`sort-tabs__tab${index === 0 ? ' sort-tabs__tab--active' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default SortTabs
