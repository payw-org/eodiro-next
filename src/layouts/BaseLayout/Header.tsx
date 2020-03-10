import {
  NavHiddenDispatchContext,
  NavScrollDispatchContext,
  NavTitleDispatchContext,
} from '@/components/Navigation'
import mergeClassName from '@/modules/merge-class-name'
import React, { FC, useContext, useEffect, useRef } from 'react'

export type HeaderProps = {
  titleAlign?: 'left' | 'center'
  titleHidden?: boolean
  pageTitle: string
}

const Header: FC<HeaderProps> = ({ pageTitle, titleAlign, titleHidden }) => {
  const titleTopSentinelRef = useRef<HTMLDivElement>(null)
  const titleTextSentinelRef = useRef<HTMLDivElement>(null)

  const setNavTitle = useContext(NavTitleDispatchContext)
  const setNavHidden = useContext(NavHiddenDispatchContext)
  const setNavScrolled = useContext(NavScrollDispatchContext)

  useEffect(() => {
    if (pageTitle && titleTextSentinelRef.current) {
      setNavTitle(pageTitle)
      const titleSentinelElm = titleTextSentinelRef.current
      const titleTopSentinelElm = titleTopSentinelRef.current

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
    }
  }, [])

  return (
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
  )
}

export default React.memo(Header, (prev, next) => {
  return prev.pageTitle === next.pageTitle
})
