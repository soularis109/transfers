import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Checkbox from './Checkbox'

const classNames = {
  root: 'test__row',
  box: 'test__checkbox',
  boxChecked: 'test__checkbox--checked',
  icon: 'test__check-icon',
  label: 'test__label',
}

describe('Checkbox', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders the check icon when checked', () => {
    render(<Checkbox checked onChange={vi.fn()} label="Label" classNames={classNames} />)

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('does not render the check icon when unchecked', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} label="Label" classNames={classNames} />)

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false')
    expect(document.querySelector('svg')).not.toBeInTheDocument()
  })

  it('calls onChange with the opposite value on click', async () => {
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} label="Label" classNames={classNames} />)

    await userEvent.click(screen.getByRole('checkbox'))

    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('calls onChange on Enter key press', async () => {
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} label="Label" classNames={classNames} />)

    screen.getByRole('checkbox').focus()
    await userEvent.keyboard('{Enter}')

    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('calls onChange on Space key press', async () => {
    const onChange = vi.fn()
    render(<Checkbox checked={true} onChange={onChange} label="Label" classNames={classNames} />)

    screen.getByRole('checkbox').focus()
    await userEvent.keyboard(' ')

    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('does not call onChange on other keys', async () => {
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} label="Label" classNames={classNames} />)

    screen.getByRole('checkbox').focus()
    await userEvent.keyboard('{Tab}')

    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders the custom root element passed via "as"', () => {
    render(
      <ul>
        <Checkbox
          as="li"
          checked={false}
          onChange={vi.fn()}
          label="Label"
          classNames={classNames}
        />
      </ul>,
    )

    expect(screen.getByRole('checkbox').tagName).toBe('LI')
  })
})
