"use client";
import { headerHeight, headerHeightForPhones } from '@/constent';
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
import { useRouter } from 'next/navigation';

const Header = ({
    isSideBarActive,
    setIsSideBarActive,
    ownerInfo, 
    setOwnerInfo,
    searchInput,
    className,
    style
}: HeaderProps) => {

  const screenWidth = useScreen().screenWidth;
  const { activeTheme, colors } = useTheme();
  const router = useRouter();
  const [searchBarActive, setSearchBarActive] = useState<boolean>(false)
  // const [isSideBarActive, setIsSideBarActive] = useState<boolean>(true);


  // for phones 

  if (screenWidth < 1000) {

    return (

      <div className={`w-full bg-white flex items-center justify-between sticky top-0 z-50 ${searchBarActive ? "fixed-" : "sticky-"}`}>

      <div 
          className='w-full bg-white flex items-center justify-between px-5 sticky top-0 z-50'
          style={{
              height: headerHeightForPhones,
              boxShadow: !searchBarActive ? '0 0px 15px rgba(13, 13, 13, 0.07)' : '',
              backgroundColor: colors.light[100],
              ...style
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

              <div 
                className=' h-[50%] cursor-pointer'
                onClick={() => router.replace('/')}
              >
                {
                  activeTheme == "light" ? 
                    <img 
                      src={ownerInfo?.logo?.light}
                      className=' h-full object-contain no-sellect'
                    /> : 
                  activeTheme == "dark" ?
                    <img 
                      src={ownerInfo?.logo?.dark}
                      className=' h-full object-contain no-sellect'
                    /> :
                  null
                }
              </div>

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
                  onClick={() => setSearchBarActive(!searchBarActive)}
              />

            <ShoppingCart/>

          </div>

      </div>

      <div className={`
        w-full h-full absolute left-0 
        ${searchBarActive ? "top-[100%] visible py-1 px-2" : "top-[0%] invisible"} 
        z-0 duration-300 
      `}
        style={{
          backgroundColor: colors.light[100]
        }}
      >
          <SearchBar
            containerClassName='w-full px-5- my-2- h-full border-[0.5px]'
            containerStyle={{
              backgroundColor: colors.light[100],
              borderColor: colors.light[300],
            }}
            className='w-20 border-l-[0.5px] border-gray-100 h-full rounded-none'
            inputClassName='w-20 bg-transparent'
            style={{
                borderColor: colors.light[300],
                backgroundColor: colors.light[100]
            }}
            inputStyle={{
                borderColor: colors.light[300],
                color: colors.dark[300],
            }}
            searchIcon={ activeTheme == "dark" ? "/icons/searchBlack.png" : "/icons/searchWhite.png" }
            searchIconStyle={{
                backgroundColor: colors.dark[100],
                color: colors.light[100]
            }}
            resSectionStyle={{
                backgroundColor: colors.light[100],
                color: colors.dark[100],
                borderRight: `0.02px solid ${colors.dark[900]}`,
                borderBottom: `0.02px solid ${colors.dark[900]}`,
                borderLeft: `0.02px solid ${colors.dark[900]}`,
                borderTop: 'none'
            }}
          aiIconStyle={{
              backgroundColor: colors.light[100],
          }}
          searchInput={searchInput}
          searchIconClicked={() => setSearchBarActive(false)}
        />
      </div>

      </div>


    )

  } else {

    return (
      <div 
          className={`w-full bg-white flex items-center justify-between gap-5 px-10 sticky top-0 z-50 ${className}`}
          style={{
              height: headerHeight,
              boxShadow: '0 0px 15px rgba(13, 13, 13, 0.07)',
              backgroundColor: colors.light[100],
              ...style
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
              <div 
                className=' h-[50%] cursor-pointer'
                onClick={() => router.replace('/')}
              >
                {
                  activeTheme == "light" ? 
                    <img 
                      src={ownerInfo?.logo?.light}
                      className=' h-full object-contain no-sellect'
                    /> : 
                  activeTheme == "dark" ?
                    <img 
                      src={ownerInfo?.logo?.dark}
                      className=' h-full object-contain no-sellect'
                    /> :
                  null
                }
              </div>

            </div>

          <div className='w-10'></div>

        </div>

        <div className='w-[75%] h-full flex flex-row justify-between items-center'>

          <SearchBar
            searchInput={searchInput}
            containerClassName="h-14 border-[0.5px]"
            containerStyle={{
              borderColor: colors.light[300],
              backgroundColor: colors.light[200]
            }}
            className='h-full border-l-[0.02px]'
            style={{
              backgroundColor: colors.light[200],
              borderColor: colors.light[300]
            }}
            inputStyle={{
                color: colors.dark[200],
            }}
            searchIcon={ activeTheme == "dark" ? "/icons/searchBlack.png" : "/icons/searchWhite.png" }
            searchIconStyle={{
                backgroundColor: colors.dark[100]
            }}
            resSectionStyle={{
                backgroundColor: colors.light[100],
                color: colors.dark[100],
                borderRight: `0.02px solid ${colors.dark[800]}`,
                borderBottom: `0.02px solid ${colors.dark[800]}`,
                borderLeft: `0.02px solid ${colors.dark[800]}`,
                borderTop: 'none'
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
