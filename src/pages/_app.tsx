import { AuthApi, Tokens, TokensPack } from '@/api'
import '@/assets/styles/global/globalstyle.scss'
import EodiroHttpCookie from '@/modules/eodiro-http-cookie'
import dayjs from 'dayjs'
import { NextComponentType, NextPageContext } from 'next'
import App, { AppContext, AppInitialProps } from 'next/app'
import Head from 'next/head'
import React, { createContext, useState } from 'react'

type AuthContextProps = {
  tokens: TokensPack
  isSigned: boolean
  isAdmin: boolean
}
export const AuthContext = createContext({} as AuthContextProps)

type AuthProviderProps = {
  tokensInit: TokensPack
  isSignedInit: boolean
  isAdminInit: boolean
}
export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  tokensInit,
  isSignedInit,
  isAdminInit,
}) => {
  const [tokens] = useState(
    tokensInit || { accessToken: undefined, refreshToken: undefined }
  )
  const [isSigned] = useState(isSignedInit)
  const [isAdmin] = useState(isAdminInit)

  return (
    <AuthContext.Provider
      value={{
        tokens,
        isSigned,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

interface EodiroAppInitialProps extends AppInitialProps {
  authProps: AuthProviderProps
}

interface EodiroPageContext extends NextPageContext {
  isSigned: boolean
  isAdmin: boolean
}

interface EodiroAppContext extends AppContext {
  ctx: EodiroPageContext
}

export type EodiroPage<P = {}, IP = P> = NextComponentType<
  EodiroPageContext,
  IP,
  P
>

export default class EodiroApp extends App<EodiroAppInitialProps> {
  static async getInitialProps({
    Component,
    ctx,
  }: EodiroAppContext): Promise<EodiroAppInitialProps> {
    const { req, res } = ctx

    const tokens = await Tokens.get(ctx.req)
    const authProps: AuthProviderProps = {
      tokensInit: tokens,
      isSignedInit: false,
      isAdminInit: false,
    }

    ctx.isSigned = false
    ctx.isAdmin = false

    // Verify token
    if (tokens.accessToken) {
      const authCheck = await AuthApi.isSigned(ctx.req)

      if (authCheck.isSigned) {
        authProps.isSignedInit = authCheck.isSigned
        authProps.isAdminInit = authCheck.isAdmin
        ctx.isSigned = authCheck.isSigned
        ctx.isAdmin = authCheck.isAdmin
      } else {
        const newTokens = await AuthApi.refresh(ctx.req)

        if (newTokens) {
          await Tokens.set(newTokens, { req, res })
          const authCheck = await AuthApi.isSigned(ctx.req)
          authProps.isSignedInit = authCheck.isSigned
          authProps.isAdminInit = authCheck.isAdmin
          ctx.isSigned = authCheck.isSigned
          ctx.isAdmin = authCheck.isAdmin
        } else {
          // Clear tokens
          await EodiroHttpCookie.set(
            [
              {
                expires: dayjs('1970-01-01')
                  .toDate()
                  .toUTCString(),
                name: 'accessToken',
                value: '',
              },
              {
                expires: dayjs('1970-01-01')
                  .toDate()
                  .toUTCString(),
                name: 'refreshToken',
                value: '',
              },
            ],
            {
              req,
              res,
            }
          )
        }
      }
    }

    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, authProps }
  }

  public render(): JSX.Element {
    const { Component, pageProps, authProps } = this.props

    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta
            property="og:image"
            content="https://eodiro.com/open-graph/open_graph.png"
          />
        </Head>
        <AuthProvider {...authProps}>
          <Component {...pageProps} />
        </AuthProvider>
      </>
    )
  }
}
