import { LineInput } from '@/components/ui'
import dayjs from 'dayjs'
import { NextPage } from 'next'
import React from 'react'

const TestPage: NextPage = () => {
  return (
    <>
      <h1>Heading 1 Heading 1 Heading 1 Heading 1 Heading 1</h1>
      <h2>Heading 2 Heading 2 Heading 2 Heading 2 Heading 2</h2>
      <h3>Heading 3 Heading 3 Heading 3 Heading 3 Heading 3</h3>
      <p>Body Body Body Body Body</p>
      <LineInput />
    </>
  )
}

TestPage.getInitialProps = ({ res, req }): {} => {
  let value = `test-cookie=;HttpOnly;Expires=${dayjs()
    .add(13, 'd')
    .toDate()
    .toUTCString()};`
  if (req.socket.encrypted) {
    value += 'Secure;'
  }
  res.setHeader('Set-Cookie', value)
  console.log('set cookie')
  return {
    test: 'test',
  }
}

export default TestPage
