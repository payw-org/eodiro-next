import { LecturesApi } from '@/api'
import ServerError from '@/components/ServerError'
import { ArrowBlock, LineInput, LineInputOnChangeHook } from '@/components/ui'
import InfiniteScrollContainer from '@/components/utils/InfiniteScrollContainer'
import Body from '@/layouts/BaseLayout/Body'
import Grid from '@/layouts/Grid'
import getState from '@/modules/get-state'
import { Lectures } from '@payw/cau-timetable-scraper-types'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import './LecturesPage.scss'

interface LecturesPageProps {
  lectures: Lectures
}

const LecturesContent: React.FC<LecturesPageProps> = ({ lectures }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [defaultLectures, setDefaultLectures] = useState(lectures)
  const [displayLectures, setDisplayLectures] = useState(lectures)

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

  const containerRef = useRef<HTMLDivElement>(null)

  async function loadMore(): Promise<boolean> {
    if (!lectures) {
      return false
    }

    const searchQuery = await getState<string>(setSearchQuery)
    const defaultLectures = await getState<Lectures>(setDefaultLectures)
    const displayLectures = await getState<Lectures>(setDisplayLectures)

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

    if (moreLectures.length === 0) {
      return false
    }

    return true
  }

  return (
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
          <div ref={containerRef}>
            <InfiniteScrollContainer strategy={loadMore}>
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
            </InfiniteScrollContainer>
          </div>
        </>
      ) : (
        <ServerError />
      )}
    </div>
  )
}

const LecturesPage: NextPage<LecturesPageProps> = (props) => {
  return (
    <>
      <Head>
        <title>강의 검색</title>
      </Head>
      <Body pageTitle="강의 검색">
        <LecturesContent {...props} />
      </Body>
    </>
  )
}

export default LecturesPage

export const getServerSideProps: GetServerSideProps = async () => {
  const lectures = await LecturesApi.lectures({
    campus: '서울',
    offset: 0,
  })

  return {
    props: {
      lectures,
    },
  }
}
