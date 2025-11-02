import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider';
import { FiltrationType } from '@/types';
import React, { useEffect, useState } from 'react'

type currentSort = 'price' | 'name' | 'date' ;
type curentSortDirection = 'asc' | 'desc';

type Props = {
    filtrationCopy: FiltrationType
    setFiltrationCopy: (value: FiltrationType) => void
}

const SortBy = ({
    filtrationCopy,
    setFiltrationCopy
}: Props) => {

    const { activeLanguage } = useLanguage();
    const { colors } = useTheme();
    const [currentSort, setCurrentSort] = useState<currentSort>("date");
    const [curentSortDirection, setCurentSortDirection] = useState<curentSortDirection>("asc");

    useEffect(() => {

    })

    useEffect(() => {
        setFiltrationCopy({
            ...filtrationCopy,
            sortBy: currentSort,
            sortDirection: curentSortDirection
        })
    }, [currentSort, curentSortDirection])

    return (

        <div className='arrangement max-w-[350px] sm:w-[350px] flex flex-col justify-center items-center gap-4 py-2 mb-4 text-sm sm:text-md'>

            <div className='w-full'>
                <h4 className='sm:mx-5 font-extrabold'>{ activeLanguage.sideMatter.SortBy + " : "}</h4>
            </div>

            <div 
                className='w-fill rounded-sm flex flex-row items-center px-5 py-1 cursor-pointer'
                onClick={() => setCurrentSort('price')}
                style={{
                    border: filtrationCopy.sortBy == "price" ? `1px solid ${colors.dark[200]}` : '',
                    backgroundColor: filtrationCopy.sortBy == "price" ? colors.dark[200] : '',
                    color: filtrationCopy.sortBy == "price" ? colors.light[200] : '',
                }}
            >
                <h4>{activeLanguage.sideMatter.price + ' : '}</h4>
                <select 
                    className='h-8 outline-0 flex w-[200px] justify-center items-center text-center mx-2 rounded-sm cursor-pointer'
                    style={{
                        border: `0.025px solid ${colors.light[300]}`
                    }}
                    onChange={(e) => setCurentSortDirection(e.target.value as curentSortDirection)}
                >
                    <option value="desc">{activeLanguage.sideMatter.mostExpensive}</option>
                    <option value="asc">{activeLanguage.sideMatter.cheapest}</option>
                </select>
            </div>

            <div 
                className='w-fill rounded-sm flex flex-row items-center px-5 py-1 cursor-pointer'
                onClick={() => setCurrentSort('date')}
                style={{
                    border: filtrationCopy.sortBy == "date" ? `1px solid ${colors.dark[200]}` : '',
                    backgroundColor: filtrationCopy.sortBy == "date" ? colors.dark[200] : '',
                    color: filtrationCopy.sortBy == "date" ? colors.light[200] : '',
                }}
            >
                <h4>{activeLanguage.sideMatter.date + ' : '}</h4>
                <select 
                    className='h-8 outline-0 flex w-[200px] justify-center items-center text-center mx-2 rounded-sm cursor-pointer'
                    style={{
                        border: `0.025px solid ${colors.light[300]}`
                    }}
                    onChange={(e) => setCurentSortDirection(e.target.value as curentSortDirection)}
                >
                    <option value="desc">{activeLanguage.sideMatter.newest}</option>
                    <option value="asc">{activeLanguage.sideMatter.Oldest}</option>
                </select>
            </div>

            <div 
                className='w-fill rounded-sm flex flex-row items-center px-5 py-1 cursor-pointer'
                onClick={() => setCurrentSort('name')}
                style={{
                    border: filtrationCopy.sortBy == "name" ? `1px solid ${colors.dark[200]}` : '',
                    backgroundColor: filtrationCopy.sortBy == "name" ? colors.dark[200] : '',
                    color: filtrationCopy.sortBy == "name" ? colors.light[200] : '',
                }}
            >
                <h4>{activeLanguage.sideMatter.name + ' : '}</h4>
                <select 
                    className='h-8 outline-0 flex w-[200px] justify-center items-center text-center mx-2 rounded-sm cursor-pointer'
                    style={{
                        border: `0.025px solid ${colors.light[300]}`,
                        color: filtrationCopy.sortBy == "name" ? colors.light[200] : '',
                        outline: 'none'
                    }}
                    color='red'
                    onChange={(e) => setCurentSortDirection(e.target.value as curentSortDirection)}
                >
                    <option 
                        value="desc" 
                        style={{
                            color: colors.dark[200],
                            backgroundColor: colors.dark[200],
                            outline: 'none'
                        }}
                        // onMouseEnter={() => }    
                    >a-z</option>
                    <option 
                        value="asc" 
                        style={{
                            color: colors.dark[200],
                            backgroundColor: colors.dark[200],
                            outline: 'none'
                        }}
                        // onMouseEnter={() => }    
                    >z-a</option>
                </select>
            </div>

        </div>
    )
}

export default SortBy
