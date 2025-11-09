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
import SortBy from '../sub/filterSearch/sortBy'
import SearchBar from '../sub/searchBar'

type FilterBarType = {
    filtration: FiltrationType
    setFiltration: (value: FiltrationType) => void
    mostProductExpensive: number
    productsCount: number
    allCollections: CollectionType[]
    availableColors: string[]
    availableSizes: string[]
    availableTypes: string[]
    searchText?: string
    importedFrom?: "searchPage" | "anotherPage"
    filteBarActive: boolean, 
    setFilterBarActive: (value: boolean) => void
}

const FilterBar = ({
    filtration,
    setFiltration,
    mostProductExpensive,
    productsCount,
    allCollections,
    availableColors,
    availableSizes,
    availableTypes,
    searchText,
    importedFrom,
    filteBarActive,
    setFilterBarActive
}: FilterBarType) => {

    const { screenWidth, screenHeight } = useScreen();
    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const [filtrationCopy, setFiltrationCopy] = useState<FiltrationType>(filtration);
    const filterBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log({filtrationCopy});

    }, [filtrationCopy])

    useEffect(() => {console.log(filtration);
        setFiltrationCopy(filtration)
    }, [filtration])



    useEffect(() => {
        setFiltrationCopy({
            ...filtrationCopy,
            colors: filtrationCopy.colors.length == 0 ? availableColors : filtrationCopy.colors,
            sizes: filtrationCopy.sizes.length == 0 ? availableSizes : filtrationCopy.sizes,
            types: filtrationCopy.types.length == 0 ? availableTypes : filtrationCopy.types

        })
    }, [availableColors, availableSizes, availableTypes])


    return (
        <div 
            className={`
                filter-bar w-full sticky 
                ${!filteBarActive && "filter-bar-inactive"}
                h-fit- left-0 flex flex-col
                ${screenWidth > 1250 ? "justify-between" : "justify-center"} 
                items-center p-2 z-10 rounded-sm transition-all duration-300
            `}
            style={{
                // position: 'sticky',
                color: colors.dark[200],
                backgroundColor: colors.light[100],
                boxShadow: filteBarActive ? '0 0px 15px rgba(13, 13, 13, 0.07)' : '',
                border: !filteBarActive ? `0.025px solid ${colors.light[300]}` : `0.025px solid ${colors.light[300]}`,
                height: filteBarActive ?  
                    (filterBarRef.current?.offsetWidth || 0) > 650 ? filterBarHeight + "px" : "500px" 
                    : "65px",
                top: screenWidth > 1100 ? headerHeight + "px" : headerHeightForPhones + "px" 
            }}
            ref={filterBarRef}
        >


        <div className={`
            w-full 
            ${filteBarActive ? "sticky- visible" : `invisible absolute- top-[${filterBarRef.current?.offsetHeight}px]`} 
            h-full left-0 flex flex-row flex-wrap
            overflow-x-hidden- overflow-y-scroll scrollbar-hidden-
            items-center z-10 duration-300
        `}>

            <div 
                className='w-full flex justify-center sticky top-0 z-50'
                style={{
                    backgroundColor: colors.light[100]
                }}
            >
                <div className='resNum flex w-fit  items-center justify-center text-sm'>
                    <span className='m-2'>{productsCount}</span>
                    <p>{activeLanguage.sideMatter.resultsFound}</p>
                </div>
            </div>


            {
                (filterBarRef.current?.offsetWidth || 0) > 1100 ?

                    <div className='w-full h-[90%] flex flex-row flex-wrap justify-center bg-green-500- bg-blue-500-'>

                        <div className={`h-full bg-blue-500- flex justify-center items-center`}>

                            {mostProductExpensive && <FilterPriceRange
                                filtration={filtration}
                                mostProductExpensive={mostProductExpensive}
                                filtrationCopy={filtrationCopy}
                                setFiltrationCopy={setFiltrationCopy}
                                
                            />}

                        </div>


                        <div 
                            className={`w-[400px] h-full bg-red-500-
                                bg-red-500- flex flex-1- flex-row flex-wrap justify-center items-center mx-2- my-5- overflow-hidden-
                            `}

                        >
                            {/* {filterBarRef.current?.offsetWidth} */}
                                <div className='w-[150px]'>
                                    <FilterCollection
                                        allCollections={allCollections}
                                        filtrationCopy={filtrationCopy}
                                        setFiltrationCopy={setFiltrationCopy}
                                        defaultOptions={filtration.collections}
                                />
                                </div>

                                <div className='w-[150px]'>
                                    <FilterColor
                                        availableColors={availableColors}
                                        filtrationCopy={filtrationCopy}
                                        setFiltrationCopy={setFiltrationCopy}
                                        defaultOptions={filtration.colors}
                                    />
                                </div>

                                <div className='w-[150px]'>
                                    <FilterSize
                                        availableSizes={availableSizes}
                                        filtrationCopy={filtrationCopy}
                                        setFiltrationCopy={setFiltrationCopy}
                                        defaultOptions={filtration.sizes}
                                    />
                                </div>


                                <div className='w-[150px]'>
                                    <FilterType
                                        availableType={availableTypes}
                                        filtrationCopy={filtrationCopy}
                                        setFiltrationCopy={setFiltrationCopy}
                                        defaultOptions={filtration.types}
                                    />
                                </div>
                        </div>
                        
                            
                        <SortBy
                            filtrationCopy={filtrationCopy}
                            setFiltrationCopy={setFiltrationCopy}
                            filterBarWidth={filterBarRef.current?.offsetWidth?? 0}
                        />
                    </div>

                : (filterBarRef.current?.offsetWidth || 0) > 650 && (filterBarRef.current?.offsetWidth || 0) < 1100 ?
                    
                    <div className='w-full h-full flex flex-row flex-wrap justify-between bg-green-500-'>

                        <div className={`w-[45%] h-[90%] bg-blue-500- flex justify-center items-center`}>

                            {mostProductExpensive && <FilterPriceRange
                                filtration={filtration}
                                mostProductExpensive={mostProductExpensive}
                                filtrationCopy={filtrationCopy}
                                setFiltrationCopy={setFiltrationCopy}
                                
                            />}

                        </div>


                        <div 
                            className={`w-[50%]
                                bg-red-500- flex flex-1- flex-row flex-wrap justify-center items-center mx-2- my-5- z-[999] overflow-hidden-
                            `}

                        >
                            {/* {filterBarRef.current?.offsetWidth} */}

                            <div className='w-[145px]'>
                                <FilterCollection
                                    allCollections={allCollections}
                                    filtrationCopy={filtrationCopy}
                                    setFiltrationCopy={setFiltrationCopy}
                                    defaultOptions={filtration.collections}
                                />
                            </div>

                            <div className='w-[145px]'>
                                <FilterColor
                                    availableColors={availableColors}
                                    filtrationCopy={filtrationCopy}
                                    setFiltrationCopy={setFiltrationCopy}
                                    defaultOptions={filtration.colors}
                                />
                            </div>

                            <div className='w-[145px]'>
                                <FilterSize
                                    availableSizes={availableSizes}
                                    filtrationCopy={filtrationCopy}
                                    setFiltrationCopy={setFiltrationCopy}
                                    defaultOptions={filtration.sizes}
                                />
                            </div>


                            <div className='w-[145px]'>
                                <FilterType
                                    availableType={availableTypes}
                                    filtrationCopy={filtrationCopy}
                                    setFiltrationCopy={setFiltrationCopy}
                                    defaultOptions={filtration.types}
                                />
                            </div>

                        </div>
                        
                            
                        <SortBy
                            filtrationCopy={filtrationCopy}
                            setFiltrationCopy={setFiltrationCopy}
                            filterBarWidth={filterBarRef.current?.offsetWidth?? 0}
                        />
                    </div>

                :

                <div className='w-full flex flex-col items-center justify-center'>
                    {mostProductExpensive && <FilterPriceRange
                        filtration={filtration}
                        mostProductExpensive={mostProductExpensive}
                        filtrationCopy={filtrationCopy}
                        setFiltrationCopy={setFiltrationCopy}
                        
                    />}

                    <div className='min-w-[300px] flex flex-1 flex-row flex-wrap justify-center items-center m-2 my-5-'>
                        <FilterCollection
                            allCollections={allCollections}
                            filtrationCopy={filtrationCopy}
                            setFiltrationCopy={setFiltrationCopy}
                            defaultOptions={filtration.collections}
                        />

                        <FilterColor
                            availableColors={availableColors}
                            filtrationCopy={filtrationCopy}
                            setFiltrationCopy={setFiltrationCopy}
                            defaultOptions={filtration.colors}
                        />

                        <FilterSize
                            availableSizes={availableSizes}
                            filtrationCopy={filtrationCopy}
                            setFiltrationCopy={setFiltrationCopy}
                            defaultOptions={filtration.sizes}
                        />

                        <FilterType
                            availableType={availableTypes}
                            filtrationCopy={filtrationCopy}
                            setFiltrationCopy={setFiltrationCopy}
                            defaultOptions={filtration.types}
                        />
                    </div>
                    
                        
                    <SortBy
                        filtrationCopy={filtrationCopy}
                        setFiltrationCopy={setFiltrationCopy}
                        filterBarWidth={filterBarRef.current?.offsetWidth?? 0}
                    />
                </div>

            }


        </div>
          

          <div 
            className='relative bottom-bar w-full sm:h-[50px] h-[60px] flex flex-row justify-end items-end gap-3 px-3'
            style={{
                // top: headerHeight + 'px'
            }}
          >

            {
                !filteBarActive &&
                <div className='w-full h-full flex justify-center'>
                    <div className='resNum flex w-fit items-center justify-center opacity-80 text-sm'>
                        <span className='m-2'>{productsCount}</span>
                        <p>{activeLanguage.sideMatter.resultsFound}</p>
                    </div>
                </div>
            }

            {filteBarActive &&  

                <div className='h-full absolute  left-[50%] translate-x-[-50%] cursor-pointer flex justify-end items-end'>
                    <button
                        className=' mb-1 mx-2 rounded-sm p-2 text-sm cursor-pointer'
                        style={{
                            backgroundColor: colors.dark[100],
                            color: colors.light[100]
                        }}
                        onClick={() => {
                            setFiltration(filtrationCopy);
                            localStorage.setItem('searchFilter', JSON.stringify(filtrationCopy));
                            importedFrom == "searchPage" && setFilterBarActive(false)
                        }}
                    >{activeLanguage.sideMatter.confirm}</button>
                </div>

            }

            <div 
                className='h-12 flex flex-row justify-center items-center gap-2 cursor-pointer no-sellect px-4 rounded-sm'
                onClick={() => setFilterBarActive(!filteBarActive)}
                style={{
                    border: `0.025px solid ${colors.light[300]}`,
                    boxShadow: '0 0px 15px rgba(13, 13, 13, 0.07)'
                }}
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
