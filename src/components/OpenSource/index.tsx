import './style.scss'

import Body from '@/layouts/BaseLayout/Body'
import WhiteBody from '@/components/utils/WhiteBody'

type OpenSourceProps = {}

const OpenSource: React.FC<OpenSourceProps> = (props) => {
  return (
    <Body pageTitle="오픈소스" bodyClassName="component-open-source">
      <WhiteBody />
      <div className="manifesto">
        <p className="paragraph">
          &ldquo;어디로&rdquo;는 누구나 소스코드를 열람하고 개발에 참여할 수
          있는 공개 소프트웨어입니다. 모든 소스는{' '}
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
    </Body>
  )
}

export default OpenSource
