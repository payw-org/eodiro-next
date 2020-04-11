import { Dispatcher } from '@/types/react-helper'
import { CommentType } from '@payw/eodiro-one-api/database/models/comment'
import { createContext } from 'react'

const CommentsContext = createContext(
  {} as {
    comments: CommentType[]
    setComments: Dispatcher<CommentType[]>
  }
)

export default CommentsContext
