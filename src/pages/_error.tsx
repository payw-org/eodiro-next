import BaseLayout from '@/layouts/BaseLayout'
import { NextPage } from 'next'
import React from 'react'
import './ErrorPage.scss'

type ErrorPageProps = {
  statusCode: number
}

const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode }) => {
  return (
    <BaseLayout pageTitle={statusCode.toString()} titleHidden centered>
      <div id="error-page">
        <h1 className="status-code">{statusCode}</h1>
        <p className="manifesto">페이지를 찾을 수 없습니다.</p>
      </div>
    </BaseLayout>
  )
}

ErrorPage.getInitialProps = async ({ res, err }): Promise<ErrorPageProps> => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404

  return {
    statusCode,
  }
}

export default ErrorPage
