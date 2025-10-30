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
    searchText
}: FilterBarType) => {

    const { screenWidth, screenHeight } = useScreen();
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



    // useEffect(() => {
    //     alert(filtrationCopy.price.to)
    // }, [filtrationCopy])



    return (
        <div 
            className={`
                filter-bar w-full sticky 
                ${filteBarActive ? "overflow-y-scroll scrollbar-hidden" : ""}
                ${!filteBarActive && "filter-bar-inactive"}
                h-fit- left-0 flex flex-col
                ${screenWidth > 1250 ? "justify-between" : "justify-center"} 
                items-center p-2 z-10 transition-all duration-300
            `}
            style={{
                // position: 'sticky',
                backgroundColor: colors.light[100],
                boxShadow: filteBarActive ? '0 0px 15px rgba(13, 13, 13, 0.07)' : '',
                border: !filteBarActive ? `0.025px solid ${colors.light[300]}` : `0.025px solid ${colors.light[300]}`,
                height: filteBarActive ?  screenWidth > 1250 ? filterBarHeight + "px" : "700px" : "65px",
                top: screenWidth > 1250 ? headerHeight + "px" : headerHeightForPhones + "px" 
            }}
            ref={filterBarRef}
        >


        <div className={`
            w-full 
            ${filteBarActive ? "sticky- visible" : `invisible absolute- top-[${filterBarRef.current?.offsetHeight}px]`} 
            h-fit left-0 flex flex-row flex-wrap
            ${screenWidth > 1250 ? "justify-around" : "justify-center"} 
            overflow-y-scroll scrollbar-hidden
            items-center z-10 duration-300
        `}>
            {/* <img 
                src={activeTheme == "dark" ? "/icons/up-White.png" : "/icons/up-Black.png"}
                className='w-4 h-4 absolute right-10 bottom-4'
                onClick={() => setFilterBarActive(!filteBarActive)}
            /> */}

            <div 
                className='w-full flex justify-center sticky top-0 z-20'
                style={{
                    backgroundColor: colors.light[100]
                }}
            >
                <div className='resNum flex w-fit  items-center justify-center text-sm'>
                    <span className='m-2'>{productsCount}</span>
                    <p>{activeLanguage.sideMatter.resultsFound}</p>
                </div>
            </div>


            {/* <div className=' resNum flex flex-wrap bg-blue-500'> */}

                {/* <div className='filter min-w-[200px] bg-green-500 flex flex-3 flex-wrap justify-center '> */}

                {/* {screenWidth < 1000 && <SearchBar
                    containerClassName='w-full px-5 my-2'
                    className='w-20 border-[0.5px] border-gray-100 h-14'
                    inputClassName='w-20 bg-transparent'
                    style={{
                        borderColor: colors.light[300],
                        backgroundColor: colors.light[100]
                    }}
                    inputStyle={{
                        borderColor: colors.light[300],
                        color: colors.dark[300],
                    }}
                    searchIcon={ activeTheme == "dark" ? "/icons/searchBlack.png" : "/icons/searchWhite.png" }
                    searchIconStyle={{
                        backgroundColor: colors.dark[100],
                        color: colors.light[100]
                    }}
                    resSectionStyle={{
                        backgroundColor: colors.light[100],
                        color: colors.dark[100],
                        borderRight: `0.02px solid ${colors.dark[900]}`,
                        borderBottom: `0.02px solid ${colors.dark[900]}`,
                        borderLeft: `0.02px solid ${colors.dark[900]}`,
                        borderTop: 'none'
                    }}
                    // aiIcon=""
                    aiIconStyle={{
                        backgroundColor: colors.light[100],
                        // color: colors.light[200]
                    }}
                    searchInput={searchText}
                    // aiIconContentStyle={{
                    //     color: colors.light[200]
                    // }}
                />} */}

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
                    />

                    <FilterColor
                        availableColors={availableColors}
                        filtrationCopy={filtrationCopy}
                        setFiltrationCopy={setFiltrationCopy}
                    />

                    <FilterSize
                        availableSizes={availableSizes}
                        filtrationCopy={filtrationCopy}
                        setFiltrationCopy={setFiltrationCopy}
                    />

                    <FilterType
                        availableType={availableTypes}
                        filtrationCopy={filtrationCopy}
                        setFiltrationCopy={setFiltrationCopy}
                    />
                </div>
                
                    
                {/* </div> */}

                <SortBy
                
                />


                
            {/* </div> */}

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
                        className=' mb-1 mx-2 rounded-sm p-2 text-sm '
                        style={{
                            backgroundColor: colors.dark[100],
                            color: colors.light[100]
                        }}
                        onClick={() => {
                            setFiltration(filtrationCopy);
                            setFilterBarActive(false)
                        }}
                    >validation</button>
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
