import Time from '@/modules/time'
import { Unpacked } from '@/types/unpacked'
import { FetchPostsOfBoard } from '@payw/eodiro-one-api/api/one/scheme'
import { OneApiPayload } from '@payw/eodiro-one-api/api/one/scheme/types/utils'
import classNames from 'classnames'
import React from 'react'
import './style.scss'

// Post item component (memoized)
const PostItem: React.FC<{
  boardName: string
  post: Unpacked<OneApiPayload<FetchPostsOfBoard>>
}> = React.memo(({ boardName, post }) => {
  return (
    <a
      key={post.id}
      href={`/square/${boardName}/${post.id}`}
      onClick={(): void => {
        sessionStorage.setItem('sbsp', window.scrollY?.toString())
      }}
    >
      <div className={classNames('post')}>
        <div className="display-flex flex-direction-row align-items-center justify-content-space-between">
          <p className="title">{post.title}</p>
          {post.comment_count > 0 && (
            <div className="comments font-weight-bold display-flex align-items-center">
              <i className="octicon octicon-comment icon" />
              <span className="count">{post.comment_count}</span>
            </div>
          )}
        </div>
        <div className="right">
          <p className="nick">{post.random_nickname}</p>
          <p className="time">{Time.friendly(post.uploaded_at)}</p>
        </div>
      </div>
    </a>
  )
})

export default PostItem
