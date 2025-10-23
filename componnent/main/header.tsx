"use client";
import { headerHeight } from '@/constent';
import React, { useContext, useEffect, useState } from 'react'
import SearchBar from '../sub/searchBar';
import ShoppingCart from '../sub/shoppingCart';
import ThemeMode from '../sub/themeModeSelector';
import LanguageSelector from '../sub/languageSelector';
import { useScreen } from '@/contexts/screenProvider';
import MenuIcon from '../sub/menuIcon';
import { HeaderProps, OwnerInfoType } from '@/types';
import { useTheme } from '@/contexts/themeProvider';
import axios from 'axios';
import { backEndUrl } from '@/api';

const Header = ({
    isSideBarActive,
    setIsSideBarActive,
    ownerInfo, 
    setOwnerInfo
}: HeaderProps) => {

  const screenWidth = useScreen().screenWidth;
  const { activeTheme, colors } = useTheme();
  // const [isSideBarActive, setIsSideBarActive] = useState<boolean>(true);


  
  if (screenWidth < 1000) {

    return (

      <div 
        className='w-full bg-white flex items-center justify-between px-5 sticky top-0 z-50'
        style={{
            height: headerHeight/1.2,
            boxShadow: '0 0px 15px rgba(13, 13, 13, 0.07)',
            backgroundColor: colors.light[100]
        }}
      >
        
        <MenuIcon
          isSideBarActive={isSideBarActive}
          setIsSideBarActive={setIsSideBarActive}
        />

        <div className='flex flex-row items-end gap-1.5 absolute left-[50%] translate-x-[-50%]'>

          <div 
            className='h-16 flex items-center justify-center'
            style={{
            }}
          >
              {
                activeTheme == "light" ? 
                  <img 
                    src={ownerInfo?.logo?.light}
                    className=' h-[50%] object-contain no-sellect'
                  /> : 
                activeTheme == "dark" ?
                  <img 
                    src={ownerInfo?.logo?.dark}
                    className=' h-[50%] object-contain no-sellect'
                  /> :
                null
              }

          </div>

        </div>

        <div
          className='h-full flex justify-between items-center gap-2 '
        >

          <img 
              className='w-14 h-14 p-4 rounded-sm cursor-pointer'
              src={ activeTheme == "dark" ? "/icons/searchWhite.png" : "/icons/searchBlack.png" }
              alt="" 
              style={{
                  backgroundColor: colors.light[100]
              }}
          />
          <ShoppingCart/>

        </div>

      </div>

    )

  } else {

    return (
      <div 
          className='w-full bg-white flex items-center justify-between gap-5 px-10 sticky top-0 z-50'
          style={{
              height: headerHeight,
              boxShadow: '0 0px 15px rgba(13, 13, 13, 0.07)',
              backgroundColor: colors.light[100]
          }}
      >

        <div className='w-[25%] h-full flex flex-row justify-between items-center '>

          <MenuIcon
            isSideBarActive={isSideBarActive}
            setIsSideBarActive={setIsSideBarActive}
          />

            <div 
              className='flex-row gap-1.5 w-36 h-full flex items-center justify-center'
              style={{
              }}
            >
              {
                activeTheme == "light" ? 
                  <img 
                    src={ownerInfo?.logo?.light}
                    className=' h-[50%] object-contain no-sellect'
                  /> : 
                activeTheme == "dark" ?
                  <img 
                    src={ownerInfo?.logo?.dark}
                    className=' h-[50%] object-contain no-sellect'
                  /> :
                null
              }

            </div>

          <div className='w-10'></div>

        </div>

        <div className='w-[75%] h-full flex flex-row justify-between items-center'>

          <SearchBar
            containerClassName="h-14"
            className='h-full border-[0.02px]'
            style={{
              backgroundColor: colors.light[200],
              borderColor: colors.light[300]
            }}
            inputStyle={{
                color: colors.dark[700],
            }}
            searchIcon={ activeTheme == "dark" ? "/icons/searchBlack.png" : "/icons/searchWhite.png" }
            searchIconStyle={{
                backgroundColor: colors.dark[100]
            }}
            resSectionStyle={{
                backgroundColor: colors.light[100]
            }}
            aiIconStyle={{
                backgroundColor: colors.light[200]
            }}
          />

          <ThemeMode/>

          <LanguageSelector/>

          <ShoppingCart/>
        </div>

      </div>
    )

  }

}

export default Header;
