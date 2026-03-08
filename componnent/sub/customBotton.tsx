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
            className={`flex items-center justify-center gap-2 h-11 px-6 rounded-xl font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95 shadow-md hover:shadow-lg ${className}`}
            style={{
                backgroundColor: colors.dark[100],
                color: 'white',
                ...style
            }}
            onClick={onclick}
        >
            {label}
        </button>
    )
}

export default CustomBotton
