"use client";
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import React, { useEffect, useState, useMemo } from 'react'
import { FiltrationType, OptionType } from '@/types';
import CustomSelectMany from '../customSelectMany';

type FilterSizeProps = {
    availableSizes: string[]
    filtrationCopy: FiltrationType
    setFiltrationCopy: (value: FiltrationType) => void
    defaultOptions?: string[]
}

const FilterSize = ({
    availableSizes,
    filtrationCopy,
    setFiltrationCopy,
    defaultOptions
}: FilterSizeProps) => {

    const { activeLanguage } = useLanguage();
    const { colors } = useTheme();
    
    const options: OptionType[] = useMemo(() => [
        {
            label: `${activeLanguage.sideMatter.all} ${activeLanguage.sideMatter.sizes}`, 
            value: "all"
        },
        ...availableSizes.map(size => ({
            label: size ?? "",
            value: size ?? ""
        }))
    ], [availableSizes, activeLanguage]);

    const [currentOptions, setCurrentOptions] = useState<OptionType[]>([]);

    useEffect(() => {
        if (!defaultOptions || defaultOptions.length === 0 || options.length <= 1) {
            setCurrentOptions([options[0]]);
            return;
        }

        const isAllSelected = defaultOptions.includes("all") || defaultOptions.length === availableSizes.length;

        if (isAllSelected) {
            setCurrentOptions([options[0]]);
        } else {
            const mapped = options.filter(opt => defaultOptions.includes(opt.value));
            setCurrentOptions(mapped.length > 0 ? mapped : [options[0]]);
        }
    }, [defaultOptions, options]);

    useEffect(() => {
        const selectedValues = currentOptions.map(opt => opt.value);
        
        if (JSON.stringify(selectedValues) !== JSON.stringify(filtrationCopy.sizes)) {
            setFiltrationCopy({
                ...filtrationCopy,
                sizes: selectedValues
            });
        }
    }, [currentOptions]);
    
    return (
        <div className="w-full px-4- py-2- border-b" style={{ borderColor: colors.light[200] }}>
            <h4 
                className="text-[13px] font-black uppercase tracking-widest mb-3 opacity-80"
                style={{ color: colors.dark[100] }}
            >
                {activeLanguage.sideMatter.sizes}
            </h4>

            <CustomSelectMany
                label={activeLanguage.sideMatter.sizes}
                options={options}
                currentOptions={currentOptions}
                setCurrentOptions={setCurrentOptions}
            />
        </div>
    )
}

export default FilterSize;