import { CafeteriaApi, CafeteriaMenus } from '@/api'
import { ArrowIcon } from '@/components/icons'
import Information from '@/components/Information'
import ServerError from '@/components/ServerError'
import { ArrowBlock } from '@/components/ui'
import BaseLayout from '@/layouts/BaseLayout'
import Grid from '@/layouts/Grid'
import { Restaurant } from '@payw/cau-cafeteria-menus-scraper-types'
import dayjs, { Dayjs } from 'dayjs'
import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import './CafeteriaPage.scss'

type CafeteriaPageProps = {
  menus: CafeteriaMenus
}

function createDateString(now: Dayjs): string {
  return `${now.year()}년 ${now.month() + 1}월 ${now.date()}일`
}

const TimeGroup: React.FC<{
  timeGroup: Restaurant[]
}> = ({ timeGroup }) => {
  return (
    <Grid>
      {timeGroup.length > 0 ? (
        timeGroup.map((restaurant) => {
          return (
            <ArrowBlock flat noArrow key={restaurant.name}>
              <div>
                <h2 className="restaurant-name">{restaurant.name}</h2>
                {restaurant.meals.length > 0 ? (
                  restaurant.meals.map((meal) => {
                    return (
                      <div className="meal" key={meal.title}>
                        <h3 className="meal-title">{meal.title}</h3>
                        <div className="food-container">
                          {meal.menus.map((food) => {
                            return (
                              <div className="food-name" key={food}>
                                {food}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="no-menus">학식이 없습니다.</p>
                )}
              </div>
            </ArrowBlock>
          )
        })
      ) : (
        <Information title="정보가 없습니다." />
      )}
    </Grid>
  )
}

const CafeteriaPage: NextPage<CafeteriaPageProps> = ({ menus }) => {
  const [now, setNow] = useState(dayjs())
  const [todayMenus, setTodayMenus] = useState(menus)

  useEffect(() => {
    ;(async (): Promise<void> => {
      const newMenus = await CafeteriaApi.menus({
        date: now.format('YYYY-MM-DD'),
      })

      setTodayMenus(newMenus)
    })()
  }, [now])

  return (
    <BaseLayout hasTopGap pageTitle="학식 메뉴">
      <div id="eodiro-cafeteria">
        {todayMenus ? (
          <>
            <div className="date-container">
              <button
                className="date-change-btn previous"
                onClick={(): void => {
                  setNow(now.subtract(1, 'd'))
                }}
              >
                <ArrowIcon direction="left" fill="#31a8ff" />
              </button>
              <p className="date">{createDateString(now)}</p>
              <button
                className="date-change-btn next"
                onClick={(): void => {
                  setNow(now.add(1, 'd'))
                }}
              >
                <ArrowIcon fill="#31a8ff" />
              </button>
            </div>

            <div>
              <h1 className="time">조식</h1>
              <TimeGroup timeGroup={todayMenus.breakfast} />

              <h1 className="time">중식</h1>
              <TimeGroup timeGroup={todayMenus.lunch} />

              <h1 className="time">석식</h1>
              <TimeGroup timeGroup={todayMenus.supper} />
            </div>
          </>
        ) : (
          <ServerError />
        )}
      </div>
    </BaseLayout>
  )
}

CafeteriaPage.getInitialProps = async (): Promise<CafeteriaPageProps> => {
  const menus = await CafeteriaApi.menus({})

  return {
    menus,
  }
}

export default CafeteriaPage
