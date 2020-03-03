import { Magnifier } from '@/components/icons'
import mergeClassName from '@/modules/merge-class-name'
import EodiroColors from '@/modules/styles/EodiroColors'
import React from 'react'
import './LineInput.scss'

type LineInputProps = {
  type?: 'text' | 'search' | 'email' | 'password'
  placeholder?: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const LineInput: React.FC<LineInputProps> = ({
  type = 'text',
  placeholder,
  onChange,
}) => {
  return (
    <div className="eodiro-line-input">
      <input
        type={type === 'search' ? 'text' : type}
        spellCheck="false"
        placeholder={placeholder}
        className={mergeClassName('li-field', type === 'search' && 'search')}
        onChange={onChange}
      />
      {type === 'search' && (
        <div className="magnifier-icon-wrapper">
          <Magnifier className="icon" fill={EodiroColors.green1} />
        </div>
      )}
    </div>
  )
}
