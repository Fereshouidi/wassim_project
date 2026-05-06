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
    defaultSelectedColor?: string | null;
}

const DiamondIcon = ({ color, size, isLight }: { color: string, size: string, isLight: boolean }) => (
    <ReactSVG 
        src="/icons/diamond-svgrepo-com.svg" 
        beforeInjection={(svg) => {
            svg.setAttribute('style', `width: ${size}; height: ${size}; fill: ${color};`);
            
            if (isLight) {
                svg.style.filter = 'drop-shadow(0px 0px 1.5px rgba(0,0,0,0.3))';
            }

            const paths = svg.querySelectorAll('path');
            paths.forEach((path) => {
                path.setAttribute('fill', color);
            });
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
    availableColors,
    defaultSelectedColor = null 
}: Props) => {
    const { screenWidth } = useScreen();
    const isProductDetails = importedFrom === "productDetails";
    const isMobile = screenWidth < 640;

    const uniqueSpecs = useMemo(() => {
        const source = product 
            ? product.map(img => img.specification).filter(Boolean) as ProductSpecification[]
            : specifications || [];

        const seenColors = new Set<string>();
        const seenHexes = new Set<string>();

        return source.filter(spec => {
            let hex = spec.colorHex?.trim().toLowerCase();
            const colorName = spec.color?.trim().toLowerCase();

            // Normalize hex
            if (hex && hex.length === 4 && hex.startsWith('#')) {
                hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
            }

            const isAvailable = !isProductDetails || !availableColors || (colorName && availableColors.includes(spec.color || ""));
            
            if (!isAvailable) return false;

            // If we have both hex and name, check both. If we have only one, check that.
            const hasSeenHex = hex ? seenHexes.has(hex) : false;
            const hasSeenName = colorName ? seenColors.has(colorName) : false;

            if ((hex && hasSeenHex) || (colorName && hasSeenName)) {
                return false;
            }

            if (hex) seenHexes.add(hex);
            if (colorName) seenColors.add(colorName);
            
            // Only allow if we have at least one identifier and haven't seen it yet
            return hex || colorName;
        });
    }, [product, specifications, availableColors, isProductDetails]);

    const [selectedColor, setSelectedColor] = useState<string | null>(defaultSelectedColor);

    if (uniqueSpecs.length <= 1) return null;

    const isLightColor = (hex: string) => {
        const color = hex.replace('#', '');
        let r, g, b;
        if (color.length === 3) {
            r = parseInt(color[0] + color[0], 16);
            g = parseInt(color[1] + color[1], 16);
            b = parseInt(color[2] + color[2], 16);
        } else {
            r = parseInt(color.substring(0, 2), 16);
            g = parseInt(color.substring(2, 4), 16);
            b = parseInt(color.substring(4, 6), 16);
        }
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
                container: "w-6 h-6",
                iconBase: isMobile ? "15px" : "17px", 
                iconActive: isMobile ? "15px" : "17px",
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