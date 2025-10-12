import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import React from 'react'

const SkeletonLoading = () => {

    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();

  return (

    <div 
        className='w-full h-full relative overflow-hidden'
        style={{
            backgroundColor: colors.light[300]
        }}
    >
        <div 
            className='w-[50%] h-full absolute top-0 left-0 animate-move'
            style={{
                backgroundColor: colors.light[350],
                boxShadow: `5px 5px 70px ${colors.light[350]}`
            }}
        >

        </div>
    </div>
  )
}

export default SkeletonLoading
