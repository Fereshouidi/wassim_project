import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import React, { useEffect, useState } from 'react'
import CustomSelect from '../customSelect';
import { CollectionType, FiltrationType, OptionType } from '@/types';
import CustomSelectMany from '../customSelectMany';

type FilterCollection = {
    allCollections: CollectionType[]
    filtrationCopy: FiltrationType
    setFiltrationCopy: (value: FiltrationType) => void
}

const FilterCollection = ({
    allCollections,
    filtrationCopy,
    setFiltrationCopy
}: FilterCollection) => {

    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const [options, setOptions] = useState<OptionType[]>([]);
    const [currentOptions, setCurrentOptions] = useState<OptionType[]>([{
        label: activeLanguage.sideMatter.all + " " + activeLanguage.nav.collections, 
        value: "all"
    }]);

    useEffect(() => {

        const allOptions = allCollections.map(collection => (
            {
                label: collection.name[activeLanguage.language],
                value: collection._id
            } as OptionType
        ))

        // const allCollectionsId = allCollections.map(collection => (collection._id))

        setOptions([
            {
                label: activeLanguage.sideMatter.all + " " + activeLanguage.nav.collections,
                value: "all"
            },
            ...allOptions
        ])

    }, [allCollections])

    useEffect(() => {

        setFiltrationCopy({
            ...filtrationCopy,
            collections: currentOptions.flatMap(option => 
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
            >{activeLanguage.nav.collections + " : "}</h4>

            <CustomSelectMany
                label={activeLanguage.nav.collection}
                options={options}
                currentOptions={currentOptions}
                setCurrentOptions={setCurrentOptions}
            />
        </div>
    )
}

export default FilterCollection;
