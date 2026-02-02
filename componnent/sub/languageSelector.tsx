"use client";
import { languagesDispo } from '@/constent/language';
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import { LanguageStracture } from '@/types';
import React, { useEffect, useState } from 'react';

type LanguageSelectorProps = {
  className?: string;
};

const LanguageSelector = ({ className }: LanguageSelectorProps) => {
  const { activeTheme, colors } = useTheme();
  const { activeLanguage, setActiveLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLanguage = localStorage.getItem("activeLanguage");
    if (storedLanguage) {
      const found = languagesDispo.find(lang => lang.language === storedLanguage);
      if (found) setActiveLanguage(found);
    }
  }, [setActiveLanguage]);

  const handleChange = (languageSelected: LanguageStracture) => {
    setActiveLanguage(languageSelected);
    localStorage.setItem('activeLanguage', languageSelected.language);
    setIsOpen(false);
  };

  if (!mounted) return <div className={`w-32 h-10 ${className}`} />;

  return (
    <div 
      className={`w-32 h-10 relative flex justify-center items-center outline-none cursor-pointer no-sellect z-[60] ${className}`}
      style={{ color: colors.dark[200] }}
      onClick={() => setIsOpen(!isOpen)}
      onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      tabIndex={0}
    >
      <div className='w-full h-full flex flex-row justify-between items-center px-2 gap-2'>
        <img 
          className='w-4 h-4 object-contain'
          src={activeTheme === "dark" ? "/icons/world-white.png" : "/icons/world-black.png"}
          alt="lang" 
        />

        <h4 className='text-md font-medium truncate flex-1 text-center'>{activeLanguage.label}</h4>

        <img 
          src={activeTheme === "dark" ? "/icons/down-arrow-white.png" : "/icons/down-arrow-black.png"}
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          alt="arrow" 
        />
      </div>

      <div 
        className='absolute top-full left-0 w-full duration-200 shadow-xl rounded-md overflow-hidden border border-black/5'
        style={{
          backgroundColor: colors.light[100],
          visibility: isOpen ? "visible" : "hidden",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(-10px)"
        }}
      >
        <ul className='w-full flex flex-col'>
          {languagesDispo.map((language, index) => {
            const isSelected = activeLanguage.language === language.language;
            return (
              <li 
                key={index}
                className='flex w-full items-center justify-center px-4 py-3 text-md font-medium transition-colors'
                style={{
                  backgroundColor: isSelected ? colors.dark[100] : colors.light[100],
                  color: isSelected ? colors.light[100] : colors.dark[100]
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = colors.light[200];
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = colors.light[100];
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChange(language);
                }}
              >
                {language.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default LanguageSelector;