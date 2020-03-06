import mergeClassName from '@/modules/merge-class-name'
import React from 'react'
import './Button.scss'

type ButtonProps = {
  className?: string
  label: string
  full?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button
      className={mergeClassName(
        'eodiro-btn',
        props.className,
        props.full && 'full'
      )}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.label}
    </button>
  )
}
