import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { ProductType } from '@/types'
import React, { CSSProperties } from 'react'
import SkeletonLoading from './SkeletonLoading'

type productLoadingType = {
    className?: String
    style?: CSSProperties
    productLoading?: React.RefObject<HTMLDivElement | null>
}

const ProductLoading = ({
    className,
    style,
    productLoading
}: productLoadingType) => {

    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();
    
  return (

    <div 
        className={`w-[185px] sm:w-[250px] min-h-[185px] sm:min-h-[250px] flex flex-col items-center gap-3 overflow-hidden cursor-pointer ${className}`}
        style={{
            ...style
        }}
        ref={productLoading}
    >
        
        <div 
            className='w-full h-[185px] sm:h-[250px] overflow-hidden'
            style={{
                backgroundColor: colors.light[300]
            }}
        >
            <SkeletonLoading/>
        </div>


        <div 
            className='w-full h-5 text-sm sm:text-lg text-center px-2 sm:px-0'
            style={{
                backgroundColor: colors.light[300]
            }}
        >
            <SkeletonLoading/>
        </div>

        <div 
            className='min-w-[50%] h-5 text-lg sm:text-lg font-bold text-center'
            style={{
                backgroundColor: colors.light[300]
            }}
        >
            <SkeletonLoading/>
        </div>

    </div>
  )
}

export default ProductLoading
