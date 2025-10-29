import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { CollectionType, FiltrationType, ProductType } from '@/types'
import React, { useEffect, useState } from 'react'
import FilterPriceRange from '../sub/filterSearch/FilterPriceRange'
import FilterCollection from '../sub/filterSearch/filterCollections'
import { filterBarHeight, headerHeight } from '@/constent'
import FilterColor from '../sub/filterSearch/filterColor'

type FilterBarType = {
    filtration: FiltrationType
    setFiltration: (value: FiltrationType) => void
    mostProductExpensive: number
    productsCount: number
    allCollections: CollectionType[]
    availableColors: string[]
}

const FilterBar = ({
    filtration,
    setFiltration,
    mostProductExpensive,
    productsCount,
    allCollections,
    availableColors
}: FilterBarType) => {

    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    // const [min, setMin] = useState<number>(filtration.price.from);
    // const [max, setMax] = useState<number>(mostProductExpensive);
    const [filtrationCopy, setFiltrationCopy] = useState<FiltrationType>(filtration);

    useEffect(() => {
        console.log({filtrationCopy});
        
    }, [filtrationCopy])

    useEffect(() => {
        setFiltrationCopy(filtration)
    }, [filtration])





    return (
        <div 
            className={`w-full fixed left-0 flex flex-row flex-wrap justify-between items-center  z-10`}
            style={{
                backgroundColor: colors.light[100],
                boxShadow: '0 0px 15px rgba(13, 13, 13, 0.07)',
                height: filterBarHeight + "px",
                top: headerHeight + "px"
            }}
        >

            <div className='resNum flex w-fit  items-center justify-center'>
                <span className='m-2'>{productsCount}</span>
                <p>{activeLanguage.sideMatter.resultsFound}</p>
            </div>

            {/* <div className=' resNum flex flex-wrap bg-blue-500'> */}

                {/* <div className='filter min-w-[200px] bg-green-500 flex flex-3 flex-wrap justify-center '> */}

                <FilterPriceRange
                    filtration={filtration}
                    mostProductExpensive={mostProductExpensive}
                    filtrationCopy={filtrationCopy}
                    setFiltrationCopy={setFiltrationCopy}
                />
                
                <FilterCollection
                    allCollections={allCollections}
                />

                <FilterColor
                    availableColors={availableColors}
                />
                    
                {/* </div> */}

                <div className='arrangement flex justify-center items-center gap-4 py-5 text-sm sm:text-md'>

                    <div className='flex flex-row'>
                        <h4>{activeLanguage.sideMatter.price + ' : '}</h4>
                        <select name="" id="">
                            <option value="asc">{activeLanguage.sideMatter.cheapest}</option>
                            <option value="desc">{activeLanguage.sideMatter.mostExpensive}</option>
                        </select>
                    </div>

                    {/* <div className='flex flex-row'>
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
                    </div> */}

                </div>

                <button>validation</button>

                
            {/* </div> */}

            <button
                onClick={() => setFiltration(filtrationCopy)}
            >validation</button>

        </div>
    )
}

export default FilterBar
