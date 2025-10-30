import { useTheme } from '@/contexts/themeProvider'
import { CustomSelectType } from '@/types'
import React, { CSSProperties, useEffect, useRef, useState } from 'react'



const CustomSelect = ({
    options,
    currentOption,
    setCurrentOption,
    className,
    style,
}: CustomSelectType) => {

    const { activeTheme, colors } = useTheme();
    const [optionsOpen, setOptionsOpent] = useState<boolean>(false);
    const optionsRef = useRef<(HTMLParagraphElement | null)[]>([]);
    const selectRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (selectRef.current && !selectRef.current?.contains(event.target as Node)) {
        setOptionsOpent(false);
        }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);

    const optionStyle: CSSProperties = {
        backgroundColor: 'transparent',
        color: colors.dark[250]
    }

    const optionHoverStyle: CSSProperties = {
        backgroundColor: colors.dark[250],
        color: colors.light[250]
    }

    const activeOptionStyle: CSSProperties = {
        backgroundColor: colors.dark[200],
        color: colors.light[200]
    }

    return (
        <div 
            className={`min-w-[170px] relative cursor-pointer no-sellect border-[0.02px] rounded-sm duration-300 ${className}`}
            style={{
                border: `0.002px solid ${colors.light[400]}`,
                backgroundColor: colors.light[150],
                ...style
            }}
            ref={selectRef}
            onClick={() => setOptionsOpent(!optionsOpen)}
        >
            <div className='w-full h-7 rounded-sm px-1 py-5 z-10 flex flex-row justify-between items-center'>
                <h4 className='text-[14px]'>{currentOption.label}</h4>
                <img 
                    src={activeTheme == "dark" ? "/icons/down-arrow-white.png" : "/icons/down-arrow-black.png" }
                    className='w-6 h-6 ml-1'
                />
            </div>

            <div 
                className={`w-full max-h-[200px] overflow-y-scroll absolute top-full left-0 z-[999] duration-300 ${!optionsOpen && 'invisible'}`}
                style={{
                    border: `0.002px solid ${colors.light[400]}`,
                    backgroundColor: colors.light[150]
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {
                    options.map((option, index) => (
                        <p
                            key={index}
                            className='px-1 cursor-pointer text-[14px]'
                            ref={(el) => {
                                if (optionsRef.current) {
                                    optionsRef.current[index] = el;
                                }
                            }}
                            onMouseEnter={() => {
                                const el = optionsRef.current[index];
                                if (el && currentOption.value != option.value) el.style.backgroundColor = colors.light[250];
                            }}
                            onMouseLeave={() => {
                                const el = optionsRef.current[index];
                                if (el && currentOption.value != option.value ) el.style.backgroundColor = "transparent";
                            }}

                            style={currentOption.value == option.value ? activeOptionStyle : optionStyle}
                            onClick={() => {
                                setOptionsOpent(false);
                                setCurrentOption(option);
                            }}
                        >{option.label}</p>
                    ))
                }
            </div>

        </div>
    )
}

export default CustomSelect
