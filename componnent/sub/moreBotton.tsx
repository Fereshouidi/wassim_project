"use client";
import { useLanguage } from '@/contexts/languageContext';
import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React, { useRef } from 'react'

type MoreBottonProps = {
    skip: number,
    setSkip: (value: number) => void,
    limit: number
    isLoading: boolean
    getMore?: () => void
}

const MoreBotton = ({
    skip,
    setSkip,
    limit,
    isLoading,
    getMore
}: MoreBottonProps) => {
    
    const { screenWidth } = useScreen();
    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();
    const ref = useRef<HTMLDivElement>(null);
    
    return (
        <div 
            className='w-44 h-10 border text-sm sm:-text-md cursor-pointer mt-10 rounded-xl flex justify-center items-center overflow-hidden'
            style={{
                borderColor: colors.dark[600],
                color: colors.dark[100],
                // backgroundColor: colors.light[100]
            }}
            onClick={() => {
                !isLoading && setSkip(skip + limit);
                getMore && getMore();
            }}
            ref={ref}
            onMouseEnter={(e) => {
                if (screenWidth > 1000) {
                    e.currentTarget.style.backgroundColor = colors.dark[100],
                    e.currentTarget.style.color = colors.light[100]
                }
            }}
            onMouseLeave={(e) => (
                e.currentTarget.style.backgroundColor = "transparent",
                e.currentTarget.style.color = colors.dark[100]
            )}
            
        >
            {
                isLoading ?
                    <DotLottieReact
                        src="/icons/LoadingDotsBlack.json"
                        className='w-full h-full scale-[200%]'
                        loop
                        autoplay
                    /> 
                    :
                activeLanguage.sideMatter.more
            }
        </div>
    )
}

export default MoreBotton
