import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import React, { useEffect, useState } from 'react'
import CustomSelect from '../customSelect';
import { CollectionType, OptionType } from '@/types';

type FilterCollection = {
    availableSizes: string[]
}

const FilterSize = ({
    availableSizes
}: FilterCollection) => {

    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const [options, setOptions] = useState<OptionType[]>([]);
    const [currentOptions, setCurrentOptions] = useState<OptionType>({
        label: activeLanguage.sideMatter.all + " " + activeLanguage.sideMatter.sizes, 
        value: "all"
    });

    useEffect(() => {

        const allOptions = availableSizes.map(size => (
            {
                label: size,
                value: size
            } as OptionType
        ))

        // const allCollectionsId = allCollections.map(collection => (collection._id))

        setOptions([
            {
                label: activeLanguage.sideMatter.all + " " + activeLanguage.sideMatter.sizes, 
                value: "all"
            },
            ...allOptions
        ])

    }, [availableSizes])

    useEffect(() => {
        console.log({options});
        
    }, [options])
    
    return (
        <div className='w-fit h-full m-2- p-2'>
            
            <h4 
                className='m-5 mb-4 font-extrabold'
            >{activeLanguage.sideMatter.sizes + " : "}</h4>

            <CustomSelect
                options={options}
                currentOption={currentOptions}
                setCurrentOption={setCurrentOptions}
            />
        </div>
    )
}

export default FilterSize;
