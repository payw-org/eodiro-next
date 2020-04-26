import './style.scss'

import Body from '@/layouts/BaseLayout/Body'
import { Contributor } from '@/types/github-api'
import Head from 'next/head'
import WhiteBody from '@/components/utils/WhiteBody'

export type OpenSourceProps = {
  contributors: Contributor[]
}

const OpenSource: React.FC<OpenSourceProps> = ({ contributors }) => {
  return (
    <Body pageTitle="오픈소스" bodyClassName="component-open-source">
      <Head>
        <title>어디로 - 오픈소스</title>
        <meta
          key="description"
          property="description"
          content="어디로는 자유 공개 소프트웨어입니다."
        />
      </Head>
      <WhiteBody />
      <div className="manifesto">
        <p className="paragraph">
          &ldquo;어디로&rdquo;는 자유롭게 소스코드를 들여다보고 개발에 함께
          참여할 수 있는 공개 소프트웨어입니다. 모든 소스는{' '}
          <a
            href="https://github.com/paywteam"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          에서 확인할 수 있습니다.
        </p>
      </div>

      <section className="contributors">
        <h2 className="title">개발자를 소개합니다.</h2>
        <p className="description">
          클릭하여 각 개발자의 프로필로 이동할 수 있습니다. GitHub에서
          &ldquo;어디로&rdquo; 개발에 참여하시면 자동으로 이 페이지에
          표시됩니다.
        </p>

        <div className="users">
          {contributors.map((user) => (
            <a
              href={user.html_url}
              key={user.id}
              target="_blank"
              rel="noopener noreferrer"
              className="user-link"
            >
              <div className="user">
                <img src={user.avatar_url} alt="Avatar" className="avatar" />
                <h3 className="name">{user.login}</h3>
                <span className="contributions">{user.contributions}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </Body>
  )
}

export default OpenSource
