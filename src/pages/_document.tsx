import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    const devOptions = {}
    const useProdApi = process.env.npm_config_useProdApi === 'true'

    if (useProdApi) {
      devOptions['data-use-prod-api'] = ''
    }

    return (
      <Html lang="ko" {...devOptions}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
