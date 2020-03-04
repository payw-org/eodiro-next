import { NavigationContext } from '@/components/Navigation'
import mergeClassName from '@/modules/merge-class-name'
import React, { ReactNode, useContext, useEffect, useRef } from 'react'

export type BodyProps = {
  children?: ReactNode
  bodyClassName?: string
  hasTopGap?: boolean
  pageTitle?: string
}

const Body = React.forwardRef<HTMLDivElement, BodyProps>(
  ({ children, bodyClassName, hasTopGap, pageTitle }, ref) => {
    ref
    const titleSentinelRef = useRef<HTMLHeadingElement>(null)
    const navContext = useContext(NavigationContext)

    useEffect(() => {
      if (pageTitle && titleSentinelRef.current) {
        navContext.setPageAppTitle(pageTitle)
        const titleSentinelElm = titleSentinelRef.current
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Appear
              navContext.setIsHidden(true)
            } else {
              // Disappear
              navContext.setIsHidden(false)
            }
          })
        })
        observer.observe(titleSentinelElm)
      }
    }, [])

    return (
      <div
        ref={ref}
        className={mergeClassName(
          'body-content',
          bodyClassName,
          hasTopGap ? 'top-gap' : ''
        )}
      >
        {pageTitle && (
          <h1 className="page-app-title">
            {pageTitle}
            <div className="pat-sentinel" ref={titleSentinelRef} />
          </h1>
        )}

        {children}
      </div>
    )
  }
)

Body.displayName = 'Body'

export default Body
