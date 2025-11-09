import { useTheme } from '@/contexts/themeProvider'
import { CustomSelectManyType, CustomSelectType, OptionType } from '@/types'
import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge';



const CustomSelectMany = ({
    label,
    options,
    currentOptions,
    setCurrentOptions,
    className,
    style,
}: CustomSelectManyType) => {

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

    const handleChange = (optionClicked: OptionType) => {
        if (optionClicked.value === "all") {
            return setCurrentOptions([optionClicked]);
        }

        if (currentOptions.some(option_ => option_.value === "all")) {
            return setCurrentOptions([optionClicked]);
        }

        if (currentOptions.some(option_ => option_.value === optionClicked.value)) {
            return setCurrentOptions(
            currentOptions.filter(option_ => option_.value !== optionClicked.value)
            );
        }

        setCurrentOptions([...currentOptions, optionClicked]);
    };


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
            className={twMerge(
                "w-[150px]- w-full- h-[200px]- relative cursor-pointer select-none border rounded-sm duration-300 z-[50]-",
                className
            )}
            style={{
                border: `0.002px solid ${colors.light[400]}`,
                backgroundColor: colors.light[150],
                ...style
            }}
            ref={selectRef}
            onClick={() => setOptionsOpent(!optionsOpen)}
        >
            <div className='w-full h-7 rounded-sm px-1 py-5 z-10 flex flex-row justify-between items-center'>
                <div className='w-full flex flex-row justify-center items-center'>
                    <h4 className='text-[14px] text-center m-2'>{
                        currentOptions.some(option_ => option_.value === "all") ?
                            options.length - 1
                        : currentOptions.length
                    }</h4>
                    <h4 className='text-[14px] text-center'>{label}</h4>
                </div>
                <img 
                    src={activeTheme == "dark" ? "/icons/down-arrow-white.png" : "/icons/down-arrow-black.png" }
                    className='w-6 h-6 ml-1'
                />
            </div>

            <div 
                className={`w-full max-h-[200px] overflow-y-scroll scrollbar-hidden absolute top-full left-0 z-[999] duration-300 ${!optionsOpen && 'hidden'}`}
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
                            className='px-1 py-1 cursor-pointer text-[14px]'
                            ref={(el) => {
                                if (optionsRef.current) {
                                    optionsRef.current[index] = el;
                                }
                            }}
                            onMouseEnter={() => {
                                const el = optionsRef.current[index];
                                if (el && !currentOptions.some(o => o.value === option.value)) {
                                    el.style.backgroundColor = colors.light[250];
                                }
                            }}
                            onMouseLeave={() => {
                                const el = optionsRef.current[index];
                                if (el && !currentOptions.some(o => o.value === option.value)) {
                                    el.style.backgroundColor = "transparent";
                                }
                            }}

                            style={currentOptions.some(option_ => option_.value === option.value) ? activeOptionStyle : optionStyle}
                            onClick={() => handleChange(option) }

                        >{option.label}</p>
                    ))
                }
            </div>

        </div>
    )
}

export default CustomSelectMany
