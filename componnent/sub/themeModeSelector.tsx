"use client";
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import { Themes } from '@/types';
import React, { useEffect, useState } from 'react'

const ThemeMode = () => {

  const { activeTheme, setActiveTheme, colors } = useTheme();
  const [optionsListExist, setOptionListExit] = useState<boolean>(false);
  const { activeLanguage } = useLanguage();
  const [deviceTheme, setDeviceTheme] = useState<"light" | "dark" |undefined>(undefined);

  const [activeChoise, setActiveChoise] = useState<{
    theme: Themes,
    label: string
  }>({
    theme: "system",
    label: activeLanguage.sideMatter.theme.system
  });


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

    if (activeChoise.theme == "system") {
      setActiveChoise({
        theme: !deviceTheme? "dark" : "light",
        label: activeLanguage.sideMatter.theme.system
      })
    } else {
        setActiveTheme(activeChoise.theme);
    }

  }, [activeChoise, deviceTheme])

  return (

    <div 
      className='w-28 h-full flex justify-center items-center cursor-pointer no-sellect relative'
      style={{
        color: colors.dark[200]
      }}
      onClick={() =>  setOptionListExit(!optionsListExist)}
      tabIndex={0}
      onBlur={() => setOptionListExit(false)}
    >

      <div className='w-full h-full flex flex-row justify-between items-center gap-2 '>

        <img 
          src={
            activeTheme == "light" ? '/icons/sun-black.png' :
            activeTheme == "dark" ? '/icons/night-mode-white.png' :
            "a"
          } 
          className='w-4 h-4 z-0'
          alt="" 
        />

        <h4 className='text-lg font-medium'>{activeChoise.label}</h4>

        <img 
          src={activeTheme == "dark" ? "/icons/down-arrow-white.png" : "/icons/down-arrow-black.png" }
          className='w-4 h-4 mx-2'
          alt="" 
        />
        
      </div>


      <div 
        className='options w-[120%] absolute top-full duration-100'
        style={{
          backgroundColor: colors.light[100],
          visibility: optionsListExist ? "visible" : "hidden",
          height: optionsListExist ? "50px" : "0"
        }}
      >
          
          <ul 
            className='w-full h-full'
            style={{
              // height: optionsListExist ? "120px" : "0"
            }}
          >

            <li 
              className={`flex w-full h-full items-center gap-2 px-6`}
              style={{
                display: optionsListExist ? "" : "none",
                backgroundColor: activeChoise.label == activeLanguage.sideMatter.theme.system ? colors.light[100] : colors.light[300]
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.light[400])}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = activeChoise.label == activeLanguage.sideMatter.theme.system ? 
                colors.light[100] : 
                colors.light[300]
              )}
              onClick={() => setActiveChoise({
                theme: deviceTheme? "dark" : "light",
                label: activeLanguage.sideMatter.theme.system
              })}
            >
              <img 
                className='w-5 h-5'
                src={activeTheme == "dark" ? "/icons/settings-white.png" : "/icons/settings-black.png" }
                alt="" 
              />
              <h6>{activeLanguage.sideMatter.theme.system}</h6>
            </li>
  
            <li 
              className={`flex w-full h-full items-center gap-2 px-6`}
              style={{
                display: optionsListExist ? "" : "none",
                backgroundColor: activeChoise.label == activeLanguage.sideMatter.theme.dark ? colors.light[100] : colors.light[300]
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.light[400])}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = activeChoise.label == activeLanguage.sideMatter.theme.dark ? 
                colors.light[100] : 
                colors.light[300]
              )}              
              onClick={() => setActiveChoise({
                theme: "dark",
                label: activeLanguage.sideMatter.theme.dark
              })}
            >
              <img 
                className='w-5 h-5'
                src={activeTheme == "dark" ? "/icons/night-mode-white.png" : "/icons/night-mode-black.png"} 
                alt="" 
              />
              <h6>{activeLanguage.sideMatter.theme.dark}</h6>
            </li>

            <li 
              className={`flex w-full h-full items-center gap-2 px-6`}
              style={{
                display: optionsListExist ? "" : "none",
                backgroundColor: activeChoise.label == activeLanguage.sideMatter.theme.light ? colors.light[100] : colors.light[300]
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.light[400])}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = activeChoise.label == activeLanguage.sideMatter.theme.light ? 
                colors.light[100] : 
                colors.light[300]
              )}              
              onClick={() => setActiveChoise({
                theme: "light",
                label: activeLanguage.sideMatter.theme.light
              })}
            >              
              <img 
                className='w-5 h-5'
                src={activeTheme == "dark" ? "/icons/sun-white.png" : "/icons/sun-black.png" }
                alt="" 
              />
              <h6>{activeLanguage.sideMatter.theme.light}</h6>
            </li>

          </ul>

      </div>

    </div>
  )
}

export default ThemeMode;
