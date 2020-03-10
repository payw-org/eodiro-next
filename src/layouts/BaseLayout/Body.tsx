import mergeClassName from '@/modules/merge-class-name'
import React, { FC } from 'react'
import Header, { HeaderProps } from './Header'

export type BodyProps = HeaderProps & {
  bodyClassName?: string
  hasTopGap?: boolean
  centered?: boolean
}

const Body: FC<BodyProps> = (props) => {
  const { children, bodyClassName, hasTopGap = true, centered = false } = props

  return (
    <div
      className={mergeClassName(
        'body-content',
        bodyClassName,
        hasTopGap ? 'top-gap' : '',
        centered && 'centered'
      )}
    >
      <Header {...props} />
      {children}
    </div>
  )
}

export default Body
