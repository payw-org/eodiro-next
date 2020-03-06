import { AuthApi, Tokens, TokensPack } from '@/api'
import '@/assets/styles/global/globalstyle.scss'
import EodiroHttpCookie from '@/modules/eodiro-http-cookie'
import dayjs from 'dayjs'
import App, { AppContext, AppInitialProps } from 'next/app'
import Head from 'next/head'
import React, { createContext, useState } from 'react'

type AuthContextProps = {
  tokens: TokensPack
  isSigned: boolean
}
export const AuthContext = createContext({} as AuthContextProps)

type AuthProviderProps = {
  tokensInit: TokensPack
  signedInit: boolean
}
export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  tokensInit,
  signedInit,
}) => {
  const [tokens] = useState(
    tokensInit || { accessToken: undefined, refreshToken: undefined }
  )
  const [isSigned] = useState(signedInit)

  return (
    <AuthContext.Provider
      value={{
        tokens,
        isSigned,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

interface EodiroAppInitialProps extends AppInitialProps {
  authProps: AuthProviderProps
}
export default class EodiroApp extends App<EodiroAppInitialProps> {
  static async getInitialProps({
    Component,
    ctx,
  }: AppContext): Promise<EodiroAppInitialProps> {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const { req, res } = ctx

    const tokens = await Tokens.get(ctx.req)
    const authProps: AuthProviderProps = {
      tokensInit: tokens,
      signedInit: false,
    }

    // Verify token
    if (tokens.accessToken) {
      const isSigned = await AuthApi.isSigned(ctx.req)

      if (isSigned) {
        authProps.signedInit = true
      } else {
        const newTokens = await AuthApi.refresh(ctx.req)
        if (newTokens) {
          await Tokens.set(newTokens, { req, res })
          authProps.signedInit = true
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
