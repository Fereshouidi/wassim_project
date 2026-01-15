"use client";
import { backEndUrl } from '@/api';
import { headerHeight } from '@/constent';
import { useLanguage } from '@/contexts/languageContext';
import { ScreenProvider, useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { PubType } from '@/types';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'

type AnnouncementBarType = {
  topBar: {
    fr: string,
    en: string
  }
}

const AnnouncementBar = ({}) => {

  const screenWidth = useScreen().screenWidth;
  const { colors } = useTheme();
  const { activeLanguage } = useLanguage();
  const [pub, setPub] = useState<PubType | undefined>(undefined);


  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(backEndUrl + "/getPub")
      .then(({data}) => setPub(data.pub))
      .catch((err) => {
        console.log(err);
        
      })
    }
    fetchData();
  }, [])

  return (
    <div 
        className='w-full bg-black text-white flex justify-center items-center font-bold z-50'
        style={{
            height: headerHeight/1.5,
            fontSize: screenWidth > 1000 ? "18px" : "10px",
            backgroundColor: colors.dark[100],
            color: colors.light[100],
        }}
    >
      {pub?.topBar && pub.topBar[activeLanguage.language]}
    </div>
  )
}

export default AnnouncementBar
