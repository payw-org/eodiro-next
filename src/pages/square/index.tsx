import { FlatBlock } from '@/components/ui'
import Body from '@/layouts/BaseLayout/Body'
import { Post } from '@payw/eodiro-one-api/db-schema/generated'
import { GetServerSideProps } from 'next'
import { EodiroPage } from '../_app'
import './style.scss'

type SquareMainPageProps = {
  globalPosts: Post[]
}

const SquareMainPage: EodiroPage<SquareMainPageProps> = (props) => {
  return (
    <>
      <Body pageTitle="빼빼로 광장" bodyClassName="eodiro-square-main">
        <FlatBlock className="board">
          <a href="/square/자유 게시판">
            <h1 className="board-name">자유 게시판</h1>
          </a>
          {props.globalPosts &&
            props.globalPosts.map((globalPost) => {
              return <div key={globalPost.id}>{globalPost.title}</div>
            })}
        </FlatBlock>
      </Body>
    </>
  )
}

export default SquareMainPage

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  }
}
