import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import React, { useEffect, useState, useMemo } from 'react'
import { FiltrationType, OptionType } from '@/types';
import CustomSelectMany from '../customSelectMany';

type FilterCollection = {
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
}: FilterCollection) => {

    const { activeLanguage } = useLanguage();
    
    const options: OptionType[] = useMemo(() => [
        {
            label: activeLanguage.sideMatter.all + " " + activeLanguage.sideMatter.sizes, 
            value: "all"
        },
        ...availableSizes.map(size => ({
            label: size,
            value: size
        }))
    ], [availableSizes, activeLanguage]);

    const [currentOptions, setCurrentOptions] = useState<OptionType[]>([]);

    useEffect(() => {
        if (!defaultOptions || defaultOptions.length === 0 || defaultOptions.length === availableSizes.length) {
            setCurrentOptions([options[0]]);
        } else {
            const mapped = defaultOptions.map(size => ({
                label: size,
                value: size
            }));
            setCurrentOptions(mapped);
        }
    }, [defaultOptions, options, availableSizes.length]);

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
        <div className='w-full- min-w-[130px] h-full p-2'>
            <h4 className='sm:m-5 mb-4 font-bold'>
                {activeLanguage.sideMatter.sizes + ": "}
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