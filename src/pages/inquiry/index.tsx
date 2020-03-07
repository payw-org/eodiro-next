import { InquiryApi, InquiryData } from '@/api'
import { ArrowBlock } from '@/components/ui'
import BaseLayout from '@/layouts/BaseLayout'
import Grid from '@/layouts/Grid'
import { useStateRef } from '@/modules/use-state-ref'
import Head from 'next/head'
import Router from 'next/router'
import React, { useEffect } from 'react'
import { EodiroPage } from '../_app'
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
const InquiryPage: EodiroPage<InquiryProps> = ({
  inquiries: inquiries,
  isAdmin,
}) => {
  const [items, setItems, itemsRef] = useStateRef(inquiries)
  const [isFetching, setIsFetching, isFetchRef] = useStateRef(false)

  function isReachBottom(): boolean {
    return window.innerHeight < document.body.scrollHeight
  }

  async function loadMore(): Promise<void> {
    if (isFetchRef.current) {
      return
    }
    setIsFetching(true)
    const moreItems = await InquiryApi.inquiries(itemsRef.current.length)
    if (moreItems.inquiries && moreItems.inquiries.length > 0) {
      setItems([...itemsRef.current, ...moreItems.inquiries])
    }
    setIsFetching(false)
  }

  useEffect(() => {
    if (inquiries === undefined) {
      Router.push('/inquiry/request')
    } else if (isFetching === false && !isReachBottom()) {
      loadMore()
    }
  }, [itemsRef.current])
  return (
    <>
      <Head>
        <title>문의</title>
      </Head>
      {inquiries === undefined ? null : (
        <BaseLayout hasTopGap pageTitle="문의" onScrollEnds={loadMore}>
          <div id="eodiro-inquiry">
            <Grid className="inquiry-container">
              {isAdmin ? null : (
                <ArrowBlock noArrow className="request-btn">
                  <a href={'/inquiry/request'}>
                    <h1 className="request-content">+</h1>
                  </a>
                </ArrowBlock>
              )}

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
                <p className="no-inquiries">문의 내역이 없습니다.</p>
              )}
            </Grid>
          </div>
        </BaseLayout>
      )}
    </>
  )
}
InquiryPage.getInitialProps = async (ctx): Promise<InquiryProps> => {
  const data = await InquiryApi.inquiries(0, null, ctx.req)
  return data
}
export default InquiryPage
