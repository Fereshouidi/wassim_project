"use client";
import { useTheme } from '@/contexts/themeProvider';
import { CustomSelectManyType, OptionType } from '@/types';
import React, { useEffect, useRef, useState } from 'react';
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
    const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setOptionsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (optionClicked: OptionType) => {
        if (optionClicked.value === "all") {
            return setCurrentOptions([optionClicked]);
        }

        let newOptions = currentOptions.filter(o => o.value !== "all");

        if (currentOptions.some(o => o.value === optionClicked.value)) {
            newOptions = newOptions.filter(o => o.value !== optionClicked.value);
        } else {
            newOptions = [...newOptions, optionClicked];
        }

        setCurrentOptions(newOptions.length > 0 ? newOptions : [options.find(o => o.value === "all") || options[0]]);
    };

    const isSelected = (value: string) => currentOptions.some(o => o.value === value);

    return (
        <div 
            ref={selectRef}
            className={twMerge(
                "relative min-w-[140px] w-full cursor-pointer select-none border transition-all duration-300",
                optionsOpen ? "rounded-t-2xl shadow-lg" : "rounded-2xl",
                className
            )}
            style={{
                borderColor: colors.light[300],
                backgroundColor: colors.light[100],
                color: colors.dark[100],
                ...style
            }}
            onClick={() => setOptionsOpen(!optionsOpen)}
        >
            <div className="flex items-center justify-between px-4 h-11">
                <div className="flex items-center gap-2 overflow-hidden">
                    <span 
                        className="flex items-center justify-center min-w-[20px] h-[20px] rounded-full text-[10px] font-black"
                        style={{ backgroundColor: colors.dark[100], color: colors.light[100] }}
                    >
                        {currentOptions.some(o => o.value === "all") ? options.length - 1 : currentOptions.length}
                    </span>
                    <span className="text-[12px] font-bold truncate opacity-80 uppercase tracking-tighter">
                        {label}
                    </span>
                </div>
                
                <img 
                    src={activeTheme == "dark" ? "/icons/down-arrow-white.png" : "/icons/down-arrow-black.png" }
                    className={`w-3 h-3 transition-transform duration-300 ${optionsOpen ? "rotate-180" : ""}`}
                />
            </div>

            <div 
                className={twMerge(
                    "absolute top-[calc(100%-1px)] left-0 w-full overflow-hidden z-[100] border-x border-b rounded-b-2xl transition-all duration-300 ease-in-out shadow-xl",
                    optionsOpen ? "max-h-[250px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                )}
                style={{
                    backgroundColor: colors.light[100],
                    borderColor: colors.light[300]
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="max-h-[250px] overflow-y-auto scrollbar-hidden py-2">
                    {options.map((option, index) => {
                        const active = isSelected(option.value);
                        return (
                            <div
                                key={index}
                                onClick={() => handleChange(option)}
                                className="px-4 py-2.5 text-[12px] font-medium transition-colors flex items-center justify-between group"
                                style={{
                                    backgroundColor: active ? colors.dark[100] : 'transparent',
                                    color: active ? colors.light[100] : colors.dark[100],
                                }}
                            >
                                <span className={active ? "font-black" : "opacity-70 group-hover:opacity-100"}>
                                    {option.label}
                                </span>
                                {active && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.light[100] }} />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CustomSelectMany;