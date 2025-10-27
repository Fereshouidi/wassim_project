import { useTheme } from '@/contexts/themeProvider';
import React, { act } from 'react'

type ChoseQuantityTyp = {
    quantity: number
    setQuantity: (value: number) => void
    max: number
}

const ChoseQuantity = ({
    quantity, 
    setQuantity,
    max
}: ChoseQuantityTyp) => {

    const { colors, activeTheme } = useTheme();



  return (
    <div className=' flex justify-between items-center pag-5'>

        <img 
            className='w-10 h-10 p-3 flex justify-center items-center rounded-sm text-2xl font-extrabold cursor-pointer'
            src={activeTheme == "light" ? "/icons/minus-dark.png" : "/icons/minus-light.png" } 
            style={{
                backgroundColor: colors.light[300],
            }}
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
        />

        <span
            className='w-10 h-10 p-3 flex justify-center items-center rounded-sm '
        >{quantity}</span>

        <img 
            className='w-10 h-10 p-3 flex justify-center items-center rounded-sm text-2xl font-extrabold cursor-pointer'
            src={activeTheme == "light" ? "/icons/add-black.png" : "/icons/add-white.png" } 
            style={{
                backgroundColor: colors.light[300],
            }}
            onClick={() => quantity < max && setQuantity(quantity + 1)}
        />

    </div>
  )
}

export default ChoseQuantity
