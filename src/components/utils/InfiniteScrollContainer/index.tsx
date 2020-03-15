import React, { useEffect, useRef } from 'react'
import './style.scss'

type InfiniteScrollContainerProps = {
  strategy: () => Promise<boolean>
}

export const InfiniteScrollContainer: React.FC<InfiniteScrollContainerProps> = (
  props
) => {
  const bodyContentBottomRef = useRef<HTMLDivElement>(null)
  let isLoading = false
  let noMore = false

  function isReachBottom(ref: React.MutableRefObject<HTMLElement>): boolean {
    return window.innerHeight < ref.current.getBoundingClientRect().bottom
  }

  async function processStrategy(): Promise<void> {
    if (noMore) return
    if (isLoading) return

    isLoading = true
    document.querySelector('.loading-indicator').classList.add('processing')

    const shouldProcessAgain = await props.strategy()

    isLoading = false

    setTimeout(() => {
      document
        .querySelector('.loading-indicator')
        .classList.remove('processing')
    }, 700)

    if (shouldProcessAgain === false) {
      noMore = true
      return
    }

    if (!isReachBottom(bodyContentBottomRef)) {
      processStrategy()
    } else {
      return
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const sentinel = entries[0]

      if (sentinel.isIntersecting) {
        // Load more
        processStrategy()
      }
    })

    observer.observe(bodyContentBottomRef.current)
  }, [])

  return (
    <div className="infinite-scroll-container">
      {props.children}
      <div
        className="infinite-scroll-bottom-sentinel"
        ref={bodyContentBottomRef}
      />
      <div className="loading-indicator-wrapper">
        <div className="loading-indicator">
          <p>🚀 로딩 중...</p>
        </div>
      </div>
    </div>
  )
}
