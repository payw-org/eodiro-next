import React from 'react'
import mergeClassName from '@/modules/merge-class-name'
import Navigation from '@/components/Navigation'
import GlobalFooter from '@/components/GlobalFooter'

import './BaseLayout.scss'

type BaseLayoutProps = {
  appClassName?: string
  bodyClassName?: string
  hasTopGap?: boolean
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  appClassName,
  bodyClassName,
  hasTopGap = false,
}) => {
  return (
    <div id="eodiro-app-scaffold" className={appClassName}>
      <div id="eodiro-app">
        <Navigation />
        <div
          className={mergeClassName(
            'body-content',
            bodyClassName,
            hasTopGap ? 'top-gap' : ''
          )}
        >
          {children}
        </div>
        <GlobalFooter />
      </div>
    </div>
  )
}

export default BaseLayout
