import mergeClassNames from '@/modules/merge-class-name'
import Head from 'next/head'
import React, { FC } from 'react'
import Header, { HeaderProps } from './Header'

export type BodyProps = HeaderProps & {
  bodyClassName?: string
  hasTopGap?: boolean
  centered?: boolean
  hideOnLoad?: boolean
}

const Body: FC<BodyProps> = (props) => {
  const {
    children,
    bodyClassName,
    hasTopGap = true,
    centered = false,
    hideOnLoad = false,
  } = props

  return (
    <>
      <Head>
        <title>{props.pageTitle}</title>
      </Head>
      <div
        className={mergeClassNames(
          'body-content',
          bodyClassName,
          hasTopGap && 'top-gap',
          centered && 'centered',
          hideOnLoad && 'hidden'
        )}
      >
        <Header {...props} />
        {children}
      </div>
    </>
  )
}

export default Body

export function visualizeBody(): void {
  ;(document.querySelector('.body-content') as HTMLElement).classList.remove(
    'hidden'
  )
}
