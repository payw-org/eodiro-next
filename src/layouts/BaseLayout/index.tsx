import React from 'react'
import Navigation from '@/components/Navigation'
import './BaseLayout.scss'
import buildClassName from '@/modules/build-class-name'

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
    <div id="eodiro-app" className={appClassName}>
      <Navigation />
      <div
        className={buildClassName(
          'body-content',
          bodyClassName,
          hasTopGap ? 'top-gap' : ''
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default BaseLayout
