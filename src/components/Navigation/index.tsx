import React, { useState } from 'react'
import './Navigation.scss'
import EodiroLogo from '@/components/icons/EodiroLogo'
import ThreeDotsVerticalColorIcon from '../icons/ThreeDotsVerticalColorIcon'
import buildClassName from '@/modules/build-class-name'

type NavItemProps = {
  to: string
  title: string
}

const NavItem: React.FC<NavItemProps> = ({ to, title }) => {
  return (
    <a className="en-menu-link" href={to}>
      <li className="en-menu-item">{title}</li>
    </a>
  )
}

const Navigation: React.FC = () => {
  const [isMobileNavMenuOpened, setIsMobileNavMenuOpened] = useState(false)

  return (
    <nav id="eodiro-navigation">
      <div className="en-wrapper">
        <a className="home-link" href="/">
          <EodiroLogo className="eodiro-logo" appearance="dark" fill="#fff" />
          <EodiroLogo className="eodiro-logo" appearance="light" fill="#000" />
        </a>
        <ul
          className={buildClassName(
            'en-menus-container',
            isMobileNavMenuOpened ? 'opened' : ''
          )}
        >
          <NavItem title="빈 강의실" to="/vacant" />
          <NavItem title="강의 검색" to="/" />
          <NavItem title="학식 메뉴" to="/" />
          <NavItem title="빼빼로 광장" to="/" />
          <NavItem title="더 보기" to="/" />
        </ul>
        <div className="more-tappable">
          <ThreeDotsVerticalColorIcon
            className="more-icon"
            appearance="light"
            fill="#000"
            onClick={(e) => {
              setIsMobileNavMenuOpened(!isMobileNavMenuOpened)
            }}
          />
          <ThreeDotsVerticalColorIcon
            className="more-icon"
            appearance="dark"
            fill="#fff"
            onClick={(e) => {
              setIsMobileNavMenuOpened(!isMobileNavMenuOpened)
            }}
          />
        </div>
      </div>
    </nav>
  )
}

export default Navigation
