import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import React, { useEffect, useState } from 'react'
import CustomSelect from '../customSelect';
import { CollectionType, FiltrationType, OptionType } from '@/types';
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
    const { colors, activeTheme } = useTheme();
    const [options, setOptions] = useState<OptionType[]>([]);
    const [currentOptions, setCurrentOptions] = useState<OptionType[]>([{
        label: activeLanguage.sideMatter.all + " " + activeLanguage.sideMatter.sizes, 
        value: "all"
    }]);

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

        setFiltrationCopy({
            ...filtrationCopy,
            sizes: currentOptions.flatMap(option => 
                option.value === 'all' ? 
                availableSizes: 
                [option.value]
            )
        })
    }, [currentOptions])

    useEffect(() => {
        console.log({options});
        
    }, [options])

    useEffect(() => {
        
        if (!defaultOptions || defaultOptions?.length == 0 ) {
            return setCurrentOptions([{
                label: activeLanguage.sideMatter.all + " " + activeLanguage.sideMatter.sizes, 
                value: "all"
            }])
        }

        setCurrentOptions(
            
            defaultOptions.length == options.length - 1 ?
                [{
                    label: activeLanguage.sideMatter.all + " " + activeLanguage.sideMatter.sizes, 
                    value: "all"
                }]
            :
            defaultOptions.map(
            (size): OptionType => ({
                label: `${filtrationCopy.sizes.length} ${activeLanguage.sideMatter.sizes}`,
                value: size
            })
            )
        );
    }, [defaultOptions]);
    
    return (
        <div className='w-fit- h-full m-2- p-2'>
            
            <h4 
                className='sm:m-5 mb-4 font-extrabold'
            >{activeLanguage.sideMatter.sizes + " : "}</h4>

            <CustomSelectMany
            label={activeLanguage.sideMatter.sizes}
                options={options}
                currentOptions={currentOptions}
                setCurrentOptions={setCurrentOptions}
                // className={`sm:w-32`}
            />
        </div>
    )
}

export default FilterSize;
