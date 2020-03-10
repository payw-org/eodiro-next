import getState from '@/modules/get-state'
import React, { useEffect, useRef, useState } from 'react'

type InfiniteScrollContainerProps = {
  strategy: () => Promise<boolean>
}

export const InfiniteScrollContainer: React.FC<InfiniteScrollContainerProps> = (
  props
) => {
  const bodyContentBottomRef = useRef<HTMLDivElement>(null)
  const [, setIsLoading] = useState(false)

  function isReachBottom(ref: React.MutableRefObject<HTMLElement>): boolean {
    return window.innerHeight < ref.current.getBoundingClientRect().bottom
  }

  async function processStrategy(): Promise<void> {
    const isLoading = getState(setIsLoading)

    if (isLoading) return

    setIsLoading(true)

    const shouldProcessAgain = await props.strategy()

    if (typeof shouldProcessAgain !== 'boolean') {
      console.error('[InfiniteScrollContainer] strategy should return boolean')
      return
    }

    setIsLoading(false)

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
    </div>
  )
}
