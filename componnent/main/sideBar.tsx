"use client";
import { headerHeight } from '@/constent';
import { SideBarProps } from '@/types';
import React, { useEffect, useState } from 'react'
import SearchBar from '../sub/searchBar';
import LanguageSelector from '../sub/languageSelector';
import ThemeModeSelectorForMobiles from '../sub/themeModeSelectorForMobiles';
import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { useLanguage } from '@/contexts/languageContext';
import LanguageSelectorForMobile from '../sub/languageSelectorForMobile';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SideBar = ({
    isActive,
    setIsActive,
    ownerInfo, 
    setOwnerInfo
}: SideBarProps) => {

    const swreenWidth = useScreen().screenWidth;
    const { activeTheme, colors } = useTheme();
    const { activeLanguage } = useLanguage();
    const router = useRouter();


  return (
    <div 
        className={`w-screen h-screen z-50 fixed top-0 ${isActive ? "" : "invisible"} no-sellect`}
        style={{
            backgroundColor: "rgba(74, 74, 74, 0.677)",
            // display: isExist ? "" : "none"
        }}
        onClick={() => setIsActive(!isActive)}
    >
        <div    
            className={`
                w-[320px] h-full bg-white absolute top-0 ${isActive ? "left-0" : "left-[-320px]"} 
                flex flex-col items-center justify-between p-2 overflow-y-scroll scrollbar-hidden transition-[left] duration-300
            `}
            style={{
                boxShadow: '0 0px 10px rgba(13, 13, 13, 0.02)',
                backgroundColor: colors.dark[100]
            }}
            onClick={(e) => e.stopPropagation()}
        >

            <div className='w-full flex flex-1 flex-col items-center  gap-4 '>
                <div 
                    className='  w-3xs  flex items-center justify-center  p-7'
                    style={{
                        height: headerHeight*1.5,
                    }}
                >
              {
                activeTheme == "light" ? 
                  <img 
                    src={ownerInfo?.logo?.dark}
                    className=' h-full object-contain no-sellect'
                  /> : 
                activeTheme == "dark" ?
                  <img 
                    src={ownerInfo?.logo?.light}
                    className=' h-full object-contain no-sellect'
                  /> :
                null
              }
                </div>

                <SearchBar
                    containerClassName='w-full'
                    className='w-20 border-[0.5px] border-gray-100 h-14'
                    inputClassName='w-20 bg-transparent'
                    style={{
                        borderColor: colors.dark[300],
                        backgroundColor: colors.dark[100]
                    }}
                    inputStyle={{
                        borderColor: colors.dark[300],
                        color: colors.light[300],
                    }}
                    searchIcon={ activeTheme == "light" ? "/icons/searchBlack.png" : "/icons/searchWhite.png" }
                    searchIconStyle={{
                        backgroundColor: colors.light[100],
                        color: colors.dark[100]
                    }}
                    resSectionStyle={{
                        backgroundColor: colors.dark[100],
                        color: colors.light[100],
                        borderRight: `0.02px solid ${colors.light[900]}`,
                        borderBottom: `0.02px solid ${colors.light[900]}`,
                        borderLeft: `0.02px solid ${colors.light[900]}`,
                        borderTop: 'none'
                    }}
                    // aiIcon=""
                    aiIconStyle={{
                        backgroundColor: colors.dark[100],
                        // color: colors.light[200]
                    }}
                    // aiIconContentStyle={{
                    //     color: colors.light[200]
                    // }}
                />

                <ul className='w-full mt-5'>
                    <li
                        className='flex h-14 border-b-[1px] border-b-gray-100 text-sm'
                        style={{
                            borderBottomColor: colors.dark[200]
                        }}
                    >
                        <Link href="/" 
                            className='w-full h-ful flex items-center px-7'
                            style={{
                                color: colors.light[200]
                            }}    
                        >{activeLanguage.nav.home}</Link>
                    </li>
                    <li
                        className='flex h-14 border-b-[1px] border-b-gray-100 text-sm'
                        style={{
                            borderBottomColor: colors.dark[200]
                        }}
                    >
                        <Link href="/collections" 
                            // onClick={() => router.replace('/pages/collections')}
                            className='w-full h-full flex items-center px-7'
                            style={{
                                color: colors.light[200]
                            }}    
                        >{activeLanguage.nav.collections}</Link>
                    </li>
                    <li
                        className='flex h-14 border-b-[1px] border-b-gray-100 text-sm'
                        style={{
                            borderBottomColor: colors.dark[200]
                        }}
                    >
                        <a href="#" 
                            className='w-full h-full flex items-center px-7'
                            style={{
                                color: colors.light[200]
                            }}    
                        >{activeLanguage.nav.contact}</a>
                    </li>
                </ul>
            </div>
            

            {swreenWidth < 1000 && <div className='h-[30vh] flex flex-col justify-start items-center gap-10 py-5'>
                <ThemeModeSelectorForMobiles/>
                <LanguageSelectorForMobile
                    className="w-full p-2"
                />
            </div>}


        </div>
      
    </div>
  )
}

export default SideBar
