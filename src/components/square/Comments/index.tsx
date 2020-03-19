import { Tokens } from '@/api'
import Information from '@/components/Information'
import ApiHost from '@/modules/api-host'
import { useAuth } from '@/pages/_app'
import { Dispatcher } from '@/types/react-helper'
import { oneAPIClient } from '@payw/eodiro-one-api'
import { OneApiError } from '@payw/eodiro-one-api/api/one/scheme/types/utils'
import { CommentType } from '@payw/eodiro-one-api/database/models/comment'
import _ from 'lodash'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { createContext, useContext, useRef, useState } from 'react'
import './style.scss'

const FriendlyTime = dynamic(() => import('@/components/utils/FriendlyTime'), {
  ssr: false,
})

const CommentsContext = createContext(
  {} as {
    comments: CommentType[]
    setComments: Dispatcher<CommentType[]>
  }
)

const CommentItem: React.FC<{
  comment: CommentType
  index: number
  deleteComment: (index: number) => void
}> = React.memo(({ comment, index, deleteComment }) => {
  const auth = useAuth()

  return (
    <div className="comment-item">
      <div className="first-row">
        <div className="nick-and-time">
          <span className="nick">{comment.random_nickname}</span>
          <FriendlyTime time={comment.uploaded_at} className="time" />
        </div>
        {auth.userId === comment.user_id && (
          <div>
            <button
              className="delete"
              onClick={async () => {
                if (!confirm('정말 삭제하시겠습니까?')) return

                const payload = await oneAPIClient(ApiHost.getHost(), {
                  action: 'deleteComment',
                  data: {
                    accessToken: (await Tokens.get()).accessToken,
                    commentId: comment.id,
                  },
                })

                if (payload.err === OneApiError.NO_CONTENT) {
                  alert('이미 삭제되었거나 존재하지 않는 댓글입니다.')
                } else {
                  deleteComment(index)
                  alert('삭제되었습니다.')
                }
              }}
            >
              삭제
            </button>
          </div>
        )}
      </div>
      <p className="body">{comment.body}</p>
    </div>
  )
})

const NewComment: React.FC = () => {
  const router = useRouter()
  const [value, setValue] = useState('')
  const { comments, setComments } = useContext(CommentsContext)
  const inputRef = useRef<HTMLInputElement>(null)
  const auth = useAuth()

  return (
    <input
      ref={inputRef}
      className="new-comment"
      type="text"
      placeholder="댓글"
      spellCheck={false}
      autoComplete="off"
      value={value}
      onChange={(e): void => setValue(e.target.value)}
      onKeyUp={async (e): Promise<void> => {
        if (e.key !== 'Enter') return

        setValue('')

        const uploadPayload = await oneAPIClient(ApiHost.getHost(), {
          action: 'uploadComment',
          data: {
            postId: Number(router.query.postId),
            body: value,
            accessToken: (await Tokens.get()).accessToken,
          },
        })

        if (uploadPayload.err) {
          if (uploadPayload.err === 'No Body') {
            alert('내용을 입력하세요.')
            return
          }
        }

        // Upload success

        // Blur input
        inputRef.current.blur()

        // Refresh recent comments
        const newCommentsPyld = await oneAPIClient(ApiHost.getHost(), {
          action: 'getComments',
          data: {
            accessToken: auth.tokens.accessToken,
            postId: Number(router.query.postId),
            mostRecentCommentId: comments.length > 0 ? _.last(comments).id : 0,
          },
        })

        setComments([...comments, ...newCommentsPyld.data])
      }}
    />
  )
}

const Comments: React.FC<{
  comments: CommentType[]
}> = (props) => {
  const [comments, setComments] = useState(props.comments)

  let inner: JSX.Element | JSX.Element[]

  function deleteComment(commentIndex: number): void {
    _.pullAt(comments, commentIndex)
    setComments([...comments])
  }

  if (!comments) {
    inner = <Information title="댓글을 가져올 수 없습니다." />
  } else if (comments && comments.length === 0) {
    inner = <p className="no-comments-yet">아직 댓글이 없습니다.</p>
  } else {
    inner = (
      <div>
        {comments.map((comment, i) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            index={i}
            deleteComment={deleteComment}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="eodiro-square-post-comments">
      {inner}
      <CommentsContext.Provider
        value={{
          comments,
          setComments,
        }}
      >
        <NewComment />
      </CommentsContext.Provider>
    </div>
  )
}

export default Comments
