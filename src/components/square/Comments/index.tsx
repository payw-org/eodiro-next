import { Tokens } from '@/api'
import Information from '@/components/Information'
import ApiHost from '@/modules/api-host'
import Time from '@/modules/time'
import { Dispatcher } from '@/types/react-helper'
import { oneAPIClient } from '@payw/eodiro-one-api/client'
import { DBSchema } from '@payw/eodiro-one-api/db-schema'
import { GetComments, UploadComment } from '@payw/eodiro-one-api/scheme'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { createContext, useContext, useState } from 'react'
import './style.scss'

const CommentsContext = createContext(
  {} as {
    comments: DBSchema.Comments
    setComments: Dispatcher<DBSchema.Comments>
  }
)

const CommentItem: React.FC<{ comment: DBSchema.Comment }> = ({ comment }) => {
  return (
    <div className="comment-item">
      <div className="nick-and-time">
        <span className="nick">{comment.random_nickname}</span>
        <span className="time">{Time.friendly(comment.uploaded_at)}</span>
      </div>
      <p className="body">{comment.body}</p>
    </div>
  )
}

const NewComment: React.FC = () => {
  const router = useRouter()
  const [value, setValue] = useState('')
  const { comments, setComments } = useContext(CommentsContext)

  return (
    <input
      className="new-comment"
      type="text"
      placeholder="댓글을 입력하세요."
      value={value}
      onChange={(e): void => setValue(e.target.value)}
      onKeyDown={async (e): Promise<void> => {
        if (e.key !== 'Enter') return

        setValue('')

        const pyld = await oneAPIClient<UploadComment>(ApiHost.getHost(), {
          action: 'uploadComment',
          data: {
            postId: Number(router.query.postId),
            body: value,
            accessToken: (await Tokens.get()).accessToken,
          },
        })

        const newCommentsPyld = await oneAPIClient<GetComments>(
          ApiHost.getHost(),
          {
            action: 'getComments',
            data: {
              postId: Number(router.query.postId),
              mostRecentCommentId:
                comments.length > 0 ? _.last(comments).id : 0,
            },
          }
        )

        setComments([...comments, ...newCommentsPyld.data])
      }}
    />
  )
}

const Comments: React.FC<{
  comments: DBSchema.Comments
}> = (props) => {
  const [comments, setComments] = useState(props.comments)

  let inner: JSX.Element | JSX.Element[]

  if (!comments) {
    inner = <Information title="댓글을 가져올 수 없습니다." />
  } else if (comments && comments.length === 0) {
    inner = <p className="no-comments-yet">아직 댓글이 없습니다.</p>
  } else {
    inner = (
      <div>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
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
