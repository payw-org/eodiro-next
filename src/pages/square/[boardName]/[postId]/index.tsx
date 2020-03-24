import { Tokens } from '@/api'
import Information from '@/components/Information'
import RequireAuth from '@/components/RequireAuth'
import Comments from '@/components/square/Comments'
import { PostViewerFileContainer } from '@/components/square/PostViewerFileContainer'
import WhiteBody from '@/components/utils/WhiteBody'
import { pathIds } from '@/config/paths'
import Body from '@/layouts/BaseLayout/Body'
import ApiHost from '@/modules/api-host'
import Time from '@/modules/time'
import { EodiroPage, useAuth } from '@/pages/_app'
import { oneAPIClient } from '@payw/eodiro-one-api'
import { GetComments, GetPostById } from '@payw/eodiro-one-api/api/one/scheme'
import { CommentType } from '@payw/eodiro-one-api/database/models/comment'
import { PostType } from '@payw/eodiro-one-api/database/models/post'
import _ from 'lodash'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import './style.scss'

type ContentProps = {
  post: GetPostById['payload']['data']
  comments: CommentType[]
}
const Content: React.FC<ContentProps> = ({ post, comments }) => {
  const authInfo = useAuth()
  const router = useRouter()
  const boardName = router.query.boardName

  async function deletePost() {
    // Confirm
    const confirmation = confirm(
      '삭제된 포스트는 되돌릴 수 없으며 모든 댓글도 함께 삭제됩니다.\n정말 삭제하시겠습니까?'
    )

    if (!confirmation) return

    // Delete
    await oneAPIClient(ApiHost.getHost(), {
      action: 'deletePost',
      data: {
        accessToken: (await Tokens.get()).accessToken,
        postId: post.id,
      },
    })

    alert('삭제되었습니다.')

    // Update cached posts
    const cached: PostType[] = JSON.parse(sessionStorage.getItem('sbpd'))
    // Update when there is cache
    if (cached) {
      const index = cached.findIndex((cachedPost) => cachedPost.id === post.id)

      if (index !== -1) {
        // Only if it exists in the cache
        _.pullAt(cached, index)
        sessionStorage.setItem('sbpd', JSON.stringify(cached))
      }
    }

    // Redirect to the list
    window.location.replace(`/square/${boardName}`)
  }

  return (
    <div>
      <WhiteBody />
      <a href={`/square/${boardName}`} className="to-list">
        <span className="d-flex align-items-center">
          <i className="octicon octicon-chevron-left font-weight-bold" />{' '}
          목록으로
        </span>
      </a>

      <article className="post">
        <div className="info">
          <span className="author">{post.random_nickname}</span>

          <span className="time">
            {Time.yyyymmddhhmmss(post.uploaded_at, true)}
          </span>

          {post.user_id === authInfo.userId && (
            <span className="actions">
              <a
                href={`/square/${boardName}/${pathIds.writePost}?post_id=${post.id}`}
              >
                <button className="edit">수정</button>
              </a>
              <button className="delete" onClick={deletePost}>
                삭제
              </button>
            </span>
          )}
        </div>
        {/* Post title */}
        <h1 className="title">{post.title}</h1>
        {/* Post body */}
        {post.body.split('\n').map((line, i) => {
          return line.length === 0 ? (
            <br key={`br-${i}`} className="line-break" />
          ) : (
            <p key={`p-${i}`} className={`paragraph-${i}`}>
              {line}
            </p>
          )
        })}
        {post.files && post.files.length > 0 && (
          <PostViewerFileContainer files={post.files} />
        )}
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
const PostPage: EodiroPage<PostPageProps> = ({ post, comments, postErr }) => {
  return (
    <Body
      pageTitle={post?.title || '포스트'}
      titleHidden
      textMargin="7rem"
      bodyClassName="eodiro-post-view"
      hasTopGap={postErr ? true : false}
    >
      {post && <Content post={post} comments={comments} />}
      {postErr === 'Unauthorized' && <RequireAuth />}
      {postErr === 'No Content' && (
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
  const postPayload = await oneAPIClient(ApiHost.getHost(), {
    action: 'getPostById',
    data: {
      postId: Number(query.postId),
      accessToken: (await Tokens.get(req)).accessToken,
    },
  })

  const commentsPayload = await oneAPIClient(ApiHost.getHost(), {
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
