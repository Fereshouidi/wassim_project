"use client";
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import React, { useRef } from 'react'

type MoreBottonProps = {
    skip: number,
    setSkip: (value: number) => void,
    limit: number
}

const MoreBotton = ({
    skip,
    setSkip,
    limit
}: MoreBottonProps) => {
    
    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();
    const ref = useRef<HTMLDivElement>(null);
    
    return (
        <div 
            className='border py-3 sm:py-2 px-10 cursor-pointer m-5 text-sm sm:text-[17px] rounded-sm'
            style={{
                borderColor: colors.dark[600],
                color: colors.dark[100],
                // backgroundColor: colors.light[100]
            }}
            onClick={() => setSkip(skip + limit)}
            ref={ref}
            onMouseEnter={(e) => (
                e.currentTarget.style.backgroundColor = colors.dark[100],
                e.currentTarget.style.color = colors.light[100]
            )}
            onMouseLeave={(e) => (
                e.currentTarget.style.backgroundColor = "transparent",
                e.currentTarget.style.color = colors.dark[100]
            )}
            
        >
            {activeLanguage.sideMatter.more}
        </div>
    )
}

export default MoreBotton
