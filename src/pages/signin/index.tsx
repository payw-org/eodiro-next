import { LineInput } from '@/components/ui'
import BaseLayout from '@/layouts/BaseLayout'
import { NextPage } from 'next'
import Head from 'next/head'
import './SignInPage.scss'

const SignInPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>로그인</title>
      </Head>
      <BaseLayout hasTopGap={false} centered>
        <div id="eodiro-signin">
          <h1 className="signin-header">로그인</h1>
          <div className="signin-box">
            <LineInput className="id" placeholder="포탈 아이디" />
            <LineInput className="pw" type="password" placeholder="암호" />
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

export default SignInPage
