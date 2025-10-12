"use client";
import { headerHeight } from '@/constent';
import { useLanguage } from '@/contexts/languageContext';
import { ScreenProvider, useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import React, { useContext } from 'react'

type AnnouncementBarType = {
  topBar: {
    fr: string,
    en: string
  }
}

const AnnouncementBar = ({
  topBar
}: AnnouncementBarType) => {

  const screenWidth = useScreen().screenWidth;
  const { colors } = useTheme();
  const { activeLanguage } = useLanguage();

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
      {topBar[activeLanguage.language]}
    </div>
  )
}

export default AnnouncementBar
