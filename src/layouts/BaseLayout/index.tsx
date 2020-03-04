import GlobalFooter from '@/components/GlobalFooter'
import Navigation, { NavigationProvider } from '@/components/Navigation'
import React, { useRef } from 'react'
import './BaseLayout.scss'
import Body, { BodyProps } from './Body'

interface BaseLayoutProps extends BodyProps {
  appClassName?: string
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  appClassName,
  bodyClassName,
  hasTopGap = true,
  pageTitle,
  onScrollEnds,
}) => {
  const bodyContent = useRef<HTMLDivElement>(null)
  const bodyProps: BodyProps = {
    bodyClassName,
    hasTopGap,
    pageTitle,
    onScrollEnds,
  }

  return (
    <NavigationProvider>
      <div id="eodiro-app-scaffold" className={appClassName}>
        <div id="eodiro-app">
          <Navigation />
          <Body ref={bodyContent} {...bodyProps}>
            {children}
          </Body>
          <GlobalFooter />
        </div>
      </div>
    </NavigationProvider>
  )
}

export default BaseLayout
