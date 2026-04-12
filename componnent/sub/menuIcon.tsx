"use client";
import { useTheme } from '@/contexts/themeProvider';
import { useSidebar } from '@/contexts/sidebarContext';
import React from 'react'

const MenuIcon = () => {

    const { activeTheme, colors } = useTheme();
    const { toggleSidebar } = useSidebar();

  return (
    <div
        className='w-6 h-6 sm:w-7 sm:h-7 cursor-pointer no-sellect'
        onClick={toggleSidebar}
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
