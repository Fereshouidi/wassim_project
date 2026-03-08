import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import React, { ChangeEventHandler, CSSProperties } from 'react'

type Props = {
    label: string
    style?: CSSProperties
    className?: string
    LabelStyle?: CSSProperties
    labelClassName?: string
    inputClassName?: string
    inputStyle?: CSSProperties
    placeholder?: string
    value?: string
    defaultValue?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    type: 'text' | 'number' | 'email' | 'password' | 'tel' | 'date'
    pattern?: string
    minLength?: number
    maxLength?: number
}

const CustomInputText = ({
    label,
    style,
    className,
    LabelStyle,
    labelClassName,
    inputClassName,
    inputStyle,
    placeholder,
    value,
    defaultValue,
    onChange,
    type,
    pattern,
    minLength,
    maxLength
}: Props) => {

    const { activeLanguage } = useLanguage();
    const { colors } = useTheme();

    return (
        <div
            className={`w-full group ${className}`}
            style={{
                ...style
            }}
        >

            <h4
                className={`ml-1 mb-2 text-[13px] font-bold transition-colors ${labelClassName}`}
                style={{
                    color: colors.dark[200],
                    ...LabelStyle
                }}
            >
                {label}
            </h4>

            <input
                className={`w-full h-11 rounded-xl bg-transparent text-[13px] px-4 outline-none transition-all duration-300 border focus:ring-2 focus:ring-opacity-20 ${inputClassName}`}
                style={{
                    borderColor: colors.light[500],
                    color: colors.dark[100],
                    ...inputStyle
                }}
                type={type}
                pattern={pattern}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                minLength={minLength}
                maxLength={maxLength}
            />

        </div>
    )
}

export default CustomInputText
