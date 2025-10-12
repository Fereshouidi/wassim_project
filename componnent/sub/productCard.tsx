import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { ProductType } from '@/types'
import React from 'react'
import SkeletonLoading from './SkeletonLoading'

type productCardType = {
    product: ProductType
}

const ProductCard = ({
    product
}: productCardType) => {

    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();

  return (
    <div 
        className='w-[185px] sm:w-[250px] min-h-[185px] sm:min-h-[250px] flex flex-col items-center gap-3 my-3 overflow-hidden cursor-pointer'
        style={{
            // backgroundColor: colors.light[100]
        }}
    >
        
        <div 
            className='w-full h-[185px] sm:h-[250px] overflow-hidden'
        >
            {
                product.thumbNail ? <img 
                    src={product.thumbNail}
                    className='w-full h-full hover:scale-110 duration-300'
                /> :
                <SkeletonLoading/>
                }
        </div>


        <h4 
            className='w-full min-h-5 text-sm sm:text-lg text-center px-2 sm:px-0'
            style={{
                color: colors.dark[200]
            }}
        >
            {
                product.name[activeLanguage.language] ?
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
                product.price ?
                    product.price + " D.T"
                : <SkeletonLoading/>
            }
        </span>

    </div>
  )
}

export default ProductCard
