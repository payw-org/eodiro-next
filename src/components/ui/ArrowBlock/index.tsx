import React from 'react'
import buildClassName from '@/modules/build-class-name'
import ArrowRightColorIcon from '@/components/icons/ArrowRightColorIcon'
import './ArrowBlock.scss'

interface ArrowBlockProps {
  className?: string
}

const ArrowBlock: React.FC<ArrowBlockProps> = ({ className, children }) => {
  return (
    <div className={buildClassName('arrow-block', className)}>
      <div className="ab-body">{children}</div>
      <div className="ab-arrow-container">
        <ArrowRightColorIcon className="ab-arrow" />
      </div>
    </div>
  )
}

export default ArrowBlock
