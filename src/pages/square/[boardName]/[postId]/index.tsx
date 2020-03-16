import { Tokens } from '@/api'
import Information from '@/components/Information'
import RequireAuth from '@/components/RequireAuth'
import WhiteBody from '@/components/utils/WhiteBody'
import Body from '@/layouts/BaseLayout/Body'
import ApiHost from '@/modules/api-host'
import Time from '@/modules/time'
import { EodiroPage } from '@/pages/_app'
import { oneAPIClient } from '@payw/eodiro-one-api/client'
import { GetPostById } from '@payw/eodiro-one-api/scheme'
import { GetServerSideProps } from 'next'
import './style.scss'

type ContentProps = {
  post: GetPostById['payload']['data']
}

const Content: React.FC<ContentProps> = ({ post }) => {
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
    </div>
  )
}

type PostPageProps = {
  post: GetPostById['payload']['data']
  err: GetPostById['payload']['err']
}

const PostPage: EodiroPage<PostPageProps> = ({ post, err }) => {
  return (
    <Body
      pageTitle={post?.title || '포스트'}
      titleHidden
      textMargin="1rem"
      bodyClassName="eodiro-post-view"
    >
      {post && <Content post={post} />}
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
  const { data, err } = await oneAPIClient<GetPostById>(ApiHost.getHost(), {
    action: 'getPostById',
    data: {
      postID: Number(query.postId),
      accessToken: (await Tokens.get(req)).accessToken,
    },
  })

  return {
    props: {
      post: data,
      err,
    },
  }
}
