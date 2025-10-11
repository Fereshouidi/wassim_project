"use client";
import { useTheme } from '@/contexts/themeProvider';
import { MenuIconProps, SideBarProps } from '@/types';
import React from 'react'

const MenuIcon = ({
    isSideBarActive,
    setIsSideBarActive
}: MenuIconProps) => {

    const { activeTheme, colors } = useTheme();

  return (
    <div
        className='w-6 h-6 sm:w-7 sm:h-7 cursor-pointer no-sellect'
        onClick={() => setIsSideBarActive(!isSideBarActive)}
    >
        <img 
        className='w-full h-full'
        src={ activeTheme == "dark" ? "/icons/menuWhite.png" : "/icons/menuBlack.png"} 
        alt="" 
        />
    </div>
  )
}

export default MenuIcon
