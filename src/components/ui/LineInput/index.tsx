import { Magnifier } from '@/components/icons'
import mergeClassName from '@/modules/merge-class-name'
import EodiroColors from '@/modules/styles/EodiroColors'
import React from 'react'
import './LineInput.scss'

export type LineInputOnChangeHook = (inputValue: string) => void

type LineInputProps = {
  value?: string
  setValue?: React.Dispatch<React.SetStateAction<string>>
  className?: string
  type?: 'text' | 'search' | 'email' | 'password'
  placeholder?: string
  onChangeHook?: LineInputOnChangeHook
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onEnter?: () => void
}

export const LineInput = React.forwardRef<HTMLInputElement, LineInputProps>(
  (
    {
      value,
      setValue = (): void => {},
      className,
      type = 'text',
      placeholder,
      onChangeHook = (): void => {},
      onKeyDown,
      onKeyPress,
      onKeyUp,
      onEnter,
    },
    ref
  ) => {
    return (
      <div className={mergeClassName('eodiro-line-input', className)}>
        <input
          ref={ref}
          value={value}
          type={type === 'search' ? 'text' : type}
          spellCheck="false"
          placeholder={placeholder}
          className={mergeClassName('li-field', type === 'search' && 'search')}
          onChange={(e): void => {
            const value = e.target.value
            setValue(value)
            onChangeHook(value)
          }}
          onKeyDown={(e): void => {
            if (onKeyDown) {
              onKeyDown(e)
            }

            if (onEnter && e.key === 'Enter') {
              onEnter()
            }
          }}
          onKeyPress={onKeyPress}
          onKeyUp={onKeyUp}
        />
        {type === 'search' && (
          <div className="magnifier-icon-wrapper">
            <Magnifier className="icon" fill={EodiroColors.green1} />
          </div>
        )}
      </div>
    )
  }
)

LineInput.displayName = 'LineInput'
