import { Button, LineInput } from '@/components/ui'
import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'

const TestPage: NextPage = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setInterval(() => {
      let c
      setCount((prevCount) => {
        c = prevCount
        console.log('update c')
        return prevCount + 1
      })
      console.log(c)
    }, 500)
  }, [])

  return (
    <>
      <h1>Heading 1 Heading 1 Heading 1 Heading 1 Heading 1</h1>
      <h2>Heading 2 Heading 2 Heading 2 Heading 2 Heading 2</h2>
      <h3>Heading 3 Heading 3 Heading 3 Heading 3 Heading 3</h3>
      <p>Body Body Body Body Body</p>
      <LineInput />
      <Button label="Button" />
      <p>{count}</p>
      <Button label="Button" />
    </>
  )
}

export default TestPage
