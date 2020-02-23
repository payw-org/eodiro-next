import React from 'react'
import './Navigation.scss'
import EodiroLogo from '@/components/icons/EodiroLogo'
import Link from 'next/link'

type NavItemProps = {
  to: string
  title: string
}

const NavItem: React.FC<NavItemProps> = ({ to, title }) => {
  return (
    <Link href={to}>
      <a className="en-menu-link">
        <li className="en-menu-item">{title}</li>
      </a>
    </Link>
  )
}

const Navigation: React.FC = () => {
  return (
    <nav id="eodiro-navigation">
      <div className="en-wrapper">
        <EodiroLogo className="eodiro-logo" />
        <ul className="en-menus-container">
          <NavItem title="빈 강의실" to="/" />
          <NavItem title="강의 검색" to="/" />
          <NavItem title="학식 메뉴" to="/" />
          <NavItem title="빼빼로 광장" to="/" />
          <NavItem title="더 보기" to="/" />
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
