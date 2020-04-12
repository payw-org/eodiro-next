import getState from '@/modules/get-state'
import React, { useEffect, useRef, useState } from 'react'
import './style.scss'

type InfiniteScrollContainerProps = {
  strategy: () => Promise<boolean>
}

const InfiniteScrollContainer: React.FC<InfiniteScrollContainerProps> = (
  props
) => {
  const bodyContentBottomRef = useRef<HTMLDivElement>(null)
  const [, setIsLoading] = useState(false)
  const [, setNoMore] = useState(false)

  function isReachBottom(ref: React.MutableRefObject<HTMLElement>): boolean {
    return window.innerHeight < ref.current.getBoundingClientRect().bottom
  }

  async function processStrategy(): Promise<void> {
    const isLoading = getState(setIsLoading)
    const noMore = getState(setNoMore)

    if (noMore) return
    if (isLoading) return

    setIsLoading(true)
    document.querySelector('.loading-indicator').classList.add('processing')

    const shouldProcessAgain = await props.strategy()

    setIsLoading(false)

    setTimeout(() => {
      document
        .querySelector('.loading-indicator')
        .classList.remove('processing')
    }, 700)

    if (shouldProcessAgain === false) {
      setNoMore(true)
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

  // Reset noMore flag when the strategy changes
  useEffect(() => {
    setNoMore(false)
  }, [props.strategy])

  return (
    <div className="infinite-scroll-container">
      {props.children}
      <div
        className="infinite-scroll-bottom-sentinel"
        ref={bodyContentBottomRef}
      />
      <div className="loading-indicator-wrapper">
        <div className="loading-indicator">
          <p>🚀 불러오는 중...</p>
        </div>
      </div>
    </div>
  )
}

export default InfiniteScrollContainer
