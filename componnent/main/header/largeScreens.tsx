"use client";
import { headerHeight, headerHeightForPhones } from '@/constent';
import React, { useContext, useEffect, useState } from 'react'
import { useScreen } from '@/contexts/screenProvider';
import { HeaderProps, OwnerInfoType } from '@/types';
import { useTheme } from '@/contexts/themeProvider';
import axios from 'axios';
import { backEndUrl } from '@/api';
import { useRouter } from 'next/navigation';
import MenuIcon from '@/componnent/sub/menuIcon';
import ShoppingCart from '@/componnent/sub/shoppingCart';
import SearchBar from '@/componnent/sub/searchBar';
import ThemeMode from '@/componnent/sub/themeModeSelector';
import LanguageSelector from '@/componnent/sub/languageSelector';
import { useOwner } from '@/contexts/ownerInfo';
import { useRegisterSection } from '@/contexts/registerSec';
import { useLoadingScreen } from '@/contexts/loadingScreen';
import { useClient } from '@/contexts/client';

const LargeScreens = ({
    isSideBarActive,
    setIsSideBarActive,
    searchInput,
    className,
    style
}: HeaderProps) => {

    const screenWidth = useScreen().screenWidth;
    const { activeTheme, colors } = useTheme();
    const router = useRouter();
    const { ownerInfo, setOwnerInfo } = useOwner();
    const [searchBarActive, setSearchBarActive] = useState<boolean>(false)
    const { setRegisterSectionExist } = useRegisterSection();
    const { setLoadingScreen } = useLoadingScreen();
    const { setClient, client } = useClient();

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
              // backgroundColor: colors.light[200],
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

            <div 
                className='w-fit h-full flex justify-center items-center cursor-pointer'
                onClick={() => {
                    if (client && client.token) {
                        setLoadingScreen(true)
                        router.push('/account')
                    } else { 
                        setRegisterSectionExist(true);
                    }
                }}
            >
            <img 
                src={activeTheme == "dark" ? "/icons/user-circle-white.png" : "/icons/user-circle-black.png" } 
                alt="" 
                className='w-6 h-6'
            />
            
            </div>

          <ShoppingCart/>
        </div>

      </div>
    )
}

export default LargeScreens
