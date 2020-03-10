import Body from '@/layouts/BaseLayout/Body'
import { NextPage } from 'next'
import React from 'react'

const OpenSourcePage: NextPage = () => {
  return (
    <Body hasTopGap pageTitle="오픈소스">
      <div id="eodiro-opensource"></div>
    </Body>
  )
}

OpenSourcePage.getInitialProps = async (ctx) => {
  return {}
}

export default OpenSourcePage
