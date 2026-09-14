import './StopsFilterCard.scss'

interface StopsRow {
  key: string
  label: string
  checked: boolean
}

const ROWS: StopsRow[] = [
  { key: 'all', label: 'Всі', checked: false },
  { key: '0', label: 'Без пересадок', checked: false },
  { key: '1', label: '1 пересадка', checked: true },
  { key: '2', label: '2 пересадки', checked: true },
  { key: '3', label: '3 пересадки', checked: false },
]

function StopsFilterCard() {
  return (
    <div className="stops-filter">
      <h2 className="stops-filter__title">Кількість пересадок</h2>
      <ul className="stops-filter__list">
        {ROWS.map((row) => (
          <li key={row.key} className="stops-filter__row">
            <span
              className={`stops-filter__checkbox${
                row.checked ? ' stops-filter__checkbox--checked' : ''
              }`}
            >
              {row.checked && (
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
        ))}
      </ul>
    </div>
  )
}

export default StopsFilterCard
