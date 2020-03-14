import mergeClassName from '@/modules/merge-class-name'
import Head from 'next/head'
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
    <>
      <Head>
        <title>{props.pageTitle}</title>
      </Head>
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
    </>
  )
}

export default Body
