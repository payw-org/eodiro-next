import { AuthApi, Tokens, UserInfo } from '@/api'
import { Button, FlatBlock } from '@/components/ui'
import Body from '@/layouts/BaseLayout/Body'
import Grid from '@/layouts/Grid'
import { redirect } from '@/modules/server/redirect'
import dayjs from 'dayjs'
import { EodiroPage } from '../_app'
import './MyPage.scss'

type MyPageProps = {
  userInfo: UserInfo
}

const MyPage: EodiroPage<MyPageProps> = ({ userInfo }) => {
  return (
    <Body pageTitle={userInfo.nickname} bodyClassName="eodiro-my">
      <section className="info-section">
        <h1 className="section-header">기본 정보</h1>
        <Grid proportion="large" className="section-body">
          <FlatBlock>
            <div className="info-block">
              <h2 className="ib-header">가입일</h2>
              <p>{dayjs(userInfo.registered_at).format('YYYY년 M월 D일')}</p>
            </div>
          </FlatBlock>
          <FlatBlock>
            <div className="info-block">
              <h2 className="ib-header">포탈 이메일</h2>
              <p>{userInfo.portal_id}</p>
            </div>
          </FlatBlock>
          <FlatBlock>
            <div className="info-block random-nickname">
              <h2 className="ib-header">오늘의 랜덤 닉네임</h2>
              <p>{userInfo.random_nickname}</p>
            </div>
          </FlatBlock>
        </Grid>
      </section>

      <section className="signout-section">
        <Button
          className="signout-btn"
          label="로그아웃"
          accent="purple"
          onClick={async (): Promise<void> => {
            const signedOut = await Tokens.clear()
            if (signedOut) {
              location.href = '/'
            }
          }}
        />
        <Button
          label="모든 기기에서 로그아웃"
          accent="purple"
          onClick={async (): Promise<void> => {
            const signedOutFromAll = await AuthApi.signOutFromAll()

            if (signedOutFromAll) {
              alert('모든 기기에서 로그아웃 되었습니다. 다시 로그인해주세요.')
              location.href = '/'
            } else {
              alert('문제가 발생하여 모든 기기에서 로그아웃하지 못했습니다.')
            }
          }}
        />
      </section>
    </Body>
  )
}

MyPage.getInitialProps = async ({ req, res }): Promise<MyPageProps> => {
  const userInfo = await AuthApi.info(req)

  if (!userInfo) {
    redirect(res, '/')
    return
  }

  return {
    userInfo,
  }
}

export default MyPage
