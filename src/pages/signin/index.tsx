import AuthCommon from '@/components/auth/AuthCommon'
import Head from 'next/head'
import { EodiroPage } from '../_app'

const SignInPage: EodiroPage = () => {
  return (
    <>
      <Head>
        <title>로그인</title>
      </Head>

      <AuthCommon mode="signin" />
    </>
  )
}

SignInPage.getInitialProps = ({ res, isSigned }): {} => {
  if (isSigned) {
    res.writeHead(302, {
      Location: '/',
    })
    res.end()
  }

  return {}
}

export default SignInPage
