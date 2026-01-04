import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import React, { useEffect, useState } from 'react'
import CustomSelect from '../customSelect';
import { CollectionType, FiltrationType, OptionType } from '@/types';
import CustomSelectMany from '../customSelectMany';

type FilterCollection = {
    availableColors: string[]
    filtrationCopy: FiltrationType
    setFiltrationCopy: (value: FiltrationType) => void
    defaultOptions?:string[]
}

const FilterColor = ({
    availableColors,
    filtrationCopy,
    setFiltrationCopy,
    defaultOptions
}: FilterCollection) => {

    const { activeLanguage } = useLanguage();
    const { colors } = useTheme();
    
    const options: OptionType[] = React.useMemo(() => [
        {
            label: `${activeLanguage.sideMatter.all} ${activeLanguage.sideMatter.colors}`, 
            value: "all"
        },
        ...availableColors.map(color => ({ label: color, value: color }))
    ], [availableColors, activeLanguage]);

    const [currentOptions, setCurrentOptions] = useState<OptionType[]>([]);

    useEffect(() => {
        if (!defaultOptions || defaultOptions.length === 0) {
            setCurrentOptions([options[0]]);
        } else if (defaultOptions.length === availableColors.length) {
            setCurrentOptions([options[0]]);
        } else {
            const mapped = defaultOptions.map(color => ({
                label: color,
                value: color
            }));
            setCurrentOptions(mapped);
        }
    }, [defaultOptions, options]);

    useEffect(() => {
        const selectedValues = currentOptions.map(opt => opt.value);
        
        if (JSON.stringify(selectedValues) !== JSON.stringify(filtrationCopy.colors)) {
            setFiltrationCopy({
                ...filtrationCopy,
                colors: selectedValues
            });
        }
    }, [currentOptions]);

    return (
        <div className='w-full- min-w-[130px] h-full p-2'>
            <h4 className='sm:m-5 mb-4 font-extrabold'>
                {activeLanguage.sideMatter.colors} :
            </h4>

            <CustomSelectMany
                label={activeLanguage.sideMatter.color}
                options={options}
                currentOptions={currentOptions}
                setCurrentOptions={setCurrentOptions}
            />
        </div>
    );
}

export default FilterColor;
