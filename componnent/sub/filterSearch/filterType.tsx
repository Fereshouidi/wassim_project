import { useLanguage } from '@/contexts/languageContext';
import React, { useEffect, useState, useMemo } from 'react'
import { FiltrationType, OptionType } from '@/types';
import CustomSelectMany from '../customSelectMany';

type FilterCollection = {
    availableType: string[]
    filtrationCopy: FiltrationType
    setFiltrationCopy: (value: FiltrationType) => void
    defaultOptions?: string[]
}

const FilterType = ({
    availableType,
    filtrationCopy,
    setFiltrationCopy,
    defaultOptions
}: FilterCollection) => {

    const { activeLanguage } = useLanguage();

    const options: OptionType[] = useMemo(() => [
        {
            label: activeLanguage.sideMatter.all + " " + activeLanguage.sideMatter.types, 
            value: "all"
        },
        ...availableType.map(type => ({
            label: type,
            value: type
        }))
    ], [availableType, activeLanguage]);

    const [currentOptions, setCurrentOptions] = useState<OptionType[]>([]);

    useEffect(() => {
        if (!defaultOptions || defaultOptions.length === 0 || defaultOptions.length === availableType.length) {
            setCurrentOptions([options[0]]);
        } else {
            const mapped = defaultOptions.map(type => ({
                label: type,
                value: type
            }));
            setCurrentOptions(mapped);
        }
    }, [defaultOptions, options, availableType.length]);

    useEffect(() => {
        const selectedValues = currentOptions.map(opt => opt.value);
        
        if (JSON.stringify(selectedValues) !== JSON.stringify(filtrationCopy.types)) {
            setFiltrationCopy({
                ...filtrationCopy,
                types: selectedValues
            });
        }
    }, [currentOptions]);

    return (
        <div className='w-full- min-w-[130px] h-full p-2'>
            <h4 className='sm:m-5 mb-4 font-extrabold'>
                {activeLanguage.sideMatter.types + " : "}
            </h4>

            <CustomSelectMany
                label={activeLanguage.sideMatter.types}
                options={options}
                currentOptions={currentOptions}
                setCurrentOptions={setCurrentOptions}
            />
        </div>
    )
}

export default FilterType;