"use client";
import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider';
import { FiltrationType } from '@/types';
import React from 'react'

type currentSort = 'price' | 'name' | 'date';
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

    // دالة لتغيير نوع الترتيب أو الاتجاه
    const handleSort = (type: currentSort) => {
        let direction: curentSortDirection = 'desc';
        
        // إذا نقر المستخدم على نفس النوع الفعال، نقوم بعكس الاتجاه تلقائياً
        if (filtrationCopy.sortBy === type) {
            direction = filtrationCopy.sortDirection === 'desc' ? 'asc' : 'desc';
        } else {
            // اتجاهات افتراضية منطقية عند النقر لأول مرة
            direction = type === 'price' ? 'asc' : 'desc';
        }

        setFiltrationCopy({
            ...filtrationCopy,
            sortBy: type,
            sortDirection: direction
        });
    };

    const getDirectionLabel = (type: currentSort) => {
        if (filtrationCopy.sortBy !== type) return "";
        const isAsc = filtrationCopy.sortDirection === 'asc';
        
        if (type === 'price') return isAsc ? "(↑)" : "(↓)"; // cheapest vs expensive
        if (type === 'date') return isAsc ? "(Old)" : "(New)";
        if (type === 'name') return isAsc ? "(A-Z)" : "(Z-A)";
        return "";
    };

    const sortItems: { id: currentSort; label: string }[] = [
        { id: 'date', label: activeLanguage.sideMatter.date },
        { id: 'price', label: activeLanguage.sideMatter.price },
        { id: 'name', label: activeLanguage.sideMatter.name },
    ];

    return (
        <div className={`
            flex w-full transition-all duration-300
            ${filterBarWidth > 700 ? "flex-row justify-center items-center gap-6" : "flex-col items-center gap-4"}
        `}>
            {/* العنوان */}
            <div className='opacity-40 uppercase tracking-[0.2em] text-[10px] font-black'>
                {activeLanguage.sideMatter.SortBy}
            </div>

            {/* حاوية الأزرار */}
            <div className={`
                flex flex-wrap justify-center gap-2
                ${filterBarWidth < 500 ? "w-full px-4" : "w-auto"}
            `}>
                {sortItems.map((item) => {
                    const isActive = filtrationCopy.sortBy === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleSort(item.id)}
                            className={`
                                flex items-center justify-center gap-2 px-6 py-2.5 rounded-full
                                text-[11px] font-black uppercase transition-all duration-300 active:scale-90
                                border
                            `}
                            style={{
                                backgroundColor: isActive ? colors.dark[100] : 'transparent',
                                color: isActive ? colors.light[100] : colors.dark[100],
                                borderColor: isActive ? colors.dark[100] : colors.light[300],
                            }}
                        >
                            {item.label}
                            {isActive && <span className="opacity-60 text-[9px]">{getDirectionLabel(item.id)}</span>}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default SortBy;