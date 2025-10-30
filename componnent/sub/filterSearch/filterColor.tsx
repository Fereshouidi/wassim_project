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
}

const FilterColor = ({
    availableColors,
    filtrationCopy,
    setFiltrationCopy
}: FilterCollection) => {

    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const [options, setOptions] = useState<OptionType[]>([]);
    const [currentOptions, setCurrentOptions] = useState<OptionType[]>([{
        label: activeLanguage.sideMatter.all + " " + activeLanguage.sideMatter.colors, 
        value: "all"
    }]);

    useEffect(() => {

        const allOptions = availableColors.map(color => (
            {
                label: color,
                value: color
            } as OptionType
        ))

        // const allCollectionsId = allCollections.map(collection => (collection._id))

        setOptions([
            {
                label: activeLanguage.sideMatter.all + " " + activeLanguage.sideMatter.colors, 
                value: "all"
            },
            ...allOptions
        ])

    }, [availableColors])

    useEffect(() => {

        setFiltrationCopy({
            ...filtrationCopy,
            colors: currentOptions.flatMap(option => 
                option.value === 'all' ? 
                options.map(opt => opt.value) : 
                [option.value]
            )
        })
    }, [currentOptions])

    useEffect(() => {
        console.log({options});
        
    }, [options])
    
    return (
        <div className='w-fit h-full m-2- p-2'>
            
            <h4 
                className='sm:m-5 mb-4 font-extrabold'
            >{activeLanguage.sideMatter.colors + " : "}</h4>

            <CustomSelectMany
                label={activeLanguage.sideMatter.color}
                options={options}
                currentOptions={currentOptions}
                setCurrentOptions={setCurrentOptions}
            />
        </div>
    )
}

export default FilterColor;
