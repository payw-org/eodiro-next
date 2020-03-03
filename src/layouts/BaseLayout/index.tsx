import GlobalFooter from '@/components/GlobalFooter'
import Navigation from '@/components/Navigation'
import { CEM } from '@/modules/custom-event-manager'
import mergeClassName from '@/modules/merge-class-name'
import React, { useEffect, useRef } from 'react'
import './BaseLayout.scss'

type BaseLayoutProps = {
  appClassName?: string
  bodyClassName?: string
  hasTopGap?: boolean
  enableScrollEvent?: boolean
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  appClassName,
  bodyClassName,
  hasTopGap = true,
  enableScrollEvent = false,
}) => {
  const bodyContent = useRef<HTMLDivElement>(null)

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
    <div id="eodiro-app-scaffold" className={appClassName}>
      <div id="eodiro-app">
        <Navigation />
        <div
          ref={bodyContent}
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
