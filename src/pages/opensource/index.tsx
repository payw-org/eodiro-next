import React from 'react'
import { NextPage } from 'next'
import BaseLayout from '@/layouts/BaseLayout'

const OpenSourcePage: NextPage = () => {
  return (
    <BaseLayout hasTopGap>
      <div id="eodiro-opensource">
        <h1>Open Source</h1>
      </div>
    </BaseLayout>
  )
}

OpenSourcePage.getInitialProps = async (ctx) => {
  return {}
}

export default OpenSourcePage
