import { Tokens } from '@/api'
import Information from '@/components/Information'
import RequireAuth from '@/components/RequireAuth'
import Comments from '@/components/square/Comments'
import WhiteBody from '@/components/utils/WhiteBody'
import Body from '@/layouts/BaseLayout/Body'
import ApiHost from '@/modules/api-host'
import Time from '@/modules/time'
import { EodiroPage } from '@/pages/_app'
import { oneAPIClient } from '@payw/eodiro-one-api/client'
import { DBSchema } from '@payw/eodiro-one-api/db-schema'
import { GetComments, GetPostById } from '@payw/eodiro-one-api/scheme'
import { GetServerSideProps } from 'next'
import './style.scss'

type ContentProps = {
  post: GetPostById['payload']['data']
  comments: DBSchema.Comments
}

const Content: React.FC<ContentProps> = ({ post, comments }) => {
  return (
    <div>
      <WhiteBody />
      <article className="post">
        <span className="author">{post.random_nickname}</span>
        <span className="time">
          {Time.yyyymmddhhmmss(post.uploaded_at, true)}
        </span>
        <h1 className="title">{post.title}</h1>
        {post.body.split('\n').map((line, i) => {
          return line.length === 0 ? (
            <br key={`br-${i}`} className="line-break" />
          ) : (
            <p key={`p-${i}`} className={`paragraph-${i}`}>
              {line}
            </p>
          )
        })}
      </article>
      <Comments comments={comments} />
    </div>
  )
}

type PostPageProps = {
  post: GetPostById['payload']['data']
  comments: GetComments['payload']['data']
  postErr: GetPostById['payload']['err']
}

const PostPage: EodiroPage<PostPageProps> = ({
  post,
  comments,
  postErr: err,
}) => {
  return (
    <Body
      pageTitle={post?.title || '포스트'}
      titleHidden
      textMargin="1rem"
      bodyClassName="eodiro-post-view"
    >
      {post && <Content post={post} comments={comments} />}
      {err === 'Unauthorized' && <RequireAuth />}
      {err === 'No Content' && (
        <Information title="존재하지 않는 포스트입니다." />
      )}
    </Body>
  )
}

export default PostPage

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const postPayload = await oneAPIClient<GetPostById>(ApiHost.getHost(), {
    action: 'getPostById',
    data: {
      postID: Number(query.postId),
      accessToken: (await Tokens.get(req)).accessToken,
    },
  })

  const commentsPayload = await oneAPIClient<GetComments>(ApiHost.getHost(), {
    action: 'getComments',
    data: {
      postId: Number(query.postId),
      accessToken: (await Tokens.get(req)).accessToken,
    },
  })

  return {
    props: {
      post: postPayload.data,
      comments: commentsPayload.data,
      postErr: postPayload.err,
    },
  }
}
