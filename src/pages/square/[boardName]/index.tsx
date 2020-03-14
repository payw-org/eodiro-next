import ServerError from '@/components/ServerError'
import { Button, FlatBlock } from '@/components/ui'
import { InfiniteScrollContainer } from '@/components/utils'
import Body from '@/layouts/BaseLayout/Body'
import ApiHost from '@/modules/api-host'
import getState from '@/modules/get-state'
import mergeClassName from '@/modules/merge-class-name'
import Time from '@/modules/time'
import { EodiroPage, useAuth } from '@/pages/_app'
import { oneAPIClient } from '@payw/eodiro-one-api/client'
import { FetchPostsOfBoard } from '@payw/eodiro-one-api/scheme'
import { ResizeSensor } from 'css-element-queries'
import _ from 'lodash'
import { GetServerSideProps } from 'next'
import { useEffect, useRef, useState } from 'react'
import './style.scss'

const PostContainer: React.FC<{
  initialPosts: FetchPostsOfBoard['payload']
}> = ({ initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts)
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

  async function loadMore(): Promise<boolean> {
    const posts = getState(setPosts)
    const newPosts = await oneAPIClient<FetchPostsOfBoard>(ApiHost.getHost(), {
      action: 'fetchPostsOfBoard',
      data: {
        boardID: 1,
        lastPostID: _.last(posts).id,
      },
    })

    if (newPosts.length === 0) {
      return false
    }

    setPosts([...posts, ...newPosts])
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
              <a href="" className="absolute-link" />
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

type BoardPageProps = {
  boardName: string
  posts: FetchPostsOfBoard['payload']
}

const BoardPage: EodiroPage<BoardPageProps> = (props) => {
  const { posts } = props
  const { isSigned } = useAuth()

  return (
    <Body pageTitle={props.boardName} bodyClassName="eodiro-board-page">
      <div className="page-container">
        <div className="side">
          {isSigned && (
            <div className="new-btn-wrapper">
              <Button full label="포스트 작성" className="new-btn" />
            </div>
          )}
          <FlatBlock>
            <h3>다른 게시판</h3>
          </FlatBlock>
        </div>
        <FlatBlock className="content">
          {posts ? <PostContainer initialPosts={posts} /> : <ServerError raw />}
        </FlatBlock>
      </div>
    </Body>
  )
}

export default BoardPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { boardName } = params
  const posts = await oneAPIClient(ApiHost.getHost(), {
    action: 'fetchPostsOfBoard',
    data: {
      boardID: 0,
      amount: 20,
    },
  })

  return {
    props: {
      boardName,
      posts,
    },
  }
}
