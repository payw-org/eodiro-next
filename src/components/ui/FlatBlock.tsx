import React from 'react'
import { ArrowBlock } from './ArrowBlock'

type FlatBlockProps = {
  customPadding?: boolean
}

export const FlatBlock: React.FC<FlatBlockProps> = (props) => {
  return (
    <ArrowBlock noArrow flat customPadding={props.customPadding}>
      {props.children}
    </ArrowBlock>
  )
}
