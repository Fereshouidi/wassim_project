import { useLanguage } from '@/contexts/languageContext'
import React from 'react'

const FilterBar = () => {

    const { activeLanguage } = useLanguage();

    return (
        <div className='w-full min-h-[100px] flex flex-wrap justify-between items-center bg-red-500'>

            <div className='resNum flex flex-1 items-center justify-center'>
                <span className='m-2'>0</span>
                <p>{activeLanguage.sideMatter.resultsFound}</p>
            </div>

            <div className='filter flex flex-3'>
                filter
            </div>

        </div>
    )
}

export default FilterBar
