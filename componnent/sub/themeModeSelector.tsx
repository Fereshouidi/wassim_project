"use client";
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import { Themes } from '@/types';
import React, { useEffect, useState } from 'react'

const ThemeMode = () => {

  const { themeDispo, activeTheme, setActiveTheme, colors } = useTheme();
  const [optionsListExist, setOptionListExit] = useState<boolean>(false);
  const { activeLanguage } = useLanguage();
  const [deviceTheme, setDeviceTheme] = useState<"light" | "dark" |undefined>(undefined);
  const [firstRender, setFirstRender] = useState<boolean>(true);
  const [replaceSystemtoRealTheme, setReplaceSystemtoRealTheme] = useState<boolean>(false);


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

    if (firstRender) return;

    if (activeChoise.theme == "system") {
        setActiveTheme(deviceTheme? "dark" : "light")
    } else {
        setActiveTheme(activeChoise.theme);
    }
    
    localStorage.setItem('activeTheme', activeChoise.theme)

  }, [activeChoise, deviceTheme])

  useEffect(() => {
    const storedTheme = localStorage.getItem('activeTheme') as Themes;    
    const storedTheme_ = themeDispo.find(( theme ) => theme.theme == storedTheme);

    if (storedTheme_) {
      setActiveChoise({
        theme: storedTheme_?.theme,
        label: storedTheme_?.label
      });
    };
    setFirstRender(false);
  }, [])

  return (

    <div 
      className='w-28 h-full flex justify-center items-center cursor-pointer no-sellect relative z-50'
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

            {themeDispo.map((theme, index) => (

              <li 
                key={index}
                className={`flex w-full h-full items-center gap-2 px-6`}
                style={{
                  display: optionsListExist ? "" : "none",
                  backgroundColor: activeChoise.label == theme.label ? colors.dark[100] : colors.light[100]
                }}
                onMouseEnter={(e) => {
                  if (activeTheme != theme.theme) {
                    e.currentTarget.style.backgroundColor = colors.light[200]
                  } else {
                    e.currentTarget.style.backgroundColor = colors.dark[200]
                  }
                }}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = activeChoise.label == theme.label ? 
                  colors.dark[100] : 
                  colors.light[100]
                )}
                onClick={() => setActiveChoise({
                  theme: theme.theme,
                  label: theme.label
                })}
              >
                <img 
                  className='w-5 h-5'
                  src={activeTheme == "dark" ? 

                    activeChoise.label == theme.label ? theme.icon.light : theme.icon.dark
                    :
                    activeChoise.label == theme.label ? theme.icon.dark : theme.icon.light
                     
                  
                  }
                  alt="" 
                />
                <h6
                  style={{
                    color: activeChoise.label == theme.label ? colors.light[100] : colors.dark[100]
                  }}
                >{theme.label}</h6>
              </li>

            ))}

          </ul>

      </div>

    </div>
  )
}

export default ThemeMode;
