// import { colors } from '@/contexts/themeProvider'
import { useTheme } from '@/contexts/themeProvider'
import React from 'react'

const ShoppingCart = () => {

  const { activeTheme, colors } = useTheme();

  return (
    <div
        className='w-6 h-6 sm:w-7 sm:h-7 relative no-sellect'
    >

        <img  
            src={activeTheme == "dark" ? "/icons/shopping-bag-white.png" : "/icons/shopping-bag-black.png" }
            alt="" 
        />

        <span 
            className='absolute top-[-7px] right-[-7px] bg-black text-white rounded-full w-5 h-5 flex justify-center items-center sm:p-2 text-[10px] sm:text-sm'
            style={{
                backgroundColor: colors.dark[100],
                color: colors.light[100]
            }}
        >0</span>
    </div>
  )
}

export default ShoppingCart
