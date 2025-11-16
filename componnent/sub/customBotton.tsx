import { useTheme } from '@/contexts/themeProvider'
import React, { CSSProperties, MouseEventHandler } from 'react'

type Props = {
    label: string
    className?: string
    style?: CSSProperties
    onclick?: MouseEventHandler<HTMLButtonElement> | undefined
}

const CustomBotton = ({
    label,
    className,
    style,
    onclick
}: Props) => {

    const { colors } = useTheme();
    
    return (
        <button 
            className={`w-full h-10 text-[14px] rounded-sm cursor-pointer ${className}`}
            style={{
                backgroundColor: colors.dark[100],
                color: colors.light[200],
                ...style
            }}
            onClick={onclick}
        >
            {label}
        </button>
    )
}

export default CustomBotton
