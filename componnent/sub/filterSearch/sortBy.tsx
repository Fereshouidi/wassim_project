import { useLanguage } from '@/contexts/languageContext'
import React, { useState } from 'react'

const SortBy = () => {

    const { activeLanguage } = useLanguage();
    // const [currentSort, setCurrentSort] = useState<>();

    return (

        <div className='arrangement max-w-[350px] flex flex-1- flex-wrap justify-center items-center gap-4 py-2 text-sm sm:text-md'>

            <div className='w-full'>
                <h4 className='sm:m-5 font-extrabold'>{ activeLanguage.sideMatter.SortBy + " : "}</h4>
            </div>

            <div 
                className='min-w-[120px] flex flex-row justify-center items-center p-2 rounded-sm'
                style={{
                    // backgroundColor: 'red'
                }}
            >
                <h4>{activeLanguage.sideMatter.price + ' : '}</h4>
                <select name="" id="">
                    <option value="asc">{activeLanguage.sideMatter.cheapest}</option>
                    <option value="desc">{activeLanguage.sideMatter.mostExpensive}</option>
                </select>
            </div>

            <div className='min-w-[120px] flex flex-row justify-center items-center '>
                <h4>{activeLanguage.sideMatter.date + ' : '}</h4>
                <select name="" id="">
                    <option value="Oldest">{activeLanguage.sideMatter.Oldest}</option>
                    <option value="newest">{activeLanguage.sideMatter.newest}</option>
                </select>
            </div>

            <div className='min-w-[220px] flex flex-row justify-center items-center '>
                <h4>{activeLanguage.sideMatter.name + ' : '}</h4>
                <select name="" id="">
                    <option value="asc">a-z</option>
                    <option value="desc">z-a</option>
                </select>
            </div>

        </div>
    )
}

export default SortBy
