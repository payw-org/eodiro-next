import { Magnifier } from '@/components/icons'
import mergeClassName from '@/modules/merge-class-name'
import EodiroColors from '@/modules/styles/EodiroColors'
import React, { useState } from 'react'
import './LineInput.scss'

export type LineInputOnChangeHook = (inputValue: string) => void

type LineInputProps = {
  value?: string
  setValue?: React.Dispatch<React.SetStateAction<string>>
  className?: string
  type?: 'text' | 'search' | 'email' | 'password'
  placeholder?: string
  onChangeHook?: LineInputOnChangeHook
  onChangeThrottle?: [LineInputOnChangeHook, number?]
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onEnter?: () => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  disabled?: boolean
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
      onChangeThrottle,
      onKeyDown,
      onKeyPress,
      onKeyUp,
      onEnter,
      onFocus,
      disabled = false,
    },
    ref
  ) => {
    const [throttleTimeout, setThrottleTimeout] = useState<number>(null)

    return (
      <div className={mergeClassName('eodiro-line-input', className)}>
        <input
          ref={ref}
          value={value}
          disabled={disabled}
          type={type === 'search' ? 'text' : type}
          spellCheck="false"
          placeholder={placeholder}
          className={mergeClassName('li-field', type === 'search' && 'search')}
          onChange={(e): void => {
            e.persist()
            const value = e.target.value
            setValue(value)
            onChangeHook(value)

            if (!onChangeThrottle) return
            const [
              throttleHook = (): void => {},
              throttle = 300,
            ] = onChangeThrottle
            if (throttleTimeout) {
              window.clearTimeout(throttleTimeout)
            }
            setThrottleTimeout(
              window.setTimeout(() => {
                throttleHook(value)
              }, throttle)
            )
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
          onFocus={onFocus}
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
