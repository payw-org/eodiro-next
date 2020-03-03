import '@/assets/styles/global/globalstyle.scss'
import App from 'next/app'
import Head from 'next/head'
import React from 'react'

export default class EodiroApp extends App {
  public render(): JSX.Element {
    const { Component, pageProps } = this.props

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
        <Component {...pageProps} />
      </>
    )
  }
}
