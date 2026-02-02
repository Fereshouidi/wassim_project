"use client";

import React, { CSSProperties, useEffect, useRef, useState, useMemo } from 'react';
import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { useClient } from '@/contexts/client';
import { useRegisterSection } from '@/contexts/registerSec';
import { ProductSpecification } from '@/types';
import SkeletonLoading from '../sub/SkeletonLoading';

type ImageType = {
  uri: string | null;
  specification: ProductSpecification | any;
};

type ImagesSwitcherType = {
  className?: string;
  style?: CSSProperties;
  images: ImageType[];
  currentImageIndex: number;
  setCurrentImageIndex: (value: number) => void;
  like: boolean;
  setLike: (value: boolean) => void;
};

const ImagesSwitcher = ({
  className,
  style,
  images,
  currentImageIndex,
  setCurrentImageIndex,
  like,
  setLike,
}: ImagesSwitcherType) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { colors, activeTheme } = useTheme();
  const { screenWidth } = useScreen();
  const { client } = useClient();
  const { setRegisterSectionExist } = useRegisterSection();

  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });

  // --- الحل: تصفية الصور المتكررة بناءً على الرابط uri ---
  const uniqueImages = useMemo(() => {
    if (!images) return [];
    const seen = new Set();
    return images.filter(img => {
      if (!img.uri || seen.has(img.uri)) return false;
      seen.add(img.uri);
      return true;
    });
  }, [images]);

  // تصحيح Index في حال كان خارج نطاق المصفوفة الجديدة
  useEffect(() => {
    if (currentImageIndex >= uniqueImages.length && uniqueImages.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [uniqueImages, currentImageIndex, setCurrentImageIndex]);

  useEffect(() => {
    if (sliderRef.current) {
      const activeThumbnail = sliderRef.current.children[0]?.children[currentImageIndex] as HTMLElement;
      if (activeThumbnail) {
        activeThumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentImageIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (screenWidth < 1024) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y, show: true });
  };

  const handleNext = () => setCurrentImageIndex((currentImageIndex + 1) % uniqueImages.length);
  const handlePrev = () => setCurrentImageIndex((currentImageIndex - 1 + uniqueImages.length) % uniqueImages.length);

  return (
    <div className={`bg-red-500- h-full relative flex flex-col items-center select-none w-full ${screenWidth > 1000 ? "max-w-[550px] max-h-[600px] bg-red-500-" : "max-w-[90%]"}  mx-auto ${className}`} style={style}>
      
      <div 
        className={`relative w-full overflow-hidden rounded-2xl border border-gray-100 shadow-xl bg-white
          ${screenWidth > 500 ? "h-[500px]" : "h-[400px]"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomPos(prev => ({ ...prev, show: false }))}
      >
        <button
          className={`absolute top-2 right-2 z-20 p-2 rounded-full transition-all active:scale-90 shadow-lg
            ${like ? "bg-red-500 text-white" : "bg-white/40 backdrop-blur-md text-gray-600 hover:bg-white/20"}`}
          onClick={() => client ? setLike(!like) : setRegisterSectionExist(true)}
        >
          <img src={like ? "/icons/heart-white.png" : "/icons/heart-white.png"} className="w-6 h-6" alt="like" />
        </button>

        {zoomPos.show && uniqueImages[currentImageIndex]?.uri && (
          <div 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              backgroundImage: `url(${uniqueImages[currentImageIndex]?.uri})`,
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundSize: '120%',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}

        {uniqueImages.length > 0 ? (
          <img
            src={uniqueImages[currentImageIndex]?.uri?? ""}
            alt="Product"
            className={`w-full h-full object-cover transition-opacity duration-200 ${zoomPos.show ? 'opacity-0' : 'opacity-100'}`}
          />
        ) : (
          <SkeletonLoading />
        )}
      </div>

        {uniqueImages.length > 0 && (
        <div className="w-full flex items-center gap-3 mt-5 px-3">

            {screenWidth > 1000 && <button 
                onClick={handlePrev} 
                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 shrink-0 border border-gray-100 dark:border-gray-900 shadow-sm active:scale-90 transition-transform"
            >
                <img 
                    src={activeTheme === "dark" ? "/icons/left-arrow-white.png" : "/icons/left-arrow-black.png"} 
                    className="w-4 h-4" 
                    alt="prev" 
                />
            </button>}

            <div 
            ref={sliderRef} 
            className="flex-1 overflow-x-auto scrollbar-hidden scroll-smooth px-1 py-3"
            >
            <div className="flex flex-row gap-4">
                {uniqueImages.map((img, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300
                    ${currentImageIndex === index 
                        ? 'border-black scale-105 shadow-lg z-10' 
                        : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                >
                    <img 
                        src={img.uri || ""} 
                        className="w-full h-full object-cover" 
                        alt={`thumbnail ${index}`} 
                    />
                </button>
                ))}
            </div>
            </div>

            {screenWidth > 1000 && <button 
                onClick={handleNext} 
                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 shrink-0 border border-gray-100 dark:border-gray-900 shadow-sm active:scale-90 transition-transform"
            >
                <img 
                    src={activeTheme === "dark" ? "/icons/right-arrow-white.png" : "/icons/right-arrow-black.png"} 
                    className="w-4 h-4" 
                    alt="next" 
                />
            </button>}
            
        </div>
        )}
    </div>
  );
};

export default ImagesSwitcher;