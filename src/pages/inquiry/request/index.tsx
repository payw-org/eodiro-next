import { InquiryApi } from '@/api'
import BaseLayout from '@/layouts/BaseLayout'
import { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'

const InquiryRequestPage: NextPage<void> = () => {
  const [formData, setFormData] = useState({ title: '', body: '', email: '' })
  const { title, body, email } = formData
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
  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }
  return (
    <>
      <Head>문의하기</Head>
      <BaseLayout hasTopGap>
        <div id="eodiro-inquiry-request">
          <h1 className="page-app-title">문의하기</h1>
          <form onSubmit={handleFormSubmit}>
            <input
              name="title"
              value={title}
              onChange={onChange}
              className="title-field"
              placeholder="제목"
            />
            <input
              name="email"
              value={email}
              onChange={onChange}
              className="email-field"
              placeholder="이메일"
            />
            <textarea name="body" value={body} onChange={onChange}></textarea>
            <input type="submit" value="제출하기" />
          </form>
        </div>
      </BaseLayout>
    </>
  )
}
export default InquiryRequestPage
