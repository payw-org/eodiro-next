import GlobalFooter from '@/components/GlobalFooter'
import Navigation, { NavContextProvider } from '@/components/Navigation'
import React, { useRef } from 'react'
import './BaseLayout.scss'
import Body, { BodyProps } from './Body'

interface BaseLayoutProps extends BodyProps {
  appClassName?: string
}

const BaseLayout: React.FC<BaseLayoutProps> = (props) => {
  const bodyContent = useRef<HTMLDivElement>(null)

  return (
    <NavContextProvider>
      <div id="eodiro-app-scaffold" className={props.appClassName}>
        <div id="eodiro-app">
          <Navigation />
          <Body ref={bodyContent} {...props}>
            {props.children}
          </Body>
          <GlobalFooter />
        </div>
      </div>
    </NavContextProvider>
  )
}

export default BaseLayout
