"use client";

import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { CollectionType, FiltrationType } from '@/types'
import React, { useEffect, useRef, useState } from 'react'
import FilterPriceRange from '../sub/filterSearch/FilterPriceRange'
import FilterCollection from '../sub/filterSearch/filterCollections'
import FilterColor from '../sub/filterSearch/filterColor'
import FilterSize from '../sub/filterSearch/filterSize'
import FilterType from '../sub/filterSearch/filterType'
import SortBy from '../sub/filterSearch/sortBy'
import { headerHeight } from '@/constent'
import { useScreen } from '@/contexts/screenProvider'

type FilterBarType = {
    filtration: FiltrationType
    setFiltration: (value: FiltrationType) => void
    mostProductExpensive: number
    productsCount: number
    allCollections: CollectionType[]
    availableColors: string[]
    availableSizes: string[]
    availableTypes: string[]
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
    importedFrom,
    filteBarActive,
    setFilterBarActive
}: FilterBarType) => {

    const { screenWidth } = useScreen();
    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const [filtrationCopy, setFiltrationCopy] = useState<FiltrationType>(filtration);

    useEffect(() => {
        setFiltrationCopy(filtration);
    }, [filtration]);

    const handleConfirm = () => {
        setFiltration(filtrationCopy);
        localStorage.setItem('searchFilter', JSON.stringify(filtrationCopy));
        
        // Close the filter bar on mobile devices after confirmation
        if (screenWidth < 1024) setFilterBarActive(false);
    };

    // Vertical layout design intended for side-by-side product placement
    return (
        <aside 
            className={`
                fixed- lg:sticky- transition-all duration-500 ease-in-out z-[10]-
                left-0 top-0 lg:top-[${headerHeight}px]-
                w-[280px]- sm:w-[320px]- h-full lg:h-[calc(100vh-100px)]-
                flex flex-col border-r shadow-2xl lg:shadow-none bg-red-500
            `}
            style={{
                backgroundColor: colors.light[100],
                borderColor: colors.light[200],
                top: screenWidth > 1024 ? `${-headerHeight}px` : ``,
            }}
        >


            {/* Scrollable Content: Main filter groups */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-10 scrollbar-hidden">
                
                {/* 1. Price Filtering Section */}
                {mostProductExpensive && (
                    <div className="py-2">
                        <FilterPriceRange
                            filtration={filtration}
                            mostProductExpensive={mostProductExpensive}
                            filtrationCopy={filtrationCopy}
                            setFiltrationCopy={setFiltrationCopy}
                        />
                    </div>
                )}

                {/* 2. Collections, Colors, and Sizes Group */}
                <div className="flex flex-col gap-6">
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

                {/* 3. Sorting Options Section */}
                <div className="space-y-3">
                    <SortBy
                        filtrationCopy={filtrationCopy}
                        setFiltrationCopy={setFiltrationCopy}
                        filterBarWidth={320}
                    />
                </div>

            </div>

            {/* Footer: Persistent control buttons */}
            <div className="p-6 border-t bg-inherit" style={{ borderColor: colors.light[200] }}>
                <button
                    className="w-full py-3 rounded-2xl font-bold text-[12px] uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl shadow-black/5"
                    style={{
                        backgroundColor: colors.dark[100],
                        color: colors.light[100]
                    }}
                    onClick={handleConfirm}
                >
                    {activeLanguage.sideMatter.confirm}
                </button>
                
                <button 
                    className="w-full mt-3 text-[11px] font-bold opacity-40 hover:opacity-100 transition-opacity uppercase underline"
                    onClick={() => {
                        setFiltrationCopy(filtration)
                        setFiltration(filtration)
                    }} // Reset logic to initial state
                >
                    Clear All
                </button>
            </div>
        </aside>
    )
}

export default FilterBar;