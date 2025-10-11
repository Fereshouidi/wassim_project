"use client";
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import { SearchBarProps } from '@/types';
// import SearchIcon from "@/app/svg/icons/search";
import React, { CSSProperties, useState, useContext, useEffect } from 'react';
// import english from '@/app/languages/english.json';
// import arabic from '@/app/languages/arabic.json';
// import { LanguageSelectorContext } from "@/app/contexts/LanguageSelectorContext";



const SearchBar = ({
    className,
    inputClassName,
    style,
    inputStyle,
    searchIcon,
    searchIconClassName,
    searchIconStyle,
}: SearchBarProps) => {

    const [focus, setFocus] = useState(false);
    const { activeTheme, colors } = useTheme();
    const { activeLanguage } = useLanguage();

    // const [activeLanguage, setActiveLanguage] = useState(english);

    // const context = useContext(LanguageSelectorContext);

    // if (!context || !context.activeLanguage) {
    //     throw new Error("LanguageSelector must be used within a LanguageSelectorContext.Provider");
    // }

    // useEffect(() => {
    //     if(context.activeLanguage == "english"){
    //         setActiveLanguage(english);
    //     }else if(context.activeLanguage == "arabic"){
    //         setActiveLanguage(arabic);
    //     }
    // }, [context.activeLanguage])
    




    // const style:CSSProperties = {
    //     backgroundColor: 'transparent',
    //     width: '50%',
    //     height: 'var(--primary-height)',
    //     position: 'relative',
    //     padding: '0',
    //     direction: 'ltr',
    //     transition: '0.7s ease',
    // }
    
    // const inputStyle:CSSProperties = {
    //     backgroundColor: 'var(--almost-white)',
    //     color: 'var(--black)',
    //     width: '100%',
    //     height: '100%',
    //     padding: '0 20px',
    //     boxSizing: 'border-box',
    // }
    
    // const inputStyleOnFocus:CSSProperties = {
    //     ...inputStyle,
    //     outline: 'none',
    // }

    return(
        <div 
            className={`w-[60%] relative flex flex-row ${className}`}
            style={style} 
        > 
            <input 
                type="text" 
                placeholder={
                    activeLanguage.sideMatter.search + "..."
                }
                className={`w-full h-full px-[20px] outline-none ${inputClassName}`} 
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                style={{
                    // color: colors.dark[100],
                    ...inputStyle
                }} 
            />
            
            <img 
                className='h-[90%] p-4 absolute right-[3px] top-[50%] translate-y-[-50%] rounded-sm cursor-pointer'
                src={searchIcon} 
                alt="" 
                style={{
                    // backgroundColor: colors.dark[100]
                    ...searchIconStyle,
                }}
            />

        </div>
    )



}
export default  SearchBar;

