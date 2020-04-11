import {
  CafeteriaAppIcon,
  LecturesAppIcon,
  OpensourceAppIcon,
  SquareAppIcon,
  VacantAppIcon,
} from '@/components/global/icons'
import Body from '@/layouts/BaseLayout/Body'
import Grid from '@/layouts/Grid'
import { ColorIcon } from '@/types'
import classNames from 'classnames'
import { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import './index.scss'

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
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <>
      <Head>
        <title>어디로</title>
      </Head>
      <Body pageTitle="어디로" titleHidden centered>
        <div id="eodiro-home">
          <h1 className="header overlay-sentinel-spot title-sentinel-spot">
            <div
              className="text-wrapper"
              onAnimationEnd={() => {
                setIsLoaded(true)
              }}
            >
              <span className={classNames('name', { shadowed: isLoaded })}>
                어디로
              </span>
            </div>
          </h1>
          <p className="manifesto">
            <span className="text">중앙대 학생들만을 위한 특별한 서비스</span>
          </p>
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
              <HomeFeatureBox
                title="빼빼로 광장"
                to="/square"
                Icon={SquareAppIcon}
              />
              <HomeFeatureBox
                title="오픈 소스"
                to="/opensource"
                Icon={OpensourceAppIcon}
              />
            </Grid>
          </div>
        </div>
      </Body>
    </>
  )
}

export default HomePage
