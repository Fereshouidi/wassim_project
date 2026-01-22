"use client";
import { headerHeight, headerHeightForPhones } from '@/constent';
import React, { useContext, useEffect, useState } from 'react'
import SearchBar from '../../sub/searchBar';
import ShoppingCart from '../../sub/shoppingCart';
import ThemeMode from '../../sub/themeModeSelector';
import LanguageSelector from '../../sub/languageSelector';
import { useScreen } from '@/contexts/screenProvider';
import MenuIcon from '../../sub/menuIcon';
import { HeaderProps, OwnerInfoType } from '@/types';
import { useTheme } from '@/contexts/themeProvider';
import axios from 'axios';
import { backEndUrl } from '@/api';
import { useRouter } from 'next/navigation';
import SmallScreens from './smallScreens';
import LargeScreens from './largeScreens';

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


  return screenWidth < 1200 ? 
    <SmallScreens
      isSideBarActive={isSideBarActive}
      setIsSideBarActive={setIsSideBarActive}
      searchInput={searchInput}
      className={className}
      style={style}
    /> 
    
    : 

    <LargeScreens
      isSideBarActive={isSideBarActive}
      setIsSideBarActive={setIsSideBarActive}
      searchInput={searchInput}
      className={className}
      style={style}
    />  

}

export default Header;
