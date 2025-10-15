import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { ProductType } from '@/types'
import React, { CSSProperties } from 'react'
import SkeletonLoading from './SkeletonLoading'

type productCardType = {
    product: ProductType
    className?: String
    style?: CSSProperties
}

const ProductCard = ({
    product,
    className,
    style
}: productCardType) => {

    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();

  return (
    <div 
        className={`flex flex-col items-center gap-3 overflow-hidden cursor-pointer ${className}`}
        style={{
            ...style
            // backgroundColor: colors.light[100]
        }}
    >
        
        <div 
            className='w-full h-[185px] sm:h-[250px] overflow-hidden'
            style={{
                backgroundColor: colors.light[300]
            }}
        >
            {
                product.thumbNail ? <img 
                    src={product.thumbNail}
                    className='w-full h-full hover:scale-110 duration-300'
                /> :
                product.thumbNail == null ?
                    <SkeletonLoading/> :
                null
                }
        </div>


        <h4 
            className='w-full min-h-5 text-sm sm:text-lg text-center px-2 sm:px-0'
            style={{
                color: colors.dark[200]
            }}
        >
            {
                product.name[activeLanguage.language] != null ?
                    product.name[activeLanguage.language] + ""
                : <SkeletonLoading/>
            }
            
        </h4>

        <span 
            className='min-w-[50%] min-h-5 text-lg sm:text-lg font-bold text-center'
            style={{
                color: colors.dark[100]
            }}
        >
            {
                product.price != null ?
                    product.price + " D.T"
                : <SkeletonLoading/>
            }
        </span>

    </div>
  )
}

export default ProductCard
