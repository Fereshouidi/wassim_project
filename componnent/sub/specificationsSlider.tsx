"use client";

import { ProductImage, ProductSpecification } from '@/types'
import React, { useState, useMemo } from 'react'
import { useScreen } from '@/contexts/screenProvider';
import { ReactSVG } from 'react-svg';

type Props = {
    product?: ProductImage[]; 
    specifications?: ProductSpecification[];
    onColorSelect?: (hex: string | null) => void;
    importedFrom?: "productDetails" | "slider";
    availableColors?: string[];
}

const DiamondIcon = ({ color, size, isLight }: { color: string, size: string, isLight: boolean }) => (
    <ReactSVG 
        src="/icons/diamond2.svg" 
        beforeInjection={(svg) => {
            // هنا نتحكم في الحجم واللون برمجياً قبل حقن الـ SVG في الصفحة
            svg.setAttribute('style', `width: ${size}; height: ${size}; fill: ${color};`);
            
            // إضافة ظل إذا كانت الإضاءة فاتحة
            if (isLight) {
                svg.style.filter = 'drop-shadow(0px 0px 1.5px rgba(0,0,0,0.3))';
            }
        }}
        wrapper="span"
        className="flex items-center justify-center transition-all duration-300"
    />
);

const SpecificationsSlider = ({ 
    product, 
    specifications, 
    onColorSelect, 
    importedFrom = "slider",
    availableColors 
}: Props) => {
    const { screenWidth } = useScreen();
    
    const isProductDetails = importedFrom === "productDetails";
    const isMobile = screenWidth < 640;

    const uniqueSpecs = useMemo(() => {
        const source = product 
            ? product.map(img => img.specification).filter(Boolean) as ProductSpecification[]
            : specifications || [];

        return source.filter(spec => {
            const colorName = spec.color;
            const isAvailable = !isProductDetails || !availableColors || (colorName && availableColors.includes(colorName));
            return spec.colorHex && isAvailable;
        });
    }, [product, specifications, availableColors, isProductDetails]);

    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const isLightColor = (hex: string) => {
        const color = hex.replace('#', '');
        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);
        return (r * 0.299 + g * 0.587 + b * 0.114) > 220;
    };

    const getSizes = () => {
        if (isProductDetails) {
            return {
                container: "w-10 h-10",
                iconBase: "28px",
                iconActive: "32px",
                gap: "gap-2",
                padding: "py-2",
                ringInset: "-inset-[1px]"
            };
        } else {
            return {
                container: "w-7 h-7",
                iconBase: isMobile ? "20px" : "22px", 
                iconActive: isMobile ? "20px" : "24px",
                gap: "gap-1",
                padding: isMobile ? "py-1" : "py-3",
                ringInset: "-inset-[1px]"
            };
        }
    };

    const sizes = getSizes();

    return (
        <div 
            className={`w-full flex flex-row items-center ${isProductDetails ? 'justify-start' : 'justify-center'}`} 
            onClick={(e) => e.stopPropagation()}
        >
            <div className={`flex flex-nowrap items-center ${sizes.gap} ${sizes.padding} overflow-x-auto scrollbar-hidden touch-pan-x px-4`}>
                {uniqueSpecs.map((spec, index) => {
                    const hex = spec.colorHex || "";
                    const isSelected = selectedColor === hex;
                    if (!hex) return null;

                    return (
                        <div
                            key={index}
                            onClick={() => {
                                const nextColor = isSelected ? null : hex;
                                setSelectedColor(nextColor);
                                if (onColorSelect) onColorSelect(nextColor);
                            }}
                            className={`flex-shrink-0 relative flex items-center justify-center cursor-pointer transition-all duration-300 ${isSelected ? 'scale-110' : 'hover:scale-110'}`}
                        >
                            <div 
                                className={`absolute ${sizes.ringInset} rounded-full border-[1.5px] transition-all duration-500 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                                style={{ borderColor: hex }}
                            />
                            
                            <div className={`relative flex items-center justify-center ${sizes.container}`}>
                                <DiamondIcon 
                                    color={hex} 
                                    size={isSelected ? sizes.iconActive : sizes.iconBase} 
                                    isLight={isLightColor(hex)} 
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default SpecificationsSlider;