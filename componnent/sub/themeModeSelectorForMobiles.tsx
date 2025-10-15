"use client";
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import { Themes } from '@/types';
import React, { useEffect, useState } from 'react'

const ThemeModeSelectorForMobiles = () => {

    const [activeChoise, setActiveChoise] = useState<Themes>("light");
    const { activeTheme, setActiveTheme, colors } = useTheme();
    const { activeLanguage } = useLanguage();
    const [deviceTheme, setDeviceTheme] = useState<"light" | "dark" | undefined>(undefined);
    const [firstRender, setFirstRender] = useState<boolean>(true);


    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        setDeviceTheme(mediaQuery.matches ? "dark" : "light");

        const handler = (e: MediaQueryListEvent) => {
            setDeviceTheme(e.matches ? "dark" : "light");
        };

        mediaQuery.addEventListener('change', handler);

        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    useEffect(() => {

      if (firstRender) return;

        if (activeChoise == "system") {
          if (!deviceTheme) return;
          setActiveTheme( deviceTheme );
          localStorage.setItem('activeTheme', "system");
        } else {
          setActiveTheme(activeChoise);
          localStorage.setItem('activeTheme', activeChoise);
        }

    }, [activeChoise, deviceTheme])

    useEffect(() => {
      const storedTheme = localStorage.getItem('activeTheme') as Themes;
      setActiveChoise(storedTheme);
      setFirstRender(false);
    }, [])

  return (
    <div className='w-full flex flex-row justify-center gap-3 no-sellect'>
      
      <div 
        className='flex flex-col justify-center items-center p-2 gap-1 cursor-pointer'
      >
        
        <div 
            className={`w-12 h-12  p-1 flex justify-center items-center`}
            style={{
                border: activeChoise == "system" ? `2px solid ${colors.light[100]}` : `0.5px solid ${colors.dark[300]}`
            }}
            onClick={() => setActiveChoise("system")}  
        >
            <img 
                className='w-5 h-5'
                src={activeTheme == "light" ? "/icons/settings-white.png" : "/icons/settings-black.png" }
                alt="" 
            />
        </div>
        
        <h6 className='text-[10px]' style={{color: colors.light[200]}}>{activeLanguage.sideMatter.theme.system}</h6>
      </div>

      <div 
        className='flex flex-col justify-center items-center p-2 gap-1 cursor-pointer'
        onClick={() => setActiveChoise("dark")}  
      >
        
        <div 
            className={`w-12 h-12 p-1 flex justify-center items-center`}
            style={{
                border: activeChoise == "dark" ? `2px solid ${colors.light[100]}` : `0.5px solid ${colors.dark[300]}`
            }}
        >
            <img 
                className='w-5 h-5'
                src={activeTheme == "light" ? "/icons/night-mode-white.png" : "/icons/night-mode-black.png"} 
                alt="" 
            />
        </div>
        
        <h6 className='text-[10px]' style={{color: colors.light[200]}}>{activeLanguage.sideMatter.theme.dark}</h6>
      </div>

      <div 
        className='flex flex-col justify-center items-center p-2 gap-1 cursor-pointer'
        onClick={() => setActiveChoise("light")}  
      >
        
        <div 
            className={`w-12 h-12 p-1 flex justify-center items-center`}
            style={{
                border: activeChoise == "light" ? `2px solid ${colors.light[100]}` : `0.5px solid ${colors.dark[300]}`
            }}
        >
            <img 
                className='w-5 h-5'
                src={activeTheme == "light" ? "/icons/sun-white.png" : "/icons/sun-black.png" }
                alt="" 
            />
        </div>
        
        <h6 className='text-[10px]' style={{color: colors.light[200]}}>{activeLanguage.sideMatter.theme.light}</h6>
      </div>

    </div>
  )
}

export default ThemeModeSelectorForMobiles
