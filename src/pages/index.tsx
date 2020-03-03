import React, { useState, useEffect } from 'react'
import BaseLayout from '@/layouts/BaseLayout'
import { NextPage } from 'next'
import Head from 'next/head'
import Grid from '@/layouts/Grid'
import { ColorIcon } from '@/types'
import {
  CafeteriaAppIcon,
  VacantAppIcon,
  LecturesAppIcon,
  SquareAppIcon,
  OpensourceAppIcon,
} from '@/components/icons'
import './HomePage.scss'

type HomeFeatureBoxProps = {
  title: string
  to: string
  Icon: ColorIcon
}

const HomeFeatureBox: React.FC<HomeFeatureBoxProps> = ({ title, to, Icon }) => {
  return (
    <button className="feature-box">
      <div className="wrapper">
        <Icon className="icon" />
        <h2 className="feature-name">{title}</h2>
        <a className="absolute-link" href={to} />
      </div>
    </button>
  )
}

const HomePage: NextPage = () => {
  const emojiList = [
    '😎',
    '🧐',
    '🤓',
    '😀',
    '🥳',
    '😍',
    '😙',
    '😪',
    '🤔',
    '🤪',
    '😝',
    '🤣',
    '🥰',
  ]
  const [emojiIndex, setEmojiIndex] = useState(0)

  useEffect(() => {
    let i = emojiIndex
    const timeout = setInterval(() => {
      i = (i + 1) % emojiList.length
      setEmojiIndex(i)
    }, 500)

    return (): void => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      <Head>
        <title>어디로</title>
      </Head>
      <BaseLayout hasTopGap={false}>
        <div id="eodiro-home">
          <h1 className="header">
            <span className="name">어디로</span> {emojiList[emojiIndex]}
          </h1>
          <p className="manifesto">중앙대 학생들만을 위한 특별한 서비스</p>
          <div className="features">
            <Grid>
              <HomeFeatureBox
                title="빈 강의실"
                to="/vacant"
                Icon={VacantAppIcon}
              />
              <HomeFeatureBox
                title="강의 검색"
                to="/lectures"
                Icon={LecturesAppIcon}
              />
              <HomeFeatureBox
                title="학식 메뉴"
                to="/cafeteria"
                Icon={CafeteriaAppIcon}
              />
              <HomeFeatureBox title="빼빼로 광장" to="/" Icon={SquareAppIcon} />
              <HomeFeatureBox
                title="오픈 소스"
                to="/opensource"
                Icon={OpensourceAppIcon}
              />
            </Grid>
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

export default HomePage
