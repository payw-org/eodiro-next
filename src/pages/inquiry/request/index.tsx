import { InquiryApi } from '@/api'
import { Button, LineInput } from '@/components/ui'
import BaseLayout from '@/layouts/BaseLayout'
import { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import './RequestPage.scss'

const InquiryRequestPage: NextPage<void> = () => {
  const [title, setTitle] = useState('')
  const [email, setEmail] = useState('')
  const [body, setBody] = useState('')

  const [isSubmitted, setIsSbumitted] = useState(false)

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

  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()
    const result = await InquiryApi.post(title, body, email)
    if (result) {
      alert('good')
    } else {
      alert('bad')
    }
    window.location.href = '/inquiry'
  }
  const onBodyChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setBody(e.target.value)
  }
  return (
    <>
      <Head>문의하기</Head>
      <BaseLayout hasTopGap pageTitle="문의하기">
        <div id="eodiro-inquiry-request">
          <LineInput
            className="title-field"
            placeholder="제목"
            value={title}
            setValue={setTitle}
            disabled={isSubmitted}
          />
          <LineInput
            className="email-field"
            placeholder="email"
            value={email}
            setValue={setEmail}
            disabled={isSubmitted}
          />
          <textarea
            className="body-field"
            name="body"
            placeholder="문의내용"
            value={body}
            onChange={onBodyChange}
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
