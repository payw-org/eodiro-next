import { AuthApi, Tokens } from '@/api'
import { Button, LineInput } from '@/components/ui'
import BaseLayout from '@/layouts/BaseLayout'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import './SignInPage.scss'

const SignInPage: EodiroPage = () => {
  const [validating, setValidating] = useState(false)
  const [failed, setFailed] = useState(false)

  const [portalId, setPortalId] = useState('')
  const portalIdRef = useRef<HTMLInputElement>(null)
  function focusPortalId(): void {
    portalIdRef.current.focus()
  }

  const [password, setPassword] = useState('')
  const passwordRef = useRef<HTMLInputElement>(null)
  function focusPassword(): void {
    passwordRef.current.focus()
  }

  useEffect(() => {
    focusPortalId()
  }, [])

  async function signIn(): Promise<void> {
    setValidating(true)

    const tokens = await AuthApi.signIn(
      portalId.includes('@') ? portalId : portalId + '@cau.ac.kr',
      password
    )

    if (tokens) {
      // Successfully signed in
      // and fetch tokens, store it to cookie
      await Tokens.set(tokens)

      window.location.href = '/'
    } else {
      // Sign in failed
      setFailed(true)
      setValidating(false)
    }
  }

  return (
    <>
      <Head>
        <title>로그인</title>
      </Head>
      <BaseLayout centered>
        <div id="eodiro-signin">
          <h1 className="signin-header">로그인</h1>
          <div className="signin-box">
            <LineInput
              ref={portalIdRef}
              className="id"
              placeholder="포탈 아이디"
              value={portalId}
              setValue={setPortalId}
              onEnter={focusPassword}
              disabled={validating}
            />
            <LineInput
              ref={passwordRef}
              className="pw"
              type="password"
              placeholder="암호"
              value={password}
              setValue={setPassword}
              onEnter={signIn}
              disabled={validating}
            />
            {failed && (
              <p className="error">아이디 또는 암호가 잘못되었습니다.</p>
            )}
            <Button
              label={'로그인'}
              full
              className="btn"
              disabled={validating}
              onClick={signIn}
            />
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

export default SignInPage
