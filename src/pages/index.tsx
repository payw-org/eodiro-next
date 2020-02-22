import React from 'react'
import BaseLayout from '@/layouts/BaseLayout'
import '@/assets/styles/pages/home.scss'

const Home: React.FC = () => {
  return (
    <BaseLayout>
      <div id="home">
        <h1 className="header">어디로</h1>
        <p>중앙대학교 유틸리티 서비스</p>
      </div>
    </BaseLayout>
  )
}

export default Home
