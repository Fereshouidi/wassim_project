import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider';
import { FiltrationType } from '@/types';
import React, { useEffect, useState } from 'react'

type currentSort = 'price' | 'name' | 'date' ;
type curentSortDirection = 'asc' | 'desc';

type Props = {
    filtrationCopy: FiltrationType
    setFiltrationCopy: (value: FiltrationType) => void
    filterBarWidth: number
}

const SortBy = ({
    filtrationCopy,
    setFiltrationCopy,
    filterBarWidth
}: Props) => {

    const { activeLanguage } = useLanguage();
    const { colors } = useTheme();
    // const [ firstRender, setFirstRender ] = useState<boolean>(true);
    // const [currentSort, setCurrentSort] = useState<currentSort>("date");
    // const [curentSortDirection, setCurentSortDirection] = useState<curentSortDirection>("asc");

    // useEffect(() => {

    // }, [filtrationCopy])

    // useEffect(() => {
    //     setFiltrationCopy({
    //         ...filtrationCopy,
    //         sortBy: currentSort,
    //         sortDirection: curentSortDirection
    //     })
    // }, [currentSort, curentSortDirection])

    // useEffect(() => {
        
    //     if (!firstRender) return;

    //     setFiltrationCopy({
    //         ...filtrationCopy,
    //         sortBy: "price",
    //         sortDirection: "asc"
    //     })
    //     setFirstRender(false);
    // }, [filtrationCopy])

    return (

        <div className={`arrangement flex bg-red-400-
            ${filterBarWidth > 650 && filterBarWidth < 1100 ? 
                " w-full flex-row justify-center items-center overflow-x-scroll- my-5 z-0 bg-red-500-" 
                : "flex-col justify-center items-center bg-blue-500-"
            } 
             gap-4 py-2 mb-4 text-sm sm:text-md`}>

            <div className='w-fit'>
                <h4 className='sm:mx-5 font-extrabold'>{ activeLanguage.sideMatter.SortBy + " : "}</h4>
            </div>

            <div 
                className={`
                    w-fill rounded-sm flex flex-row items-center 
                    ${filterBarWidth > 650 && filterBarWidth < 1100 ? "p-2" : "px-5"} 
                     py-1 cursor-pointer
                `}
                onClick={() => setFiltrationCopy({
                    ...filtrationCopy,
                    sortBy: 'price'
                })}
                style={{
                    border: filtrationCopy.sortBy == "price" ? `1px solid ${colors.dark[200]}` : '',
                    backgroundColor: filtrationCopy.sortBy == "price" ? colors.dark[200] : '',
                    color: filtrationCopy.sortBy == "price" ? colors.light[200] : '',
                }}
            >
                <h4>{activeLanguage.sideMatter.price + ': '}</h4>
                <select 
                    className={`h-8 outline-0 flex
                        ${filterBarWidth > 650 && filterBarWidth < 1100 ? "w-[80px]" : " w-[200px] " }
                    justify-center items-center text-center ml-2 rounded-sm cursor-pointer`}
                    style={{
                        border: `0.025px solid ${colors.light[300]}`
                    }}
                    defaultValue={filtrationCopy.sortDirection}
                    onChange={(e) => setFiltrationCopy({
                        ...filtrationCopy,
                        sortDirection: e.target.value as curentSortDirection
                    })}
                >
                    <option value="desc">{activeLanguage.sideMatter.mostExpensive}</option>
                    <option value="asc">{activeLanguage.sideMatter.cheapest}</option>
                </select>
            </div>

            <div 
                className={`
                    w-fill rounded-sm flex flex-row items-center 
                    ${filterBarWidth > 650 && filterBarWidth < 1100 ? "p-2" : "px-5"} 
                     py-1 cursor-pointer
                `}
                onClick={() => setFiltrationCopy({
                    ...filtrationCopy,
                    sortBy: 'date'
                })}
                style={{
                    border: filtrationCopy.sortBy == "date" ? `1px solid ${colors.dark[200]}` : '',
                    backgroundColor: filtrationCopy.sortBy == "date" ? colors.dark[200] : '',
                    color: filtrationCopy.sortBy == "date" ? colors.light[200] : '',
                }}
            >
                <h4>{activeLanguage.sideMatter.date + ': '}</h4>
                <select 
                    className={`h-8 outline-0 flex
                        ${filterBarWidth > 650 && filterBarWidth < 1100 ? "w-[80px]" : " w-[200px] " }
                    justify-center items-center text-center ml-2 rounded-sm cursor-pointer`}
                    style={{
                        border: `0.025px solid ${colors.light[300]}`
                    }}
                    onChange={(e) => setFiltrationCopy({
                        ...filtrationCopy,
                        sortDirection: e.target.value as curentSortDirection
                    })}
                >
                    <option value="desc">{activeLanguage.sideMatter.newest}</option>
                    <option value="asc">{activeLanguage.sideMatter.Oldest}</option>
                </select>
            </div>

            <div 
                className={`
                    w-fill rounded-sm flex flex-row items-center 
                    ${filterBarWidth > 650 && filterBarWidth < 1100 ? "p-2" : "px-5"} 
                     py-1 cursor-pointer
                `}
                onClick={() => setFiltrationCopy({
                    ...filtrationCopy,
                    sortBy: 'name'
                })}
                style={{
                    border: filtrationCopy.sortBy == "name" ? `1px solid ${colors.dark[200]}` : '',
                    backgroundColor: filtrationCopy.sortBy == "name" ? colors.dark[200] : '',
                    color: filtrationCopy.sortBy == "name" ? colors.light[200] : '',
                }}
            >
                <h4>{activeLanguage.sideMatter.name + ': '}</h4>
                <select 
                    className={`h-8 outline-0 flex
                        ${filterBarWidth > 650 && filterBarWidth < 1100 ? "w-[80px]" : " w-[200px] " }
                    justify-center items-center text-center ml-2 rounded-sm cursor-pointer`}
                    style={{
                        border: `0.025px solid ${colors.light[300]}`,
                        color: filtrationCopy.sortBy == "name" ? colors.light[200] : '',
                        outline: 'none'
                    }}
                    color='red'
                    onChange={(e) => setFiltrationCopy({
                        ...filtrationCopy,
                        sortDirection: e.target.value as curentSortDirection
                    })}
                >
                    <option 
                        value="asc" 
                        style={{
                            color: colors.dark[200],
                            backgroundColor: colors.dark[200],
                            outline: 'none'
                        }}
                        // onMouseEnter={() => }    
                    >a-z</option>
                    <option 
                        value="desc" 
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
