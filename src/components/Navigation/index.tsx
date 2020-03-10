import { VerticalThreeDotsIcon } from '@/components/icons'
import EodiroLogo from '@/components/icons/EodiroLogo'
import mergeClassName from '@/modules/merge-class-name'
import { AuthContext } from '@/pages/_app'
import React, { useContext } from 'react'
import './Navigation.scss'
import {
  NavHiddenStateContext,
  NavMenuOpenDispatchContext,
  NavMenuOpenStateContext,
  NavScrollStateContext,
  NavTitleStateContext,
} from './NavigationContext'

export * from './NavigationContext'

type NavItemProps = {
  className?: string
  to: string
  title: string
}

const NavItem: React.FC<NavItemProps> = ({ to, title, className }) => {
  return (
    <a className={mergeClassName('en-menu-link', className)} href={to}>
      <li className="en-menu-item">{title}</li>
    </a>
  )
}

const BgBar: React.FC = () => {
  const isScrolled = useContext(NavScrollStateContext)
  const menuOpened = useContext(NavMenuOpenStateContext)

  return (
    <div
      className={mergeClassName(
        'en-bar',
        (isScrolled || menuOpened) && 'scrolled'
      )}
    />
  )
}

const PageAppTitle: React.FC = () => {
  const hidden = useContext(NavHiddenStateContext)
  const title = useContext(NavTitleStateContext)

  return (
    <h1 className={mergeClassName('page-app-title', !hidden && 'show')}>
      {title}
    </h1>
  )
}

const NavMenus: React.FC = () => {
  const isSigned = useContext(AuthContext).isSigned
  const menuOpened = useContext(NavMenuOpenStateContext)

  return (
    <ul
      className={mergeClassName(
        'en-menus-container',
        menuOpened ? 'opened' : ''
      )}
    >
      <NavItem title="빈 강의실" to="/vacant" />
      <NavItem title="강의 검색" to="/lectures" />
      <NavItem title="학식 메뉴" to="/cafeteria" />
      <NavItem title="빼빼로 광장" to="/" />
      <NavItem
        title={isSigned ? '마이페이지' : '로그인'}
        className={isSigned ? 'my' : 'signin'}
        to={isSigned ? '/my' : '/signin'}
      />
    </ul>
  )
}

const Navigation: React.FC = () => {
  const setMenuOpen = useContext(NavMenuOpenDispatchContext)

  return (
    <nav id="eodiro-navigation">
      <BgBar />

      <div className="en-wrapper">
        <a className="home-link" href="/">
          <EodiroLogo className="eodiro-logo" fill="#ff3852" />
        </a>

        <PageAppTitle />

        <NavMenus />

        <div className="more-tappable">
          <VerticalThreeDotsIcon
            className="more-icon"
            onClick={(): void => {
              setMenuOpen((open) => {
                return !open
              })
            }}
          />
        </div>
      </div>
    </nav>
  )
}

export default React.memo(Navigation)
