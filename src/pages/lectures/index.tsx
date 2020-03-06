import { LecturesApi } from '@/api'
import ServerError from '@/components/ServerError'
import { ArrowBlock, LineInput, LineInputOnChangeHook } from '@/components/ui'
import BaseLayout from '@/layouts/BaseLayout'
import Grid from '@/layouts/Grid'
import getState from '@/modules/get-state'
import { Lectures } from '@payw/cau-timetable-scraper-types'
import { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import './LecturesPage.scss'

type LecturesPageProps = {
  lectures: Lectures
}

const LecturesPage: NextPage<LecturesPageProps> = ({ lectures }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [defaultLectures, setDefaultLectures] = useState(lectures)
  const [displayLectures, setDisplayLectures] = useState(lectures)
  const [, setIsFetching] = useState(false)

  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>(null)

  useEffect(() => {
    setDisplayLectures(defaultLectures)
  }, [defaultLectures, setDisplayLectures])

  const onChange: LineInputOnChangeHook = (value: string): void => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    const timeout = setTimeout(async () => {
      const query = value
      if (query.trim() === '') {
        setSearchQuery('')
        setDisplayLectures(defaultLectures)
      } else {
        const searched = await LecturesApi.search(query, {
          campus: '서울',
          offset: 0,
        })
        setDisplayLectures(searched)
      }
    }, 300)
    setSearchTimeout(timeout)
  }

  function isReachBottom(): boolean {
    return window.innerHeight < document.body.scrollHeight
  }

  async function loadMore(): Promise<void> {
    if (!lectures) {
      return
    }

    const searchQuery = getState<string>(setSearchQuery)
    const isFetching = getState<boolean>(setIsFetching)
    const defaultLectures = getState<Lectures>(setDefaultLectures)
    const displayLectures = getState<Lectures>(setDisplayLectures)

    if (isFetching) {
      return
    }

    // Set isFetching flag to true
    setIsFetching(true)

    let moreLectures: Lectures

    if (searchQuery.length === 0) {
      // Load more default lectures
      moreLectures = await LecturesApi.lectures({
        campus: '서울',
        offset: defaultLectures.length,
      })

      setDefaultLectures([...defaultLectures, ...moreLectures])
    } else {
      moreLectures = await LecturesApi.search(searchQuery, {
        campus: '서울',
        offset: displayLectures.length,
      })

      setDisplayLectures([...displayLectures, ...moreLectures])
    }

    // Set isFetching flag to false
    setIsFetching(false)

    if (moreLectures.length === 0) {
      // If there are no more data to load
      // stop the function
      return
    } else if (!isReachBottom()) {
      // If the data don't reach to bottom
      // load more to make the page scrollable
      loadMore()
    }
  }

  return (
    <>
      <Head>
        <title>강의 검색</title>
      </Head>
      <BaseLayout pageTitle="강의 검색" onScrollEnds={loadMore}>
        <div id="eodiro-lectures">
          {displayLectures ? (
            <>
              <LineInput
                value={searchQuery}
                setValue={setSearchQuery}
                className="search-field"
                placeholder="강의명, 학과, 교수, 강의실 등"
                type="search"
                onChangeHook={onChange}
              />
              <Grid className="lecture-container">
                {displayLectures.map((lecture, i) => {
                  return (
                    <ArrowBlock noArrow flat key={i} className="lecture-item">
                      <div className="li-content">
                        <div className="name-and-code">
                          <div>
                            <h1 className="name">{lecture.name}</h1>
                            {lecture.professor && (
                              <p className="professor info-item">
                                {lecture.professor}
                              </p>
                            )}
                          </div>
                          <p className="code">{lecture.code}</p>
                        </div>
                        {(lecture.college || lecture.major) && (
                          <p className="major">
                            {lecture.college + ' '}
                            {lecture.major}
                          </p>
                        )}
                        {lecture.credit && (
                          <p className="credit">{lecture.credit}학점</p>
                        )}
                        {lecture.schedule && lecture.schedule !== '/' && (
                          <p className="schedule info-item">
                            {lecture.schedule}
                          </p>
                        )}
                        {lecture.note && (
                          <div className="note">
                            <div className="data">
                              <h3>비고</h3>
                              <p>{lecture.note}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </ArrowBlock>
                  )
                })}
              </Grid>
            </>
          ) : (
            <ServerError />
          )}
        </div>
      </BaseLayout>
    </>
  )
}

LecturesPage.getInitialProps = async (): Promise<LecturesPageProps> => {
  const lectures = await LecturesApi.lectures({
    campus: '서울',
    offset: 0,
  })

  return {
    lectures,
  }
}

export default LecturesPage
