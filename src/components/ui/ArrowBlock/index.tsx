import React from 'react'
import mergeClassName from '@/modules/merge-class-name'
import ArrowRightColorIcon from '@/components/icons/ArrowRightColorIcon'
import './ArrowBlock.scss'

interface ArrowBlockProps {
  className?: string
}

const ArrowBlock: React.FC<ArrowBlockProps> = ({ className, children }) => {
  return (
    <div className={mergeClassName('arrow-block', className)}>
      <div className="ab-body">{children}</div>
      <div className="ab-arrow-container">
        <ArrowRightColorIcon className="ab-arrow" />
      </div>
    </div>
  )
}

export default ArrowBlock
