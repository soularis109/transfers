import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Logo from './Logo'

function renderLogo(onClick?: () => void) {
  render(
    <MemoryRouter>
      <Logo onClick={onClick} />
    </MemoryRouter>,
  )
}

describe('Logo', () => {
  afterEach(() => {
    cleanup()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    renderLogo(onClick)

    await userEvent.click(screen.getByRole('link', { name: 'На головну' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders without onClick', () => {
    renderLogo()

    expect(screen.getByRole('link', { name: 'На головну' })).toBeInTheDocument()
  })
})
