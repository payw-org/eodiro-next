import { InquiryApi, InquiryData } from '@/api'
import { ArrowBlock } from '@/components/ui'
import BaseLayout from '@/layouts/BaseLayout'
import Grid from '@/layouts/Grid'
import { NextPage } from 'next'
import Head from 'next/head'

type InquiryProps = {
  inquirys: InquiryData[]
}

const InquiryPage: NextPage<InquiryProps> = ({ inquirys }) => {
  return (
    <>
      <Head>
        <title>문의</title>
      </Head>
      <BaseLayout hasTopGap>
        <div id="eodiro-inquiry">
          <h1 className="page-app-title">문의</h1>
          <Grid className="inquiry-container">
            {inquirys && inquirys.length > 0 ? (
              inquirys.map((inquiry, i) => {
                return (
                  <ArrowBlock key={inquiry.id} className="inquiry-item">
                    <div className="li-content">
                      <h1 className="inquiry-title">{inquiry.title}</h1>
                      <p>{inquiry.uploaded_at}</p>
                      <p>
                        {inquiry.answer
                          ? '답변완료( ' + inquiry.answered_at + ' )'
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
    inquirys: data,
  }
}
export default InquiryPage
