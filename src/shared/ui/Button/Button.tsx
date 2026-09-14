import type { ButtonHTMLAttributes } from 'react'
import './Button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

function Button({ className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={['button', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </button>
  )
}

export default Button
