import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import React, { useEffect, useState } from 'react'
import CustomSelect from '../customSelect';
import { CollectionType, FiltrationType, OptionType } from '@/types';
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
    const { colors, activeTheme } = useTheme();
    const [options, setOptions] = useState<OptionType[]>([]);
    const [currentOptions, setCurrentOptions] = useState<OptionType[]>([{
        label: activeLanguage.sideMatter.all + " " + activeLanguage.sideMatter.types, 
        value: "all"
    }]);

    useEffect(() => {

        const allOptions = availableType.map(type => (
            {
                label: type,
                value: type
            } as OptionType
        ))

        // const allCollectionsId = allCollections.map(collection => (collection._id))

        setOptions([
            {
                label: activeLanguage.sideMatter.all + " " + activeLanguage.sideMatter.types, 
                value: "all"
            },
            ...allOptions
        ])

    }, [availableType])

    useEffect(() => {

        setFiltrationCopy({
            ...filtrationCopy,
            types: currentOptions.flatMap(option => 
                option.value === 'all' ? 
                availableType : 
                [option.value]
            )
        })
    }, [currentOptions])

    useEffect(() => {
        console.log({options});
        
    }, [options])

    useEffect(() => {
        
        if (!defaultOptions) return;

        setCurrentOptions(
            
            defaultOptions.length == options.length ?
                [{
                    label: activeLanguage.sideMatter.all + " " + activeLanguage.sideMatter.types, 
                    value: "all"
                }]
            :
            defaultOptions.map(
            (type): OptionType => ({
                label: `${filtrationCopy.types.length} ${activeLanguage.sideMatter.types}`,
                value: type
            })
            )
        );
    }, [defaultOptions]);
    
    return (
        <div className='w-fit h-full m-2- p-2'>
            
            <h4 
                className='sm:m-5 mb-4 font-extrabold'
            >{activeLanguage.sideMatter.types + " : "}</h4>

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
