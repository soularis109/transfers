import type { ElementType, KeyboardEvent, ReactNode } from 'react'

interface CheckboxClassNames {
  root?: string
  box: string
  boxChecked: string
  icon: string
  label: string
}

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode
  classNames: CheckboxClassNames
  as?: ElementType
}

function Checkbox({ checked, onChange, label, classNames, as: Component = 'div' }: CheckboxProps) {
  const handleToggle = () => {
    onChange(!checked)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleToggle()
    }
  }

  return (
    <Component
      className={classNames.root}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
    >
      <span className={`${classNames.box}${checked ? ` ${classNames.boxChecked}` : ''}`}>
        {checked && (
          <svg className={classNames.icon} viewBox="0 0 12 10" aria-hidden="true">
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
      <span className={classNames.label}>{label}</span>
    </Component>
  )
}

export default Checkbox
export type { CheckboxProps, CheckboxClassNames }
