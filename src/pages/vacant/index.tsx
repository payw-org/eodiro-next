import React from 'react'
import { NextPage } from 'next'
import BaseLayout from '@/layouts/BaseLayout'
import { VacantApi } from '@/api'
import dayjs from 'dayjs'
import getSemester from '@/modules/get-semester'
import ArrowBlock from '@/components/ui/ArrowBlock'
import Grid from '@/layouts/Grid'
import getBuildingName from '@/modules/cau/get-building-name'
import ServerError from '@/components/ServerError'
import { VacantBuildings } from '@/api/vacant'
import Information from '@/components/Information'
import { VacantAppIcon } from '@/components/icons'
import './VacantBuildingPage.scss'

interface VacantBuildingsPageProps {
  buildingsInfo: VacantBuildings
}

const VacantBuildingsPage: NextPage<VacantBuildingsPageProps> = ({
  buildingsInfo,
}) => {
  return (
    <>
      <Head>
        <title>빈 강의실 - 건물</title>
      </Head>
    <BaseLayout hasTopGap>
      <div id="eodiro-vacant">
        <h1 className="page-app-title">
          <VacantAppIcon className="icon" />빈 강의실
        </h1>
        {buildingsInfo && buildingsInfo.length > 0 ? (
          <Grid className="building-container">
            {buildingsInfo.map((info, i) => {
              return (
                <ArrowBlock key={info.building_number + i}>
                  <div className="building-info-wrapper">
                    <a
                      href={`/vacant/${info.building_number}`}
                      className="absolute-link"
                    />
                    <div className="building-number-and-name">
                      <h1 className="building-number">
                        {info.building_number}
                      </h1>
                      {getBuildingName(info.building_number) && (
                        <h2 className="building-name">
                          {getBuildingName(info.building_number)}
                        </h2>
                      )}
                    </div>
                    <div className="building-count">
                      <span className="empty">{info.empty}</span>
                      <span className="of"> / </span>
                      <span className="total">{info.total}</span>
                    </div>
                  </div>
                </ArrowBlock>
              )
            })}
          </Grid>
        ) : buildingsInfo && buildingsInfo.length === 0 ? (
          <Information title="오늘은 강의가 없습니다." />
        ) : (
          <ServerError />
        )}
      </div>
    </BaseLayout>
  )
}

VacantBuildingsPage.getInitialProps = async (): Promise<
  VacantBuildingsPageProps
> => {
  const now = dayjs()
  const data = await VacantApi.buildings({
    year: now.year(),
    semester: getSemester(),
    campus: '서울',
  })

  // Remove 810 and 801 buildings
  const filteredData = data
    ? data.filter((item) => {
        return item.building_number !== '810' && item.building_number !== '801'
      })
    : data

  return {
    buildingsInfo: filteredData,
  }
}

export default VacantBuildingsPage
