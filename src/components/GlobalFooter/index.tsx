import React from 'react'
import dayjs from 'dayjs'

import './GlobalFooter.scss'

const GlobalFooter: React.FC = () => {
  const now = dayjs()

  return (
    <footer id="global-footer">
      Copyright © {now.year()}
      &nbsp;
      <a
        href="https://payw.org"
        target="_blank"
        rel="noopener noreferrer"
        className="payw"
      >
        PAYW
      </a>
    </footer>
  )
}

export default GlobalFooter
