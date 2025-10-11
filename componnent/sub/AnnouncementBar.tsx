"use client";
import { headerHeight } from '@/constent';
import { ScreenProvider, useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import React, { useContext } from 'react'

const AnnouncementBar = () => {

  const screenWidth = useScreen().screenWidth;
  const { colors } = useTheme();

  return (
    <div 
        className='w-full bg-black text-white flex justify-center items-center font-bold'
        style={{
            height: headerHeight/1.5,
            fontSize: screenWidth > 1000 ? "18px" : "10px",
            backgroundColor: colors.dark[100],
            color: colors.light[100]
        }}
    >
      LIVRAISON GRATUITE A PARTIR DE 100 DT ACHAT
    </div>
  )
}

export default AnnouncementBar
