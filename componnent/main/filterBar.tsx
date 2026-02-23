"use client";
import React, { useRef } from 'react';
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import { useScreen } from '@/contexts/screenProvider';
import { CollectionType, FiltrationType } from '@/types';
import { headerHeight, headerHeightForPhones } from '@/constent';

// Sub-components imports
import FilterPriceRange from '../sub/filterSearch/FilterPriceRange';
import FilterCollection from '../sub/filterSearch/filterCollections';
import FilterColor from '../sub/filterSearch/filterColor';
import FilterSize from '../sub/filterSearch/filterSize';
import FilterType from '../sub/filterSearch/filterType';
import SortBy from '../sub/filterSearch/sortBy';

type FilterBarType = {
    filtration: FiltrationType;
    setFiltration: (value: FiltrationType) => void;
    mostProductExpensive: number;
    productsCount: number;
    allCollections: CollectionType[];
    availableColors: string[];
    availableSizes: string[];
    availableTypes: string[];
    filteBarActive: boolean;
    setFilterBarActive: (value: boolean) => void;
};

const FilterBar = ({
    filtration,
    setFiltration,
    mostProductExpensive,
    productsCount,
    allCollections,
    availableColors,
    availableSizes,
    availableTypes,
    filteBarActive,
    setFilterBarActive
}: FilterBarType) => {

    const { screenWidth } = useScreen();
    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const filterBarRef = useRef<HTMLDivElement>(null);

    const handleUpdate = (updated: FiltrationType) => {
        setFiltration(updated);
        localStorage.setItem('searchFilter', JSON.stringify(updated));
    };

    return (
        <div 
            ref={filterBarRef}
            className={`
                w-full sticky z-30 transition-all duration-500 ease-in-out flex flex-col overflow-hidden
                ${filteBarActive ? "rounded-b-[2rem]" : "rounded-full items-center"}
            `}
            style={{
                backgroundColor: colors.light[100],
                color: colors.dark[100],
                boxShadow: filteBarActive ? `0 20px 40px -10px rgba(0, 0, 0, 0.1)` : 'none',
                border: `1px solid ${colors.light[200]}`,
                top: screenWidth > 1100 ? `${headerHeight}px` : `${headerHeightForPhones}px`,
                height: filteBarActive ? "auto" : "56px",
                maxHeight: filteBarActive ? "85vh" : "56px"
            }}
        >
            {/* Minimal Upper Header */}
            <div className="flex items-center justify-between px-6 h-[56px] min-h-[56px] w-full">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black">{productsCount}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">
                        {activeLanguage.sideMatter.resultsFound}
                    </span>
                </div>

                <button 
                    onClick={() => setFilterBarActive(!filteBarActive)}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full transition-all active:scale-95"
                    style={{ backgroundColor: colors.light[200] }}
                >
                    <span className="text-[9px] font-black uppercase tracking-widest">
                        {filteBarActive ? (activeLanguage.close || "CLOSE") : activeLanguage.sideMatter.filter}
                    </span>
                    <img 
                        src={filteBarActive ? 
                            (activeTheme === 'dark' ? "/icons/up-white.png" : "/icons/up-black.png") : 
                            (activeTheme === 'dark' ? "/icons/filter-white.png" : "/icons/filter-black.png")
                        } 
                        className="w-3.5 h-3.5 object-contain opacity-70"
                    />
                </button>
            </div>

            {/* Collapsible Filter Content */}
            <div className={`
                w-full transition-all duration-500 px-4 pb-6
                ${filteBarActive ? "opacity-100 overflow-y-auto" : "opacity-0 pointer-events-none"}
            `}>
                <div className="flex flex-col gap-5 sm:gap-8 mt-4">
                    
                    {/* Price Range Section - Compact Layout */}
                    <div className="w-full lg:w-3/4 mx-auto p-4 sm:p-6 rounded-2xl" style={{ backgroundColor: colors.light[200] }}>
                        {mostProductExpensive && (
                            <FilterPriceRange
                                filtration={filtration}
                                mostProductExpensive={mostProductExpensive}
                                filtrationCopy={filtration}
                                setFiltrationCopy={handleUpdate}
                            />
                        )}
                    </div>

                    <div className="w-full flex flex-col gap-5">
                        {/* 1. Collections - Tight Spacing */}
                        <div className="flex flex-col gap-2">
                            <h5 className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30 px-1">
                                {activeLanguage.collections}
                            </h5>
                            <div className="flex flex-wrap gap-1.5">
                                <FilterCollection 
                                    allCollections={allCollections} 
                                    filtrationCopy={filtration} 
                                    setFiltrationCopy={handleUpdate} 
                                    defaultOptions={filtration.collections} 
                                />
                            </div>
                        </div>

                        {/* 2. Responsive Grid: Colors, Sizes, and Types */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                            
                            {/* Colors Wrapper */}
                            <div className="flex flex-col gap-3 p-3 sm:p-5 rounded-xl border" style={{ borderColor: colors.light[200] }}>
                                <h5 className="text-[8px] font-black uppercase tracking-widest opacity-30">
                                    {activeLanguage.sideMatter.colors}
                                </h5>
                                <FilterColor 
                                    availableColors={availableColors} 
                                    filtrationCopy={filtration} 
                                    setFiltrationCopy={handleUpdate} 
                                    defaultOptions={filtration.colors} 
                                />
                            </div>

                            {/* Sizes Wrapper */}
                            <div className="flex flex-col gap-3 p-3 sm:p-5 rounded-xl border" style={{ borderColor: colors.light[200] }}>
                                <h5 className="text-[8px] font-black uppercase tracking-widest opacity-30">
                                    {activeLanguage.sideMatter.sizes}
                                </h5>
                                <FilterSize 
                                    availableSizes={availableSizes} 
                                    filtrationCopy={filtration} 
                                    setFiltrationCopy={handleUpdate} 
                                    defaultOptions={filtration.sizes} 
                                />
                            </div>

                            {/* Types Wrapper */}
                            <div className="flex flex-col gap-3 p-3 sm:p-5 rounded-xl border" style={{ borderColor: colors.light[200] }}>
                                <h5 className="text-[8px] font-black uppercase tracking-widest opacity-30">
                                    {activeLanguage.sideMatter.types}
                                </h5>
                                <FilterType 
                                    availableType={availableTypes} 
                                    filtrationCopy={filtration} 
                                    setFiltrationCopy={handleUpdate} 
                                    defaultOptions={filtration.types} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sorting Section */}
                    <div className="border-t pt-5 flex justify-center" style={{ borderColor: colors.light[200] }}>
                        <SortBy
                            filtrationCopy={filtration}
                            setFiltrationCopy={handleUpdate}
                            filterBarWidth={filterBarRef.current?.offsetWidth ?? 0}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;