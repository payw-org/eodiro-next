import React from 'react'
import mergeClassName from '@/modules/merge-class-name'
import { ArrowRightColorIcon } from '@/components/icons'
import './ArrowBlock.scss'

interface ArrowBlockProps {
  className?: string
  noArrow?: boolean
  flat?: boolean
}

const ArrowBlock: React.FC<ArrowBlockProps> = ({
  className,
  noArrow = false,
  flat = false,
  children,
}) => {
  return (
    <div
      className={mergeClassName('arrow-block', className, !flat && 'unflat')}
    >
      <div className="ab-body">{children}</div>
      {!noArrow && (
        <div className="ab-arrow-container">
          <ArrowRightColorIcon direction="right" className="ab-arrow" />
        </div>
      )}
    </div>
  )
}

export default ArrowBlock
