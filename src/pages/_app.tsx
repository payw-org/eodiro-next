import { Tokens, TokensPack } from '@/api'
import '@/assets/styles/global/globalstyle.scss'
import BaseLayout from '@/layouts/BaseLayout'
import { getAuthState } from '@/modules/server/get-auth-state'
import { NextComponentType, NextPageContext } from 'next'
import App, { AppContext, AppInitialProps } from 'next/app'
import Head from 'next/head'
import React, { createContext, useContext, useState } from 'react'

type AuthProps = {
  tokens: TokensPack
  isSigned: boolean
  isAdmin: boolean
  userId: number
}
export const AuthContext = createContext({} as AuthProps)

export const useAuth = (): AuthProps => {
  const authContext = useContext(AuthContext)
  return authContext
}

export const AuthProvider: React.FC<AuthProps> = (props) => {
  const [tokens] = useState(
    props.tokens || { accessToken: undefined, refreshToken: undefined }
  )
  const [isSigned] = useState(props.isSigned)
  const [isAdmin] = useState(props.isAdmin)
  const [userId] = useState(props.userId)

  return (
    <AuthContext.Provider
      value={{
        tokens,
        isSigned,
        isAdmin,
        userId,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

interface EodiroAppInitialProps extends AppInitialProps {
  authProps: AuthProps
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
  P & AuthProps
>

export default class EodiroApp extends App<EodiroAppInitialProps> {
  static async getInitialProps({
    Component,
    ctx,
  }: EodiroAppContext): Promise<EodiroAppInitialProps> {
    const { req, res } = ctx

    const tokens = await Tokens.get(ctx.req)
    const authProps: AuthProps = {
      tokens,
      isSigned: false,
      isAdmin: false,
      userId: null,
    }

    const authState = await getAuthState({ req, res })
    authProps.isSigned = authState.isSigned
    authProps.isAdmin = authState.isAdmin
    authProps.userId = authState.userId

    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, authProps }
  }

  componentDidMount(): void {
    const currentpage = sessionStorage.getItem('currentpage')
    if (currentpage) {
      sessionStorage.setItem('lastpage', currentpage)
    }
    sessionStorage.setItem('currentpage', location.pathname)
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
          <BaseLayout>
            <Component {...pageProps} />
          </BaseLayout>
        </AuthProvider>
      </>
    )
  }
}
