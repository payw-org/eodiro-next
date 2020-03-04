import GlobalFooter from '@/components/GlobalFooter'
import Navigation, { NavigationProvider } from '@/components/Navigation'
import { CEM } from '@/modules/custom-event-manager'
import React, { useEffect, useRef } from 'react'
import './BaseLayout.scss'
import Body, { BodyProps } from './Body'

type BaseLayoutProps = {
  appClassName?: string
  bodyClassName?: string
  hasTopGap?: boolean
  enableScrollEvent?: boolean
  pageTitle?: string
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  appClassName,
  bodyClassName,
  hasTopGap = true,
  enableScrollEvent = false,
  pageTitle,
}) => {
  const bodyContent = useRef<HTMLDivElement>(null)
  const bodyProps: BodyProps = {
    bodyClassName,
    hasTopGap,
    pageTitle,
  }

  /**
   * When the `enableScrollEvent` props is set true,
   * BaseLayout detects scroll to bottom and dispatches a global CEM event
   */
  useEffect(() => {
    if (!enableScrollEvent) {
      return
    }

    // Dispatch scrollends event on the first load
    window.addEventListener('load', () => {
      CEM.dispatchEvent('scrollends')
    })

    // Dispatch scrollends event
    window.addEventListener(
      'scroll',
      () => {
        if (!bodyContent.current) {
          console.error(
            'Lost body content reference. Refresh the page if dev mode.'
          )
          return
        }
        if (
          bodyContent.current.getBoundingClientRect().bottom <=
          window.innerHeight + 50
        ) {
          CEM.dispatchEvent('scrollends')
        }
      },
      {
        passive: true,
      }
    )
  }, [])

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
