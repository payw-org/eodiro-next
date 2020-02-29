import React from 'react'
import { NextPage } from 'next'
import BaseLayout from '@/layouts/BaseLayout'
import { VacantApi } from '@/api'
import dayjs from 'dayjs'
import getSemester from '@/modules/get-semester'
import ArrowBlock from '@/components/ui/ArrowBlock'
import Grid from '@/layouts/Grid'
import './vacant.scss'
import getBuildingName from '@/modules/cau/get-building-name'
import ServerError from '@/components/ServerError'
import { VacantBuildings } from '@/api/vacant'

interface VacantBuildingsPageProps {
  buildingsInfo: VacantBuildings
}

const VacantBuildingsPage: NextPage<VacantBuildingsPageProps> = ({
  buildingsInfo,
}) => {
  return (
    <BaseLayout hasTopGap>
      <div id="eodiro-vacant">
        <h1 className="title">🚪 빈 강의실</h1>
        {buildingsInfo ? (
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
                      <h2 className="building-name">
                        {getBuildingName(info.building_number)}
                      </h2>
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

  return {
    buildingsInfo: data,
  }
}

export default VacantBuildingsPage
