import React from 'react'
import BaseLayout from '@/layouts/BaseLayout'
import '@/assets/styles/pages/home.scss'
import Grid from '@/layouts/Grid'
import { ColorIcon } from '@/types'
import CafeteriaIconColor from '@/components/icons/CafeteriaIconColor'
import VacantIconColor from '@/components/icons/VacantIconColor'
import LecturesIconColor from '@/components/icons/LecturesIconColor'
import SquareIconColor from '@/components/icons/SquareIconColor'
import OpensourceIconColor from '@/components/icons/OpensourceIconColor'
import Link from 'next/link'

type HomeFeatureBoxProps = {
  title: string
  to: string
  Icon: ColorIcon
}

const HomeFeatureBox: React.FC<HomeFeatureBoxProps> = ({ title, to, Icon }) => {
  return (
    <button className="feature-box">
      <Icon className="icon" />
      <h2 className="feature-name">{title}</h2>
      {/* <Link href={to}> */}
      <a className="absolute-link" href={to} />
      {/* </Link> */}
    </button>
  )
}

const Home: React.FC = () => {
  return (
    <BaseLayout>
      <div id="eodiro-home">
        <h1 className="header">어디로</h1>
        <p className="manifesto">중앙대 학생들만을 위한 특별한 서비스</p>
        <div className="features">
          <Grid>
            <HomeFeatureBox
              title="빈 강의실"
              to="/vacant"
              Icon={VacantIconColor}
            />
            <HomeFeatureBox title="강의 검색" to="/" Icon={LecturesIconColor} />
            <HomeFeatureBox
              title="학식 메뉴"
              to="/"
              Icon={CafeteriaIconColor}
            />
            <HomeFeatureBox title="빼빼로 광장" to="/" Icon={SquareIconColor} />
            <HomeFeatureBox
              title="오픈 소스"
              to="/"
              Icon={OpensourceIconColor}
            />
          </Grid>
        </div>
      </div>
    </BaseLayout>
  )
}

export default Home
