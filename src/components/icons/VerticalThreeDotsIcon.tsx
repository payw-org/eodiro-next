import React from 'react'
import { FillableAndClickableIcon } from '@/types'

const VerticalThreeDotsIcon: FillableAndClickableIcon = ({
  appearance,
  className,
  fill = '#000',
  onClick,
}) => {
  return (
    <svg
      className={className}
      data-appearance={appearance}
      onClick={onClick}
      width="30px"
      height="162px"
      viewBox="0 0 30 162"
      version="1.1"
    >
      <g
        id="three-dots-vertical-color-icon"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g id="Group" fill={fill}>
          <circle id="Oval" cx="15" cy="15" r="15"></circle>
          <circle id="Oval" cx="15" cy="81" r="15"></circle>
          <circle id="Oval" cx="15" cy="147" r="15"></circle>
        </g>
      </g>
    </svg>
  )
}

export { VerticalThreeDotsIcon }
