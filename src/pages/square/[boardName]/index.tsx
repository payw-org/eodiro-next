import { Button, FlatBlock } from '@/components/ui'
import { pathIds } from '@/config/paths'
import Body from '@/layouts/BaseLayout/Body'
import { EodiroPage, useAuth } from '@/pages/_app'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import './style.scss'

// Import PostContainer dynamically (only client side rendering)
const PostContainer = dynamic(
  () => import('@/components/square/PostContainer'),
  { ssr: false }
)

// Side
const SideContainer: React.FC<{ isSigned: boolean; boardName: string }> = ({
  isSigned,
  boardName,
}) => {
  return (
    <div className="side">
      {isSigned && (
        <a
          href={`/square/${boardName}/${pathIds.writePost}`}
          onClick={(): void => {
            sessionStorage.setItem('sbsp', window.scrollY?.toString())
          }}
        >
          <div className="new-btn-wrapper">
            <Button full label="새 포스트 작성" className="new-btn" />
          </div>
        </a>
      )}
      <div className="more">
        <FlatBlock>
          <h3>다른 게시판</h3>
        </FlatBlock>
      </div>
    </div>
  )
}

const BoardPage: EodiroPage = () => {
  const { isSigned } = useAuth()
  const router = useRouter()
  const boardName = router.query.boardName as string

  return (
    <Body pageTitle={boardName} bodyClassName="eodiro-board-page" hideOnLoad>
      <div className="page-container">
        <SideContainer isSigned={isSigned} boardName={boardName} />
        <FlatBlock className="content">
          <PostContainer />
        </FlatBlock>
      </div>
    </Body>
  )
}

export default BoardPage
