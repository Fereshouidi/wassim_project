"use client";
import { useTheme } from '@/contexts/themeProvider';
import React, { CSSProperties } from 'react';
import SkeletonLoading from '../SkeletonLoading';

type ProductCardSkeletonProps = {
    className?: string;
    style?: CSSProperties;
}

const ProductCardSkeleton = ({ className, style }: ProductCardSkeletonProps) => {
    const { colors } = useTheme();

    return (
        <div
            className={`flex flex-col items-center gap-2 rounded-sm- overflow-hidden pb-3 px-2 ${className}`}
            style={{
                ...style,
                backgroundColor: 'transparent',
                // boxShadow: `0 0px 15px ${colors.light[300]}`,
            }}
        >
            {/* Image Skeleton */}
            <div className='w-full h-[200px] rounded-sm- overflow-hidden mt-2'>
                <SkeletonLoading />
            </div>

            {/* Title Skeleton */}
            <div className='w-3/4 h-5 rounded-sm- overflow-hidden mt-2'>
                <SkeletonLoading />
            </div>

            {/* Price Skeleton */}
            <div className='w-1/2 h-6 rounded-sm- overflow-hidden'>
                <SkeletonLoading />
            </div>


        </div>
    );
};

export default ProductCardSkeleton;