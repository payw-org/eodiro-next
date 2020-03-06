import { NavigationContext } from '@/components/Navigation'
import mergeClassName from '@/modules/merge-class-name'
import React, { ReactNode, useContext, useEffect, useRef } from 'react'

export type BodyProps = {
  children?: ReactNode
  bodyClassName?: string
  hasTopGap?: boolean
  pageTitle?: string
  onScrollEnds?: () => void
  centered?: boolean
}

const Body = React.forwardRef<HTMLDivElement, BodyProps>(
  (
    {
      children,
      bodyClassName,
      hasTopGap = true,
      pageTitle,
      onScrollEnds = null,
      centered = false,
    },
    ref
  ) => {
    ref
    const titleSentinelRef = useRef<HTMLHeadingElement>(null)
    const bodyContentBottomRef = useRef<HTMLDivElement>(null)
    const navContext = useContext(NavigationContext)

    useEffect(() => {
      if (pageTitle && titleSentinelRef.current) {
        navContext.setPageAppTitle(pageTitle)
        const titleSentinelElm = titleSentinelRef.current
        const bodyContentBottomElm = bodyContentBottomRef.current

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.target.isSameNode(titleSentinelElm)) {
              if (entry.isIntersecting) {
                // Appear
                navContext.setIsHidden(true)
              } else {
                // Disappear
                navContext.setIsHidden(false)
              }
            } else if (entry.target.isSameNode(bodyContentBottomElm)) {
              if (entry.isIntersecting) {
                // Scroll ends
                onScrollEnds && onScrollEnds()
              }
            }
          })
        })

        observer.observe(titleSentinelElm)
        if (onScrollEnds) {
          observer.observe(bodyContentBottomElm)
        }
      }
    }, [])

    return (
      <div
        ref={ref}
        className={mergeClassName(
          'body-content',
          bodyClassName,
          hasTopGap ? 'top-gap' : '',
          centered ? 'centered' : ''
        )}
      >
        {pageTitle && (
          <h1 className="page-app-title">
            {pageTitle}
            <div className="pat-sentinel" ref={titleSentinelRef} />
          </h1>
        )}

        {children}

        <div
          className="body-content-bottom-sentinel"
          ref={bodyContentBottomRef}
        />
      </div>
    )
  }
)

Body.displayName = 'Body'

export default Body
