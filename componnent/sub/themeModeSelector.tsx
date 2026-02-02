"use client";
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import { Themes } from '@/types';
import React, { useEffect, useState, useMemo } from 'react';

const ThemeMode = () => {
  const { themeDispo, activeTheme, setActiveTheme, colors } = useTheme();
  const { activeLanguage } = useLanguage();
  
  const [isOpen, setIsOpen] = useState(false);
  const [deviceTheme, setDeviceTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  const [activeChoice, setActiveChoice] = useState<{ theme: Themes; label: string }>({
    theme: "system",
    label: activeLanguage.sideMatter.theme.system
  });

  // Handle System Theme detection
  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDeviceTheme(mediaQuery.matches ? "dark" : "light");

    const handler = (e: MediaQueryListEvent) => setDeviceTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener('change', handler);
    
    const stored = localStorage.getItem('activeTheme') as Themes;
    if (stored) {
      const found = themeDispo.find(t => t.theme === stored);
      if (found) setActiveChoice({ theme: found.theme, label: found.label });
    }

    return () => mediaQuery.removeEventListener('change', handler);
  }, [themeDispo]);

  // Sync theme changes
  useEffect(() => {
    if (!mounted) return;

    const themeToApply = activeChoice.theme === "system" ? deviceTheme : activeChoice.theme;
    setActiveTheme(themeToApply);
    localStorage.setItem('activeTheme', activeChoice.theme);
  }, [activeChoice, deviceTheme, mounted, setActiveTheme]);

  // Memoized icon logic to keep JSX clean
  const currentIcon = useMemo(() => {
    if (activeTheme === "light") return '/icons/sun-black.png';
    return '/icons/night-mode-white.png';
  }, [activeTheme]);

  if (!mounted) return <div className="w-28 h-full" />; // Prevent hydration mismatch

  return (
    <div 
      className='w-32 h-10 flex justify-center items-center cursor-pointer no-sellect relative z-50 rounded-lg transition-all'
      style={{ color: colors.dark[200] }}
      onClick={() => setIsOpen(!isOpen)}
      onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Delay to allow onClick of items
      tabIndex={0}
    >
      <div className='w-full h-full flex flex-row justify-between items-center px-2 gap-2'>
        <img src={currentIcon} className='w-4 h-4 object-contain' alt="theme" />
        <span className='text-md font-semibold truncate flex-1'>{activeChoice.label}</span>
        <img 
          src={activeTheme === "dark" ? "/icons/down-arrow-white.png" : "/icons/down-arrow-black.png"}
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          alt="arrow" 
        />
      </div>

      {/* Dropdown Menu */}
      <div 
        className={`absolute top-[110%] left-0 w-full rounded-xl overflow-hidden shadow-2xl transition-all duration-300 origin-top
          ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
        style={{ 
          backgroundColor: colors.light[100],
          border: `1px solid ${colors.dark[100]}20`
        }}
      >
        <ul className='flex flex-col py-1'>
          {themeDispo.map((item, index) => {
            const isActive = activeChoice.theme === item.theme;
            return (
              <li 
                key={index}
                className='flex items-center gap-3 px-4 py-2 text-md transition-colors duration-200'
                style={{
                  backgroundColor: isActive ? colors.dark[100] : 'transparent',
                  color: isActive ? colors.light[100] : colors.dark[100]
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = `${colors.dark[100]}15`;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveChoice({ theme: item.theme, label: item.label });
                  setIsOpen(false);
                }}
              >
                <img 
                  className='w-4 h-4 object-contain'
                  src={activeTheme === "dark" 
                    ? (isActive ? item.icon.light : item.icon.dark)
                    : (isActive ? item.icon.dark : item.icon.light)
                  }
                  alt={item.label} 
                />
                <span className="font-medium">{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default ThemeMode;