import { InquiryApi, InquiryData } from '@/api'
import { ArrowBlock } from '@/components/ui'
import BaseLayout from '@/layouts/BaseLayout'
import Grid from '@/layouts/Grid'
import { NextPage } from 'next'
import Head from 'next/head'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import './InquiryPage.scss'
type InquiryProps = {
  inquiries: InquiryData[]
  isAdmin: boolean
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
const InquiryPage: NextPage<InquiryProps> = ({
  inquiries: inquiries,
  isAdmin,
}) => {
  const [items, setItems] = useState(inquiries)
  const [isFetching, setIsFetching] = useState(false)
  async function loadMore(): Promise<void> {
    if (isFetching) {
      return
    }
    setIsFetching(true)
    const moreItems = await InquiryApi.inquirys(items.length)
    if (moreItems.inquiries && moreItems.inquiries.length > 0) {
      setItems([...items, ...moreItems.inquiries])
    }
    setIsFetching(false)
  }

  function isReachBottom(): boolean {
    return window.innerHeight < document.body.scrollHeight
  }
  useEffect(() => {
    if (inquiries === undefined) {
      Router.push('/inquiry/request')
    } else if (isFetching === false && !isReachBottom()) {
      loadMore()
    }
  })
  return (
    <>
      <Head>
        <title>문의</title>
      </Head>
      {inquiries === undefined ? null : (
        <BaseLayout hasTopGap pageTitle="문의" onScrollEnds={loadMore}>
          <div id="eodiro-inquiry">
            {isAdmin ? null : (
              <div className="inquiry-request-container">
                <ArrowBlock noArrow className="inquiry-request">
                  <a className="inquiry-request-link" href={'/inquiry/request'}>
                    문의하기
                  </a>
                </ArrowBlock>
              </div>
            )}
            <Grid className="inquiry-container">
              {items && items.length > 0 ? (
                items.map((item) => {
                  return (
                    <ArrowBlock key={item.id}>
                      <div className="inquiry-content">
                        <h1 className="inquiry-title">{item.title}</h1>
                        <p className="inquiry-uploaded-at inquiry-item">
                          {formatDate(new Date(item.uploaded_at))}
                        </p>
                        <p className="inquiry-answer inquiry-item">
                          {item.answer
                            ? '답변완료(' +
                              formatDate(new Date(item.answered_at)) +
                              ')'
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
      )}
    </>
  )
}
InquiryPage.getInitialProps = async (): Promise<InquiryProps> => {
  const data = await InquiryApi.inquirys(0)
  return data
}
export default InquiryPage
