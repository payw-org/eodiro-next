import { Button, FlatBlock } from '@/components/ui'
import { InfiniteScrollContainer } from '@/components/utils'
import Body from '@/layouts/BaseLayout/Body'
import ApiHost from '@/modules/api-host'
import getState from '@/modules/get-state'
import mergeClassName from '@/modules/merge-class-name'
import Time from '@/modules/time'
import { EodiroPage, useAuth } from '@/pages/_app'
import { oneAPIClient } from '@payw/eodiro-one-api/client'
import { Posts } from '@payw/eodiro-one-api/db-schema/generated'
import { FetchPostsOfBoard } from '@payw/eodiro-one-api/scheme'
import { ResizeSensor } from 'css-element-queries'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import './style.scss'

const SideContainer: React.FC<{ isSigned: boolean; boardName: string }> = ({
  isSigned,
  boardName,
}) => {
  return (
    <div className="side">
      {isSigned && (
        <a href={`/square/${boardName}/new`}>
          <div className="new-btn-wrapper">
            <Button full label="새 포스트 작성" className="new-btn" />
          </div>
        </a>
        // </Link>
      )}
      <div className="more">
        <FlatBlock>
          <h3>다른 게시판</h3>
        </FlatBlock>
      </div>
    </div>
  )
}

const PostContainer: React.FC = () => {
  const router = useRouter()
  const boardName = router.query.boardName as string
  const [posts, setPosts] = useState<Posts>([])
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
    checkWidth(postContainerRef.current.clientWidth)

    new ResizeSensor(postContainerRef.current, () => {
      checkWidth(postContainerRef.current.clientWidth)
    })
  }, [])

  useEffect(() => {
    const cached = JSON.parse(sessionStorage.getItem('sbpd'))
    const scrollY = Number(sessionStorage.getItem('sbsp'))
    if (cached) {
      setPosts(cached)
      setTimeout(() => {
        window.scrollTo(0, scrollY)
      }, 0)
    }
  }, [])

  async function loadMore(): Promise<boolean> {
    console.log('load more')
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

    setPosts(updatedPosts)
    sessionStorage.setItem('sbpd', JSON.stringify(updatedPosts))
  }

  return (
    <div
      className={mergeClassName('posts-container', isMobile && 'mobile')}
      ref={postContainerRef}
    >
      <InfiniteScrollContainer strategy={loadMore}>
        {posts.map((post) => {
          return (
            <div className="post" key={post.id}>
              <a
                href={`/square/${boardName}/${post.id}`}
                className="absolute-link"
                onClick={() => {
                  console.log('click the link')
                  sessionStorage.setItem('sbsp', window.scrollY.toString())
                }}
              />
              <div>
                <p className="title">{post.title}</p>
              </div>
              <div className="right">
                <p className="nick">{post.random_nickname}</p>
                <p className="time">{Time.friendly(post.uploaded_at)}</p>
              </div>
            </div>
          )
        })}
      </InfiniteScrollContainer>
    </div>
  )
}

const BoardPage: EodiroPage = () => {
  const { isSigned } = useAuth()
  const router = useRouter()
  const boardName = router.query.boardName as string

  return (
    <Body pageTitle={boardName} bodyClassName="eodiro-board-page">
      <div className="page-container">
        <SideContainer isSigned={isSigned} boardName={boardName} />
        <FlatBlock className="content">
          <PostContainer />
        </FlatBlock>
      </div>
    </Body>
  )
}

export default BoardPage
