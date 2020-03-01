import React from 'react'
import './Information.scss'

type InformationProps = {
  title: string
  subtitle?: JSX.Element
}

const Information: React.FC<InformationProps> = ({ title, subtitle }) => {
  return (
    <div className="information">
      <h3 className="information-title">{title}</h3>
      {!subtitle || <p className="information-subtitle">{subtitle}</p>}
    </div>
  )
}

export default Information
