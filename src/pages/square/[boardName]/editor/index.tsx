import { Tokens } from '@/api'
import { NavTitleDispatchContext } from '@/components/Navigation'
import NoFooter from '@/components/utils/NoFooter'
import WhiteBody from '@/components/utils/WhiteBody'
import Body from '@/layouts/BaseLayout/Body'
import ApiHost from '@/modules/api-host'
import { redirect } from '@/modules/server/redirect'
import { EodiroPage } from '@/pages/_app'
import { oneAPIClient } from '@payw/eodiro-one-api'
import { PostType } from '@payw/eodiro-one-api/database/models/post'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { MutableRefObject, useContext, useEffect, useRef } from 'react'
import './style.scss'

type NewPostPageProps = {
  title: string
  body: string
  postId: number
}

const NewPostPage: EodiroPage<NewPostPageProps> = ({ title, body, postId }) => {
  const mode = title.length === 0 ? 'new' : 'edit'
  const router = useRouter()

  const titleRef = useRef<HTMLTextAreaElement>(null)
  const titleShadowRef = useRef<HTMLTextAreaElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const bodyShadowRef = useRef<HTMLTextAreaElement>(null)

  const setNavTitle = useContext(NavTitleDispatchContext)

  function autoResize(
    ref: MutableRefObject<HTMLTextAreaElement>,
    shadowRef: MutableRefObject<HTMLTextAreaElement>
  ): void {
    shadowRef.current.value = ref.current.value
    shadowRef.current.style.height = ''
    shadowRef.current.style.height = shadowRef.current.scrollHeight + 'px'
    ref.current.style.height = shadowRef.current.style.height
  }

  useEffect(() => {
    // history.replaceState({}, document.title, location.pathname)

    // Calculate proper height of title input field
    // by preset dummy data to the shadow input field
    window.addEventListener('load', () => {
      titleShadowRef.current.value = '제목'
      titleShadowRef.current.style.height =
        titleShadowRef.current.scrollHeight + 'px'
      titleRef.current.style.height = titleShadowRef.current.scrollHeight + 'px'
      titleShadowRef.current.value = title
    })

    // Auto resize the input fields' height when window is resized
    window.addEventListener('resize', () => {
      autoResize(titleRef, titleShadowRef)
      autoResize(bodyRef, bodyShadowRef)
    })
  })

  return (
    <>
      <WhiteBody />
      <NoFooter />
      <Body
        pageTitle={title.length === 0 ? '새 포스트' : title}
        titleHidden
        bodyClassName="eodiro-new-post"
      >
        <div className="title-container">
          {/* Shadow */}
          <textarea ref={titleShadowRef} className="title shadow" />
          {/* Real title field */}
          <textarea
            defaultValue={title}
            ref={titleRef}
            className="title"
            spellCheck={false}
            placeholder="제목"
            maxLength={100}
            onKeyDown={(e): void => {
              if (e.key === 'Enter') {
                e.preventDefault()
                bodyRef.current.focus()
              }
            }}
            onChange={(e): void => {
              setNavTitle(e.target.value)
              autoResize(titleRef, titleShadowRef)
            }}
          />
        </div>

        <div className="body-container">
          {/* Shadow */}
          <textarea ref={bodyShadowRef} className="body shadow" />
          {/* Real body field */}
          <textarea
            defaultValue={body}
            ref={bodyRef}
            className="body"
            spellCheck={false}
            placeholder="내용"
            onChange={(): void => {
              autoResize(bodyRef, bodyShadowRef)
            }}
          />
        </div>
        <button
          className="upload-btn"
          onClick={async (): Promise<void> => {
            // Editing mode
            if (mode === 'edit') {
              const { err } = await oneAPIClient(ApiHost.getHost(), {
                action: 'editPost',
                data: {
                  accessToken: (await Tokens.get()).accessToken,
                  postId,
                  title: titleRef.current.value,
                  body: bodyRef.current.value,
                },
              })

              if (!err) {
                alert('수정되었습니다.')

                // Update cached posts
                const cached: PostType[] = JSON.parse(
                  sessionStorage.getItem('sbpd')
                )
                // If no cached data, no update
                if (cached) {
                  const index = cached.findIndex(
                    (cachedPost) => cachedPost.id === postId
                  )
                  if (index === -1) return
                  // Only if it exists in the cache
                  const newOne = cached[index]
                  newOne.title = titleRef.current.value
                  newOne.body = bodyRef.current.value
                  cached.splice(index, 1, newOne)
                  sessionStorage.setItem('sbpd', JSON.stringify(cached))
                }

                location.replace(`/square/${router.query.boardName}/${postId}`)
                return
              }

              if (err === 'No Title') {
                alert('제목을 입력해주세요.')
                titleRef.current.focus()
              } else if (err === 'No Body') {
                alert('내용을 입력해주세요.')
                bodyRef.current.focus()
              }
            } else if (mode === 'new') {
              // Upload a new post
              const { err, data } = await oneAPIClient(ApiHost.getHost(), {
                action: 'uploadPost',
                data: {
                  // TODO: get board id from board name
                  boardID: 1,
                  title: titleRef.current.value,
                  body: bodyRef.current.value,
                  accessToken: (await Tokens.get()).accessToken,
                },
              })

              if (!err) {
                alert('업로드되었습니다.')
                location.replace(`/square/${router.query.boardName}/${data}`)
                return
              }

              if (err === 'No Title') {
                alert('제목을 입력해주세요.')
                titleRef.current.focus()
              } else if (err === 'No Body') {
                alert('내용을 입력해주세요.')
                bodyRef.current.focus()
              }
            }
          }}
        >
          업로드
        </button>
      </Body>
    </>
  )
}

export default NewPostPage

export const getServerSideProps: GetServerSideProps<NewPostPageProps> = async ({
  query,
  req,
  res,
}) => {
  const postId = Number(query['post_id'])
  let title = '',
    body = ''

  // Editing mode
  if (postId) {
    const { err, data } = await oneAPIClient(ApiHost.getHost(), {
      action: 'getPostById',
      data: {
        postID: postId,
        edit: true,
        accessToken: (await Tokens.get(req)).accessToken,
      },
    })

    if (err) {
      redirect(res, `/square/${encodeURIComponent(query.boardName as string)}`)
    }

    title = data.title
    body = data.body
  }

  return {
    props: {
      title,
      body,
      postId,
    },
  }
}
