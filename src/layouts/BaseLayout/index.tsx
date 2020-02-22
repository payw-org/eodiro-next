import React from 'react'
import Navigation from '@/components/Navigation'
import './BaseLayout.scss'

const BaseLayout: React.FC = ({ children }) => {
  return (
    <div id="eodiro-app">
      <Navigation />
      <div className="body-content">{children}</div>
    </div>
  )
}

export default BaseLayout
