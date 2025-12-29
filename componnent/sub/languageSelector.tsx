import { english, frensh, languagesDispo } from '@/constent/language'
import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { LanguageStracture } from '@/types'
import React, { useEffect, useState } from 'react'

type LanguageSelectorProps = {
    className?: string
}

const LanguageSelector = ({
    className
}: LanguageSelectorProps) => {

    const { activeTheme, colors } = useTheme();
    const { activeLanguage, setActiveLanguage } = useLanguage();
    const [optionsListExist, setOptionListExit] = useState<boolean>(false);

    const handleChange = (languageSelected: LanguageStracture) => {
        setActiveLanguage(languageSelected);
        localStorage.setItem('activeLanguage', languageSelected.language);
    }

    useEffect(() => {
        const storedLanguage = localStorage.getItem("activeLanguage");
        const storedLanguage_ = languagesDispo.find(lang => lang.language == storedLanguage);
        if (!storedLanguage_) return;
        
        setActiveLanguage(storedLanguage_)
    }, [])

  return (
    <div 
        className={`w-32 h-full relative flex flex-row justify-center items-center outline-none ${className} cursor-pointer no-sellect`}
        style={{
            color: colors.light[200]
        }}
        onClick={() => setOptionListExit(!optionsListExist)}
        tabIndex={0}
        onBlur={() => setOptionListExit(false)}
    >

        <img 
            className='w-4 h-4 mx-2'
            src={activeTheme == "dark" ? "/icons/world-white.png" : "/icons/world-black.png" }
            alt="" 
        />

        <h4 
            className='text-lg font-medium'
            style={{
                color: colors.dark[200]
            }}
        >{activeLanguage.label}</h4>

        <img 
          src={activeTheme == "dark" ? "/icons/down-arrow-white.png" : "/icons/down-arrow-black.png" }
          className='w-4 h-4 mx-2'
          alt="" 
        />

        <div 
            className='options w-full absolute top-full duration-100'
            style={{
                backgroundColor: colors.light[100],
                visibility: optionsListExist ? "visible" : "hidden",
                height: optionsListExist ? "50px" : "0"
            }}
        >
            
            <ul 
                className='w-full h-full'
                style={{
                    color: colors.dark[200]
                }}
            >
                {languagesDispo.map((language, index) => (
                    <li 
                        key={index}
                        className={`flex w-full h-full justify-center items-center gap-2`}
                        style={{
                            display: optionsListExist ? "" : "none",
                            backgroundColor: activeLanguage.language == language.language ? colors.dark[100] : colors.light[100],
                            color: activeLanguage.label == language.label ? colors.light[100] : colors.dark[100]
                        }}
                        onMouseEnter={(e) => {
                            if (activeLanguage.language != language.language) {
                                e.currentTarget.style.backgroundColor = colors.light[200]
                            } else {
                                e.currentTarget.style.backgroundColor = colors.dark[200]
                            }
                        }}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = activeLanguage.language == language.language ? 
                            colors.dark[100] : 
                            colors.light[100]
                        )}
                        onClick={() => handleChange(language)}
                    >
                        {language.label}
                    </li>
                    
                ))}

            </ul>

        </div>

    </div>
  )
}

export default LanguageSelector
