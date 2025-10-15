import { english, frensh, languagesDispo } from '@/constent/language'
import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import React, { useEffect, useState } from 'react'

type LanguageSelectorProps = {
    className?: string
}

const LanguageSelectorForMobile = ({
    className
}: LanguageSelectorProps) => {

    const { activeTheme, colors } = useTheme();
    const { activeLanguage, setActiveLanguage } = useLanguage();
    const [optionsListExist, setOptionListExit] = useState<boolean>(true);
    
    useEffect(() => {
        const storedLanguage = localStorage.getItem("activeLanguage");
        const storedLanguage_ = languagesDispo.find(lang => lang.language == storedLanguage);
        if (!storedLanguage_) return;
        
        setActiveLanguage(storedLanguage_)
    }, [])
    
  return (
    <div 
        className={`w-32 relative flex flex-row justify-center items-center outline-none ${className} cursor-pointer no-sellect`}
        style={{
            color: colors.light[200]
        }}
        onClick={() => setOptionListExit(!optionsListExist)}
        tabIndex={0}
        onBlur={() => setOptionListExit(false)}
    >

        <img 
            className='w-4 h-4 mx-2'
            src={activeTheme == "light" ? "/icons/world-white.png" : "/icons/world-black.png" }
            alt="" 
        />

        <select 
            className='w-full h-full outline-none'
            style={{
                color: colors.light[200]
            }}
            onChange={(e) => {
                const selectedLang = languagesDispo.find(lan => lan.language === e.target.value);
                if (selectedLang) setActiveLanguage(selectedLang);
            }}
        >
            {languagesDispo.map((language, index) => (
                <option 
                    key={index} 
                    value={language.language}
                    style={{
                        color: colors.dark[200]
                    }}
                    onClick={() => {
                        setActiveLanguage(language);
                        localStorage.setItem("activeLanguage", language.language)
                    }}
                >
                    {language.label}
                </option>
            ))}
        </select>


    </div>
  )
}

export default LanguageSelectorForMobile
