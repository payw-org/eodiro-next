import React from 'react'
import App, { AppInitialProps } from 'next/app'
import Head from 'next/head'
import { NextPageContext } from 'next'
import ApiHost from '@/modules/api-host'
import '@/assets/styles/global/globalstyle.scss'

export default class EodiroApp extends App {
  static async getInitialProps(appContext): Promise<AppInitialProps> {
    const appProps = await App.getInitialProps(appContext)
    const { ctx }: { ctx: NextPageContext } = appContext
    const host = ctx?.req?.headers?.host
    appProps.pageProps.host = host

    return { ...appProps }
  }

  componentDidMount(): void {
    // Set api host on client side
    const { pageProps } = this.props
    ApiHost.setHost(pageProps.host)
  }

  public render(): JSX.Element {
    const { Component, pageProps } = this.props

    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <Component {...pageProps} />
      </>
    )
  }
}
