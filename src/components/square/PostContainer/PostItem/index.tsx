import mergeClassNames from '@/modules/merge-class-name'
import Time from '@/modules/time'
import { Unpacked } from '@/types/unpacked'
import { FetchPostsOfBoard } from '@payw/eodiro-one-api/api/one/scheme'
import { OneApiPayload } from '@payw/eodiro-one-api/api/one/scheme/types/utils'
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
      <div className={mergeClassNames('post')}>
        <div className="display-flex align-items-center">
          <p className="title">{post.title}</p>
          <div>
            <i className="octicon octicon-comment" />
            <span>{post.comment_count}</span>
          </div>
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
