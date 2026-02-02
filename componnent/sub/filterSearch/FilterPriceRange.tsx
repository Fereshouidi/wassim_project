"use client";
import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider';
import { FiltrationType } from '@/types';
import React from 'react'

type FilterPriceRangeType = {
    filtration: FiltrationType
    mostProductExpensive: number
    filtrationCopy: FiltrationType, 
    setFiltrationCopy: (value: FiltrationType) => void
}

const FilterPriceRange = ({
    mostProductExpensive,
    filtrationCopy,
    setFiltrationCopy
}: FilterPriceRangeType) => {

    const { activeLanguage } = useLanguage();
    const { colors } = useTheme();

    const getPercent = (value: number) => Math.round((value / mostProductExpensive) * 100);

    const handlePriceChange = (type: 'from' | 'to', value: string) => {
        const numValue = parseFloat(value);
        setFiltrationCopy({
            ...filtrationCopy,
            price: { ...filtrationCopy.price, [type]: numValue }
        });
    };

    // مظهر المسار (Track)
    const getTrackStyle = (currentValue: number): React.CSSProperties => ({
        height: "4px",
        WebkitAppearance: "none",
        borderRadius: "999px",
        background: `linear-gradient(to right, ${colors.dark[100]} ${getPercent(currentValue)}%, ${colors.light[300]} ${getPercent(currentValue)}%)`,
    });

    return (
        <div className="w-full flex flex-col px-4 py-6- border-b" style={{ borderColor: colors.light[200] }}>
            {/* لتغيير لون الكرة (Thumb) بدون استخدام activeTheme في المنطق، نستخدم الـ CSS المضمن */}
            <style dangerouslySetInnerHTML={{ __html: `
                input[type='range']::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: ${colors.dark[100]};
                    cursor: pointer;
                    border: 2px solid ${colors.light[100]};
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }
                input[type='range']::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: ${colors.dark[100]};
                    cursor: pointer;
                    border: 2px solid ${colors.light[100]};
                }
            `}} />

            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-10- opacity-60" style={{ color: colors.dark[100] }}>
                {activeLanguage.sideMatter.priceZone}
            </h4>
            
            <div className="space-y-6">
                {/* Min Slider */}
                <div className="relative flex flex-col group">
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-[9px] font-bold opacity-40 uppercase" style={{ color: colors.dark[100] }}>{activeLanguage.sideMatter.min}</span>
                        <span className="text-[12px] font-black" style={{ color: colors.dark[100] }}>
                            {filtrationCopy.price.from} <span className="text-[9px] opacity-40">D.T</span>
                        </span>
                    </div>
                    <input 
                        type="range"
                        min={0}
                        max={mostProductExpensive}
                        value={filtrationCopy.price.from?? 999}
                        onChange={(e) => handlePriceChange('from', e.target.value)}
                        className="w-full appearance-none bg-transparent cursor-pointer"
                        style={getTrackStyle(filtrationCopy.price.from)}
                    />
                </div>

                {/* Max Slider */}
                <div className="relative flex flex-col group">
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-[9px] font-bold opacity-40 uppercase" style={{ color: colors.dark[100] }}>{activeLanguage.sideMatter.max}</span>
                        <span className="text-[12px] font-black" style={{ color: colors.dark[100] }}>
                            {filtrationCopy.price.to} <span className="text-[9px] opacity-40">D.T</span>
                        </span>
                    </div>
                    <input 
                        type="range"
                        min={0}
                        max={mostProductExpensive}
                        value={filtrationCopy.price.to}
                        onChange={(e) => handlePriceChange('to', e.target.value)}
                        className="w-full appearance-none bg-transparent cursor-pointer"
                        style={getTrackStyle(filtrationCopy.price.to)}
                    />
                </div>
            </div>

            <div className="flex justify-between mt-8 opacity-20 text-[8px] font-bold">
                <span style={{ color: colors.dark[100] }}>0 D.T</span>
                <span style={{ color: colors.dark[100] }}>{mostProductExpensive} D.T</span>
            </div>
        </div>
    )
}

export default FilterPriceRange;