import GlobalFooter from '@/components/GlobalFooter'
import Navigation, { NavContextProvider } from '@/components/Navigation'
import React from 'react'
import './BaseLayout.scss'

const BaseLayout: React.FC = (props) => {
  return (
    <NavContextProvider>
      <div id="eodiro-app-scaffold">
        <div id="eodiro-app">
          <Navigation />
          {props.children}
          <GlobalFooter />
        </div>
      </div>
    </NavContextProvider>
  )
}

export default BaseLayout
