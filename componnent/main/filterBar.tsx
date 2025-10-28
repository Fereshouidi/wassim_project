import { useLanguage } from '@/contexts/languageContext'
import React from 'react'

const FilterBar = () => {

    const { activeLanguage } = useLanguage();

    return (
        <div className='w-full min-h-[70px]  flex-row flex-wrap justify-center items-center bg-red-500'>

            <div className='resNum flex sm:w-full items-center justify-center'>
                <span className='m-2'>0</span>
                <p>{activeLanguage.sideMatter.resultsFound}</p>
            </div>

            <div className=' resNum h-full flex flex-wrap bg-blue-500'>

                <div className='filter min-w-[200px] bg-green-500 flex flex-3'>
                    filter
                </div>

                <div className='arrangement flex flex-3 justify-center items-center gap-4 py-5 text-sm sm:text-md'>

                    <div className='flex flex-row'>
                        <h4>{activeLanguage.sideMatter.price + ' : '}</h4>
                        <select name="" id="">
                            <option value="asc">{activeLanguage.sideMatter.cheapest}</option>
                            <option value="desc">{activeLanguage.sideMatter.mostExpensive}</option>
                        </select>
                    </div>

                    <div className='flex flex-row'>
                        <h4>{activeLanguage.sideMatter.date + ' : '}</h4>
                        <select name="" id="">
                            <option value="Oldest">{activeLanguage.sideMatter.Oldest}</option>
                            <option value="newest">{activeLanguage.sideMatter.newest}</option>
                        </select>
                    </div>

                    <div className='flex flex-row'>
                        <h4>{activeLanguage.sideMatter.name + ' : '}</h4>
                        <select name="" id="">
                            <option value="asc">a-z</option>
                            <option value="desc">z-a</option>
                        </select>
                    </div>

                </div>
            </div>


        </div>
    )
}

export default FilterBar
