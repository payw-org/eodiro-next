import { InquiryApi, InquiryData } from '@/api'
import { ArrowBlock } from '@/components/ui'
import BaseLayout from '@/layouts/BaseLayout'
import Grid from '@/layouts/Grid'
import { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

type InquiryProps = {
  inquiries: InquiryData[]
}
function formatDate(date): string {
  return (
    date.getFullYear() +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getDate()).slice(-2) +
    ' ' +
    ('0' + date.getHours()).slice(-2) +
    ':' +
    ('0' + date.getMinutes()).slice(-2) +
    ':' +
    ('0' + date.getSeconds()).slice(-2)
  )
}

const InquiryPage: NextPage<InquiryProps> = ({ inquiries: inquiries }) => {
  return (
    <>
      <Head>
        <title>문의</title>
      </Head>
      <BaseLayout hasTopGap>
        <div id="eodiro-inquiry">
          <h1 className="page-app-title">문의</h1>
          <Grid className="inquiry-container">
            {inquiries && inquiries.length > 0 ? (
              inquiries.map((inquiry) => {
                return (
                  <ArrowBlock key={inquiry.id} className="inquiry-item">
                    <div className="li-content">
                      <h1 className="inquiry-title">{inquiry.title}</h1>
                      <p>{formatDate(new Date(inquiry.uploaded_at))}</p>
                      <p>
                        {inquiry.answer
                          ? '답변완료( ' +
                            formatDate(new Date(inquiry.answered_at)) +
                            ' )'
                          : '답변대기 중'}
                      </p>
                    </div>
                  </ArrowBlock>
                )
              })
            ) : (
              <p className="no-inquirys">문의 내역이 없습니다.</p>
            )}
          </Grid>
        </div>
      </BaseLayout>
    </>
  )
}
InquiryPage.getInitialProps = async (): Promise<InquiryProps> => {
  const data = await InquiryApi.inquirys()
  return {
    inquiries: data,
  }
}
export default InquiryPage
