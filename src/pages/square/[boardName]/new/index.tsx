import { Tokens } from '@/api'
import { NavTitleDispatchContext } from '@/components/Navigation'
import NoFooter from '@/components/utils/NoFooter'
import WhiteBody from '@/components/utils/WhiteBody'
import Body from '@/layouts/BaseLayout/Body'
import ApiHost from '@/modules/api-host'
import { EodiroPage } from '@/pages/_app'
import { oneAPIClient } from '@payw/eodiro-one-api'
import { useRouter } from 'next/router'
import { MutableRefObject, useContext, useEffect, useRef } from 'react'
import './style.scss'

const NewPostPage: EodiroPage = () => {
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
    window.addEventListener('load', () => {
      titleShadowRef.current.value = '제목'
      titleShadowRef.current.style.height =
        titleShadowRef.current.scrollHeight + 'px'
      titleRef.current.style.height = titleShadowRef.current.scrollHeight + 'px'
      titleShadowRef.current.value = ''
    })

    window.addEventListener('resize', () => {
      autoResize(titleRef, titleShadowRef)
      autoResize(bodyRef, bodyShadowRef)
    })
  })

  return (
    <>
      <WhiteBody />
      <NoFooter />
      <Body pageTitle="새 포스트" titleHidden bodyClassName="eodiro-new-post">
        <div className="title-container">
          <textarea ref={titleShadowRef} className="title shadow" />
          <textarea
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
          <textarea ref={bodyShadowRef} className="body shadow" />
          <textarea
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
            const { err, data } = await oneAPIClient(ApiHost.getHost(), {
              action: 'uploadPost',
              data: {
                boardID: 0,
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
          }}
        >
          업로드
        </button>
      </Body>
    </>
  )
}

export default NewPostPage
