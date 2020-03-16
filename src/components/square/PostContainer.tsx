import { visualizeBody } from '@/layouts/BaseLayout/Body'
import ApiHost from '@/modules/api-host'
import getState from '@/modules/get-state'
import mergeClassName from '@/modules/merge-class-name'
import Time from '@/modules/time'
import { oneAPIClient } from '@payw/eodiro-one-api/client'
import { Post, Posts } from '@payw/eodiro-one-api/db-schema/generated'
import {
  FetchPostsOfBoard,
  FetchRecentPostsOfBoard,
} from '@payw/eodiro-one-api/scheme'
import { ResizeSensor } from 'css-element-queries'
import _ from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { InfiniteScrollContainer } from '../utils'

const PostItem: React.FC<{
  boardName: string
  post: Post
}> = React.memo(({ boardName, post }) => {
  return (
    <a key={post.id} href={`/square/${boardName}/${post.id}`}>
      <div className={mergeClassName('post')}>
        <div>
          <p className="title">{post.title}</p>
        </div>
        <div className="right">
          <p className="nick">{post.random_nickname}</p>
          <p className="time">{Time.friendly(post.uploaded_at)}</p>
        </div>
      </div>
    </a>
  )
})

const PostContainer: React.FC = () => {
  function isFromPostOrNew(): boolean {
    const lastpage = sessionStorage.getItem('lastpage')
    return (
      (lastpage !== null &&
        lastpage.match(/\/square\/.*\/[0-9]*/g)?.length > 0) ||
      lastpage.match(/\/square\/.*\/new/g)?.length > 0
    )
  }

  function getCached(): Posts | null {
    return JSON.parse(sessionStorage.getItem('sbpd'))
  }

  function getScrollPos(): number {
    return Number(sessionStorage.getItem('sbsp'))
  }

  const router = useRouter()
  const boardName = router.query.boardName as string

  // Posts init value with cached ones
  const [posts, setPosts] = useState<Posts>(
    (isFromPostOrNew() && getCached()) || []
  )
  const [isMobile, setIsMobile] = useState(false)
  const postContainerRef = useRef<HTMLDivElement>(null)

  function checkWidth(width: number): void {
    if (width < 400) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }

  useEffect(() => {
    // Check container width for responsive layout
    checkWidth(postContainerRef.current.clientWidth)
    new ResizeSensor(postContainerRef.current, () => {
      checkWidth(postContainerRef.current.clientWidth)
    })
  }, [])

  // Resotre cached scroll
  useLayoutEffect(() => {
    if (isFromPostOrNew()) {
      window.scrollTo(0, getScrollPos())
    }
    // Make body visible after scroll restoration
    visualizeBody()
  }, [])

  async function loadMore(): Promise<boolean> {
    const posts = getState(setPosts)
    const newPosts = await oneAPIClient<FetchPostsOfBoard>(ApiHost.getHost(), {
      action: 'fetchPostsOfBoard',
      data: {
        boardID: 1,
        lastPostID: _.last(posts)?.id,
      },
    })

    if (newPosts.length === 0) {
      return false
    }

    const updatedPosts = [...posts, ...newPosts]
    sessionStorage.setItem('sbpd', JSON.stringify(updatedPosts))

    setPosts(updatedPosts)
  }

  async function loadNew(): Promise<void> {
    const posts = getState(setPosts)
    if (posts && posts.length > 0) {
      const payload = await oneAPIClient<FetchRecentPostsOfBoard>(
        ApiHost.getHost(),
        {
          action: 'fetchRecentPostsOfBoard',
          data: {
            boardID: 1,
            mostRecentPostID: posts[0].id,
          },
        }
      )
      if (payload && payload.length > 0) {
        sessionStorage.setItem('sbpd', JSON.stringify([...payload, ...posts]))
        const updatedPosts = [...payload, ...posts]
        setPosts(updatedPosts)
      }
    }

    setTimeout(() => {
      loadNew()
    }, 3000)
  }
  useEffect(() => {
    loadNew()

    window.addEventListener('scroll', () => {
      sessionStorage.setItem('sbsp', window.scrollY.toString())
    })
  }, [])

  return (
    <div
      className={mergeClassName('posts-container', isMobile && 'mobile')}
      ref={postContainerRef}
    >
      <InfiniteScrollContainer strategy={loadMore}>
        {posts.map((post) => {
          return <PostItem key={post.id} boardName={boardName} post={post} />
        })}
      </InfiniteScrollContainer>
    </div>
  )
}

export default PostContainer
