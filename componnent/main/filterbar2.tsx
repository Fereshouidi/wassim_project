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
        // في الموبايل فقط، نغلق القائمة بعد التأكيد
        if (screenWidth < 1024) setFilterBarActive(false);
    };

    // هذا التصميم مخصص ليكون بجانب المنتجات (Vertical)
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
                top: screenWidth > 1024 ? `${-headerHeight}px` : '',
            }}
        >
            {/* Header: عدد النتائج وزر الإغلاق للموبايل */}
            <div className="p-6 flex justify-between items-center border-b" style={{ borderColor: colors.light[200] }}>
                <div>
                    <h2 className="font-black text-xl uppercase tracking-tighter" style={{ color: colors.dark[100] }}>
                        {activeLanguage.sideMatter.filter}
                    </h2>
                    <p className="text-[10px] opacity-50 uppercase tracking-widest">
                        {productsCount} {activeLanguage.sideMatter.resultsFound}
                    </p>
                </div>
                
                {/* زر إغلاق يظهر فقط في الشاشات الصغيرة */}
                <button 
                    className="lg:hidden p-2 rounded-full bg-gray-500/10"
                    onClick={() => setFilterBarActive(false)}
                >
                    ✕
                </button>
            </div>

            {/* Scrollable Content: جميع الفلاتر تحت بعضها */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-10 scrollbar-hidden">
                
                {/* 1. السعر */}
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

                {/* 3. المجموعات، الألوان، المقاسات */}
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

                {/* 2. الترتيب */}
                <div className="space-y-3">
                    <SortBy
                        filtrationCopy={filtrationCopy}
                        setFiltrationCopy={setFiltrationCopy}
                        filterBarWidth={320}
                    />
                </div>

            </div>

            {/* Footer: أزرار التحكم الثابتة في الأسفل */}
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
                    }} // Reset logic
                >
                    Clear All
                </button>
            </div>
        </aside>
    )
}

export default FilterBar;