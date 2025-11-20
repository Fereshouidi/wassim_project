import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { ProductType } from '@/types'
import React, { CSSProperties } from 'react'
import SkeletonLoading from './SkeletonLoading'
import { useRouter } from 'next/navigation'
import { useScreen } from '@/contexts/screenProvider'
import { useLoadingScreen } from '@/contexts/loadingScreen'

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
    const router = useRouter();
    const { setLoadingScreen } = useLoadingScreen();

  return (
    <div 
        className={`flex flex-col items-center gap-3 overflow-hidden cursor-pointer ${className}`}
        style={{
            ...style
            // backgroundColor: colors.light[100]
        }}
        onClick={() => {
            setLoadingScreen(true);
            router.push(`/product/${product._id}`)}}
    >
        
        <div 
            className='w-full h-[180px] sm:h-[220px] rounded-sm overflow-hidden'
            style={{
                backgroundColor: colors.light[300]
            }}
        >
            {
                product.thumbNail ? <img 
                    src={product.thumbNail}
                    className='w-full h-full rounded-sm overflow-hidden hover:scale-110 duration-300'
                /> :
                product.thumbNail == null ?
                    <SkeletonLoading/> :
                null
                }
        </div>


        <h4 
            className='w-full rounded-sm overflow-hidden min-h-5 text-[14px] sm:text-lg text-center '
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
            className='min-w-[50%] rounded-sm overflow-hidden min-h-5 text-[17px] sm:text-lg font-bold text-center'
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
