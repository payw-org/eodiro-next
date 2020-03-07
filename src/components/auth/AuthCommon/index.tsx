import { AuthApi, Tokens } from '@/api'
import { Button, LineInput } from '@/components/ui'
import BaseLayout from '@/layouts/BaseLayout'
import React, { useEffect, useRef, useState } from 'react'
import './AuthCommon.scss'

type AuthCommonProps = {
  mode: 'signin' | 'join' | 'forgot'
}

const AuthCommon: React.FC<AuthCommonProps> = ({ mode }) => {
  const [validating, setValidating] = useState(false)
  const [signInFailed, setSignInFailed] = useState(false)

  const [portalId, setPortalId] = useState('')
  const [validPortalId, setValidPortalId] = useState(true)
  const portalIdRef = useRef<HTMLInputElement>(null)
  function focusPortalId(): void {
    if (!portalIdRef.current) return
    portalIdRef.current.focus()
  }
  useEffect(() => {
    focusPortalId()
  }, [])

  const [nickname, setNickname] = useState('')
  const [validNickname, setValidNickname] = useState(true)
  const nicknameRef = useRef<HTMLInputElement>(null)
  function focusNickname(): void {
    if (portalIdRef.current) return
    portalIdRef.current.focus()
  }

  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(true)
  const passwordRef = useRef<HTMLInputElement>(null)
  function focusPassword(): void {
    passwordRef.current.focus()
  }

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

      // TODO: alert a greeting message before redirection

      location.href = '/'
    } else {
      // Sign in failed
      setSignInFailed(true)
      setValidating(false)
    }
  }

  async function join(): Promise<void> {
    setValidating(true)

    const result = await AuthApi.signUp(portalId, nickname, password)
    if (!result) {
      alert('서버와 연결할 수 없습니다.')
    } else {
      if (result.portalId && result.nickname && result.password) {
        alert(
          '중앙대학교 포탈로 인증 이메일이 발송되었습니다. 인증 후 로그인하세요.'
        )
        location.href = '/signin'
      } else {
        setValidPortalId(result.portalId)
        setValidNickname(result.nickname)
        setValidPassword(result.password)

        setValidating(false)
      }
    }
  }

  return (
    <BaseLayout
      bodyClassName="eodiro-auth-common"
      centered
      pageTitle={
        mode === 'signin'
          ? '로그인'
          : mode === 'join'
          ? '회원가입'
          : mode === 'forgot'
          ? '암호 재발급'
          : ''
      }
      titleAlign="center"
    >
      <div id="eodiro-signin">
        <div className="signin-box">
          <LineInput
            ref={portalIdRef}
            className="field id"
            placeholder="포탈 아이디"
            value={portalId}
            setValue={setPortalId}
            onEnter={(): void => {
              if (nicknameRef.current) {
                nicknameRef.current.focus()
              } else if (passwordRef.current) {
                passwordRef.current.focus()
              }
            }}
            disabled={validating}
            onChangeThrottle={[
              async (value): Promise<void> => {
                if (mode !== 'join') return

                setValidPortalId(await AuthApi.validatePortalId(value))
              },
            ]}
            onFocus={(): void => {
              setSignInFailed(false)
            }}
          />

          {mode === 'join' && !validPortalId && (
            <p className="error">사용할 수 없습니다.</p>
          )}

          {mode === 'join' && (
            <LineInput
              ref={nicknameRef}
              className="field nickname"
              placeholder="닉네임"
              value={nickname}
              setValue={setNickname}
              disabled={validating}
              onChangeThrottle={[
                async (nickname): Promise<void> => {
                  setValidNickname(await AuthApi.validateNickname(nickname))
                },
              ]}
              onEnter={focusPassword}
              autoComplete="off"
            />
          )}

          {mode === 'join' && !validNickname && (
            <p className="error">사용할 수 없습니다.</p>
          )}

          {mode !== 'forgot' && (
            <LineInput
              ref={passwordRef}
              className="field pw"
              type="password"
              placeholder="암호"
              value={password}
              setValue={setPassword}
              onEnter={(): void => {
                if (mode === 'signin') {
                  signIn()
                } else if (mode === 'join') {
                  join()
                }
              }}
              disabled={validating}
              onChangeHook={(password): void => {
                if (password.match(/[ㄱ-힣]/)) {
                  setPassword('')
                  alert('암호에 한글을 사용할 수 없습니다.')
                }
              }}
              onChangeThrottle={[
                async (password): Promise<void> => {
                  if (mode === 'join') {
                    setValidPassword(await AuthApi.validatePassword(password))
                  }
                },
              ]}
              onFocus={(): void => {
                setSignInFailed(false)
              }}
            />
          )}

          {mode === 'join' && !validPassword && (
            <p className="error">암호는 8자 이상입니다.</p>
          )}

          {signInFailed && (
            <p className="error">아이디 또는 암호가 잘못되었습니다.</p>
          )}

          <Button
            label={
              mode === 'signin'
                ? '로그인'
                : mode === 'join'
                ? '회원가입'
                : mode === 'forgot'
                ? '새로 발급 받기'
                : ''
            }
            full
            className="btn"
            disabled={validating}
            onClick={(): void => {
              if (mode === 'signin') {
                signIn()
              } else if (mode === 'join') {
                join()
              }
            }}
          />
          <div className="more">
            {mode !== 'signin' && (
              <p>
                이미 가입했나요? <a href="/signin">로그인 →</a>
              </p>
            )}
            {mode === 'signin' && (
              <>
                <p className="new">
                  <b style={{ fontWeight: 600 }}>어디로</b>는 처음인가요?{' '}
                  <a href="/join" className="join">
                    회원가입 →
                  </a>
                </p>
                <p className="forgot">
                  암호를 잊었나요?{' '}
                  <a href="/forgot" className="join">
                    암호 재발급 →
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default AuthCommon
