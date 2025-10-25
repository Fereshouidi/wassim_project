import React, { CSSProperties } from 'react'

type ProductDetailsType = {
    className?: string  
    style: CSSProperties
}
const ProductDetails = ({
    className,
    style
}: ProductDetailsType ) => {
  return (
    <div 
        className={` ${className}`}
        style={{
            ...style
        }}
    >
      ProductDetails
    </div>
  )
}

export default ProductDetails
