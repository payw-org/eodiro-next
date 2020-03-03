import { LecturesApi } from '@/api'
import { LecturesAppIcon } from '@/components/icons'
import { ArrowBlock, LineInput, LineInputOnChangeHook } from '@/components/ui'
import BaseLayout from '@/layouts/BaseLayout'
import Grid from '@/layouts/Grid'
import { CEM } from '@/modules/custom-event-manager'
import { useStateRef } from '@/modules/use-state-ref'
import { Lectures } from '@payw/cau-timetable-scraper-types'
import { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import './LecturesPage.scss'

type LecturesPageProps = {
  lectures: Lectures
}

const LecturesPage: NextPage<LecturesPageProps> = ({ lectures }) => {
  const [searchQuery, setSearchQuery, searchQueryRef] = useStateRef('')
  const [defaultLectures, setDefaultLectures, defaultLecturesRef] = useStateRef(
    lectures
  )
  const [displayLectures, setDisplayLectures, displayLecturesRef] = useStateRef(
    lectures
  )
  const [isFetching, setIsFetching, isFetchingRef] = useStateRef(false)

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
    if (isFetchingRef.current) {
      return
    }

    // Set isFetching flag
    setIsFetching(true)

    if (searchQueryRef.current.length === 0) {
      // Load more default lectures
      const moreLectures = await LecturesApi.lectures({
        campus: '서울',
        offset: defaultLecturesRef.current.length,
      })

      setDefaultLectures([...defaultLecturesRef.current, ...moreLectures])
    } else {
      const moreLectures = await LecturesApi.search(searchQueryRef.current, {
        campus: '서울',
        offset: displayLecturesRef.current.length,
      })

      setDisplayLectures([...displayLecturesRef.current, ...moreLectures])
    }

    // Set isFetching flag
    // it
    setIsFetching(false)
  }

  // When fetch finishes, check whether the data reach the bottom
  // if not, load more to make the page scrollable for further data
  useEffect(() => {
    if (isFetching === false && !isReachBottom()) {
      loadMore()
    }
  }, [isFetching])

  // Load more lectures when scroll reaches the bottom
  useEffect(() => {
    CEM.addEventListener('scrollends', document.body, loadMore)
  }, [])

  return (
    <>
      <Head>
        <title>강의 검색</title>
      </Head>
      <BaseLayout enableScrollEvent>
        <div id="eodiro-lectures">
          <h1 className="page-app-title">
            <LecturesAppIcon className="icon" />
            강의 검색
          </h1>

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
                <ArrowBlock key={i} className="lecture-item">
                  <div className="li-content">
                    <h1 className="lecture-name">{lecture.name}</h1>
                    <p>{lecture.professor}</p>
                    <p>{lecture.schedule}</p>
                  </div>
                </ArrowBlock>
              )
            })}
          </Grid>
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