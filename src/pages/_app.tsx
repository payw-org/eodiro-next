import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import '@/assets/styles/global/globalstyle.scss'

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
        </Head>
        <Component {...pageProps} />
      </>
    )
  }
}
