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
        className={`bg-red-500 ${className}`}
        style={{
            ...style
        }}
    >
      ProductDetails
    </div>
  )
}

export default ProductDetails
