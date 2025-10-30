import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { CollectionType, FiltrationType, ProductType } from '@/types'
import React, { useEffect, useRef, useState } from 'react'
import FilterPriceRange from '../sub/filterSearch/FilterPriceRange'
import FilterCollection from '../sub/filterSearch/filterCollections'
import { filterBarHeight, headerHeight, headerHeightForPhones } from '@/constent'
import FilterColor from '../sub/filterSearch/filterColor'
import { useScreen } from '@/contexts/screenProvider'
import FilterSize from '../sub/filterSearch/filterSize'
import FilterType from '../sub/filterSearch/filterType'

type FilterBarType = {
    filtration: FiltrationType
    setFiltration: (value: FiltrationType) => void
    mostProductExpensive: number
    productsCount: number
    allCollections: CollectionType[]
    availableColors: string[]
    availableSizes: string[]
    availableTypes: string[]
}

const FilterBar = ({
    filtration,
    setFiltration,
    mostProductExpensive,
    productsCount,
    allCollections,
    availableColors,
    availableSizes,
    availableTypes
}: FilterBarType) => {

    const { screenWidth } = useScreen();
    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    // const [min, setMin] = useState<number>(filtration.price.from);
    // const [max, setMax] = useState<number>(mostProductExpensive);
    const [filtrationCopy, setFiltrationCopy] = useState<FiltrationType>(filtration);
    const [filteBarActive, setFilterBarActive] = useState<boolean>(false);
    const filterBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log({filtrationCopy});
        
    }, [filtrationCopy])

    useEffect(() => {console.log("Component rendered");
        setFiltrationCopy(filtration)
    }, [filtration])





    return (
        <div 
            className={`
                filter-bar w-full overflow-y-scroll scrollbar-hidden
                ${!filteBarActive && "filter-bar-inactive"}
                ${filteBarActive ? "sticky" : `sticky-`} 
                h-fit left-0 flex flex-col
                ${screenWidth > 1250 ? "justify-between" : "justify-center"} 
                items-center p-2 z-10 duration-300
            `}
            style={{
                backgroundColor: colors.light[150],
                boxShadow: filteBarActive ? '0 0px 15px rgba(13, 13, 13, 0.07)' : '',
                border: filteBarActive ? `0.025px solid ${colors.light[300]}` : '',
                // height: screenWidth > 1250 ? filterBarHeight + "px" : "",
                top: filteBarActive ? 
                    screenWidth > 1250 ? headerHeight + "px" : headerHeightForPhones + "px" 
                    : -(filterBarRef.current?.offsetHeight?? 0) + 130 + 'px'
            }}
            ref={filterBarRef}
        >

            <div className={`
                w-full 
                ${filteBarActive ? "sticky" : `absolute top-[${filterBarRef.current?.offsetHeight}px]`} 
                h-fit left-0 flex flex-row flex-wrap
                ${screenWidth > 1250 ? "justify-around" : "justify-center"} 
                items-center z-10 duration-300
            `}>
                {/* <img 
                    src={activeTheme == "dark" ? "/icons/up-White.png" : "/icons/up-Black.png"}
                    className='w-4 h-4 absolute right-10 bottom-4'
                    onClick={() => setFilterBarActive(!filteBarActive)}
                /> */}

                <div className='w-full flex justify-center'>
                    <div className='resNum flex w-fit  items-center justify-center'>
                        <span className='m-2'>{productsCount}</span>
                        <p>{activeLanguage.sideMatter.resultsFound}</p>
                    </div>
                </div>


                {/* <div className=' resNum flex flex-wrap bg-blue-500'> */}

                    {/* <div className='filter min-w-[200px] bg-green-500 flex flex-3 flex-wrap justify-center '> */}

                    <FilterPriceRange
                        filtration={filtration}
                        mostProductExpensive={mostProductExpensive}
                        filtrationCopy={filtrationCopy}
                        setFiltrationCopy={setFiltrationCopy}
                        
                    />

                    <div className='min-w-[300px] flex flex-1 flex-row flex-wrap justify-center items-center m-2'>
                        <FilterCollection
                            allCollections={allCollections}
                        />

                        <FilterColor
                            availableColors={availableColors}
                        />

                        <FilterSize
                            availableSizes={availableSizes}
                        />

                        <FilterType
                            availableType={availableTypes}
                        />
                    </div>
                    
                        
                    {/* </div> */}

                    <div className='arrangement max-w-[350px] flex flex-1- flex-wrap justify-center items-center gap-4 py-5 text-sm sm:text-md'>

                        <div className='w-full'>
                            <h4 className='m-5 font-extrabold'>{activeLanguage.sideMatter.priceZone + " : "}</h4>
                        </div>

                        <div className='min-w-[120px] flex flex-row justify-center items-center'>
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

                    
                {/* </div> */}

            </div>

          <div 
            className='relative bottom-bar w-full h-[50px] flex flex-row justify-end items-end gap-3 px-3'
            style={{
                // top: headerHeight + 'px'
            }}
          >

            {
                !filteBarActive &&
                <div className='w-full h-full flex justify-center'>
                    <div className='resNum flex w-fit items-center justify-center'>
                        <span className='m-2'>{productsCount}</span>
                        <p>{activeLanguage.sideMatter.resultsFound}</p>
                    </div>
                </div>
            }

            {filteBarActive &&  
                <button
                    className=' mb-2 mx-2 rounded-sm p-2 text-sm absolute left-[50%] translate-x-[-50%] cursor-pointer'
                    style={{
                        backgroundColor: colors.dark[100],
                        color: colors.light[100]
                    }}
                    onClick={() => setFiltration(filtrationCopy)}
                >validation</button>
            }

            <div 
                className='h-full flex flex-row justify-center items-center gap-2 cursor-pointer no-sellect'
                onClick={() => setFilterBarActive(!filteBarActive)}
            >
              {!filteBarActive && <h4>{activeLanguage.sideMatter.filter}</h4>}
              <img 
                src={
                    filteBarActive ?
                        activeTheme == 'dark' ? "/icons/up-white.png" : "/icons/up-black.png"
                        : activeTheme == 'dark' ? "/icons/filter-white.png" : "/icons/filter-black.png"
                }
                className='w-5 h-5'
              />
            </div>

          </div>

        </div>
    )
}

export default FilterBar
