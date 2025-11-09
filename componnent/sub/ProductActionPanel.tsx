import React from 'react'
import ChoseQuantity from './choseQuantity'
import { ProductSpecification } from '@/types'
import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { useScreen } from '@/contexts/screenProvider'

type Props = {
    quantity: number,
    setQuantity: (value: number) => void
    activeSpecifications: ProductSpecification | undefined | null
}

const ProductActionPanel = ({
    quantity,
    setQuantity,
    activeSpecifications
}: Props) => {

  const { screenWidth } = useScreen();
  const { activeLanguage } = useLanguage();
  const { colors } = useTheme();

  return (

        <div className='flex flex-row my-5- mx-2 gap-4'>

            <ChoseQuantity
                quantity={quantity}
                setQuantity={setQuantity}
                max={activeSpecifications?.quantity?? 1}
            />

            <button 
                className='flex flex-1 justify-center items-center w-12 h-12 rounded-sm cursor-pointer'
                style={{
                    backgroundColor: colors.dark[100],
                    color: colors.light[200]
                }}
            >Add to cart</button>

        </div>
  )
}

export default ProductActionPanel
