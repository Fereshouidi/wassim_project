"use client";
import { useTheme } from '@/contexts/themeProvider';
import React from 'react';

const Footer = () => {

    const { colors } = useTheme();

    return (
        <div 
            className='w-full min-h-[250px] p-5 sm:p-10'
            style={{
                backgroundColor: "black",
                color: colors.light[200]
            }}
        >
            Footer
        </div>
    )
}

export default Footer
