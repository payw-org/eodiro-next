import React from 'react'

export interface BasicIconProps {
  className?: string
}

export type ColorIcon = React.FC<BasicIconProps>

export interface FillableIconProps extends BasicIconProps {
  fill?: string
}

export type FillableIcon = React.FC<FillableIconProps>
