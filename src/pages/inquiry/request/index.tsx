import { InquiryApi } from '@/api'
import { Button, LineInput } from '@/components/ui'
import BaseLayout from '@/layouts/BaseLayout'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import './RequestPage.scss'

const InquiryRequestPage: NextPage<void> = () => {
  const [title, setTitle] = useState('')
  const [email, setEmail] = useState('')
  const [body, setBody] = useState('')
  const [isSubmitted, setIsSbumitted] = useState(false)

  const titleRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  function focusTitle(): void {
    titleRef.current.focus()
  }

  function focusEmail(): void {
    emailRef.current.focus()
  }

  function focusBody(): void {
    bodyRef.current.focus()
  }
  async function submit(): Promise<void> {
    if (isSubmitted) {
      return
    }
    setIsSbumitted(true)
    const result = await InquiryApi.post(title, body, email)
    if (result) {
      window.location.href = '/inquiry'
      alert('Submitted')
    } else {
      setIsSbumitted(false)
      alert('Error')
    }
  }
  useEffect(() => {
    focusTitle()
  }, [])

  return (
    <>
      <Head>
        <title>문의하기</title>
      </Head>
      <BaseLayout hasTopGap pageTitle="문의하기">
        <div id="eodiro-inquiry-request">
          <LineInput
            ref={titleRef}
            className="title-field"
            placeholder="제목"
            value={title}
            setValue={setTitle}
            onEnter={focusEmail}
            disabled={isSubmitted}
          />
          <LineInput
            ref={emailRef}
            className="email-field"
            placeholder="email"
            value={email}
            setValue={setEmail}
            onEnter={focusBody}
            disabled={isSubmitted}
          />
          <textarea
            ref={bodyRef}
            className="body-field"
            name="body"
            placeholder="문의내용"
            value={body}
            onChange={(e): void => {
              setBody(e.target.value)
            }}
            disabled={isSubmitted}
          ></textarea>
          <Button
            full
            label={'제출'}
            className="submit-button"
            onClick={submit}
            disabled={isSubmitted}
          />
        </div>
      </BaseLayout>
    </>
  )
}
export default InquiryRequestPage
