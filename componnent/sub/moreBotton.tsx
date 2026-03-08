"use client";
import { useLanguage } from '@/contexts/languageContext';
import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React, { useRef, useState } from 'react'

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
    const { colors, activeTheme } = useTheme();
    const { activeLanguage } = useLanguage();
    const [isHovered, setIsHovered] = useState(false);
    const isDark = activeTheme === 'dark';
    const shouldInvert = (isDark && !isHovered) || (!isDark && isHovered);
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div
            className='w-44 h-10 border text-sm sm:-text-md cursor-pointer mt-10 rounded-xl flex justify-center items-center overflow-hidden transition-all duration-300'
            style={{
                borderColor: colors.dark[600],
                backgroundColor: isHovered && screenWidth > 1000 ? colors.dark[100] : "transparent",
                color: isHovered && screenWidth > 1000 ? colors.light[100] : colors.dark[100],
            }}
            onClick={() => {
                !isLoading && setSkip(skip + limit);
                getMore && getMore();
            }}
            ref={ref}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}

        >
            {
                isLoading ?
                    <DotLottieReact
                        src="/icons/LoadingDotsBlack.json"
                        className='w-full h-full scale-[200%]'
                        style={{ filter: shouldInvert ? 'invert(1)' : 'none' }}
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
