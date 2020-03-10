import {
  NavHiddenDispatchContext,
  NavScrollDispatchContext,
  NavTitleDispatchContext,
} from '@/components/Navigation'
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
  pageTitle: string
  titleAlign?: 'left' | 'center'
  titleHidden?: boolean
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
      titleAlign = 'left',
      titleHidden = false,
      centered = false,
      infinityScroll,
    },
    ref
  ) => {
    const titleTextSentinelRef = useRef<HTMLDivElement>(null)
    const titleTopSentinelRef = useRef<HTMLHeadingElement>(null)
    const bodyContentBottomRef = useRef<HTMLDivElement>(null)

    const setNavTitle = useContext(NavTitleDispatchContext)
    const setNavHidden = useContext(NavHiddenDispatchContext)
    const setNavScrolled = useContext(NavScrollDispatchContext)

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
      if (pageTitle && titleTextSentinelRef.current) {
        setNavTitle(pageTitle)
        const titleSentinelElm = titleTextSentinelRef.current
        const titleTopSentinelElm = titleTopSentinelRef.current
        const bodyContentBottomElm = bodyContentBottomRef.current

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.target.isSameNode(titleSentinelElm)) {
              if (entry.isIntersecting) {
                // Appear
                setNavHidden(true)
              } else {
                // Disappear
                setNavHidden(false)
              }
            } else if (entry.target.isSameNode(bodyContentBottomElm)) {
              if (entry.isIntersecting) {
                if (infinityScroll) {
                  processInfinityScroll()
                }
              }
            } else if (entry.target.isSameNode(titleTopSentinelElm)) {
              if (entry.isIntersecting) {
                setNavScrolled(false)
              } else {
                setNavScrolled(true)
              }
            }
          })
        })

        observer.observe(titleSentinelElm)
        observer.observe(titleTopSentinelElm)
        if (infinityScroll) {
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
          centered && 'centered'
        )}
      >
        {pageTitle && (
          <h1
            className={mergeClassName(
              'page-app-title',
              titleAlign === 'center' && 'center',
              titleHidden && 'hidden'
            )}
          >
            {pageTitle}
            <div className="top-sentinel" ref={titleTopSentinelRef} />
            <div className="pat-sentinel" ref={titleTextSentinelRef} />
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
