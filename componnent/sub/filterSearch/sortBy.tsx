import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider';
import React, { useState } from 'react'

type currentSort = 'price' | 'name' | 'date' | null;

const SortBy = () => {

    const { activeLanguage } = useLanguage();
    const { colors } = useTheme();
    const [currentSort, setCurrentSort] = useState<currentSort>(null);

    return (

        <div className='arrangement max-w-[350px] sm:w-[350px] flex flex-col justify-center items-center gap-4 py-2 mb-4 text-sm sm:text-md'>

            <div className='w-full'>
                <h4 className='sm:mx-5 font-extrabold'>{ activeLanguage.sideMatter.SortBy + " : "}</h4>
            </div>

            <div 
                className='w-full rounded-sm flex flex-row items-center px-5 py-1 cursor-pointer'
                onClick={() => setCurrentSort('price')}
                style={{
                    border: currentSort == "price" ? `1px solid ${colors.dark[200]}` : '',
                    backgroundColor: currentSort == "price" ? colors.dark[200] : '',
                    color: currentSort == "price" ? colors.light[200] : '',
                }}
            >
                <h4>{activeLanguage.sideMatter.price + ' : '}</h4>
                <select 
                    className='h-8 outline-0 flex w-[200px] justify-center items-center text-center mx-2 rounded-sm cursor-pointer'
                    style={{
                        border: `0.025px solid ${colors.light[300]}`
                    }}
                >
                    <option value="asc">{activeLanguage.sideMatter.mostExpensive}</option>
                    <option value="desc">{activeLanguage.sideMatter.cheapest}</option>
                </select>
            </div>

            <div 
                className='w-full rounded-sm flex flex-row items-center px-5 py-1 cursor-pointer'
                onClick={() => setCurrentSort('date')}
                style={{
                    border: currentSort == "date" ? `1px solid ${colors.dark[200]}` : '',
                    backgroundColor: currentSort == "date" ? colors.dark[200] : '',
                    color: currentSort == "date" ? colors.light[200] : '',
                }}
            >
                <h4>{activeLanguage.sideMatter.date + ' : '}</h4>
                <select 
                    className='h-8 outline-0 flex w-[200px] justify-center items-center text-center mx-2 rounded-sm cursor-pointer'
                    style={{
                        border: `0.025px solid ${colors.light[300]}`
                    }}
                >
                    <option value="asc">{activeLanguage.sideMatter.newest}</option>
                    <option value="desc">{activeLanguage.sideMatter.Oldest}</option>
                </select>
            </div>

            <div 
                className='w-full rounded-sm flex flex-row items-center px-5 py-1 cursor-pointer'
                onClick={() => setCurrentSort('name')}
                style={{
                    border: currentSort == "name" ? `1px solid ${colors.dark[200]}` : '',
                    backgroundColor: currentSort == "name" ? colors.dark[200] : '',
                    color: currentSort == "name" ? colors.light[200] : '',
                }}
            >
                <h4>{activeLanguage.sideMatter.name + ' : '}</h4>
                <select 
                    className='h-8 outline-0 flex w-[200px] justify-center items-center text-center mx-2 rounded-sm cursor-pointer'
                    style={{
                        border: `0.025px solid ${colors.light[300]}`
                    }}
                >
                    <option value="asc">a-z</option>
                    <option value="desc">z-a</option>
                </select>
            </div>

        </div>
    )
}

export default SortBy
