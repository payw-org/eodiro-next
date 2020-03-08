import BaseLayout from '@/layouts/BaseLayout'
import { NextPage } from 'next'
import React from 'react'

const OpenSourcePage: NextPage = () => {
  return (
    <BaseLayout hasTopGap pageTitle="오픈소스">
      <div id="eodiro-opensource"></div>
    </BaseLayout>
  )
}

OpenSourcePage.getInitialProps = async (ctx) => {
  return {}
}

export default OpenSourcePage
