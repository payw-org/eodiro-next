import { NavigationContext } from '@/components/Navigation'
import getState from '@/modules/get-state'
import mergeClassName from '@/modules/merge-class-name'
import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

export type BodyProps = {
  children?: ReactNode
  bodyClassName?: string
  hasTopGap?: boolean
  pageTitle?: string
  onScrollEnds?: () => void
  centered?: boolean
  infinityScroll?: {
    loadDataStrategy: () => Promise<boolean>
    dataContainerRef: React.MutableRefObject<HTMLElement>
}
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
      infinityScroll,
    },
    ref
  ) => {
    ref
    const titleSentinelRef = useRef<HTMLHeadingElement>(null)
    const bodyContentBottomRef = useRef<HTMLDivElement>(null)
    const navContext = useContext(NavigationContext)

    const [, setIsFetchingData] = useState(false)

    function isReachBottom(ref: React.MutableRefObject<HTMLElement>): boolean {
      return window.innerHeight < ref.current.getBoundingClientRect().bottom
    }

    function processInfinityScroll(): void {
      const isFetchingData = getState<boolean>(setIsFetchingData)

      if (isFetchingData) return

      setIsFetchingData(true)

      infinityScroll.loadDataStrategy().then((oneMore) => {
        setIsFetchingData(false)
        if (!oneMore) return
        if (!isReachBottom(infinityScroll.dataContainerRef)) {
          processInfinityScroll()
        }
      })
    }

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
                // onScrollEnds && onScrollEnds()

                if (infinityScroll) {
                  processInfinityScroll()
                }
              }
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
