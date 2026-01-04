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

    const {activeLanguage } = useLanguage();
    const { colors } = useTheme();

    return (
        <div 
            className={`w-full  ${className}`}
            style={{
                ...style
            }}
        >

            <h4
                className={`ml-5 my-3 text-[14px] ${labelClassName}`}
                style={{
                    color: colors.dark[150],
                    ...LabelStyle
                }}
            >
                {label + " : "}
            </h4>

            <input 
                className={` w-full h-12 rounded-sm bg-blue-500- text-[12px] p-2 outline-0- ${inputClassName}`}
                style={{
                    border: `1px solid ${colors.light[500]}` ,
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
