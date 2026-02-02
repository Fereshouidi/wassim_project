"use client";

import { useLanguage } from '@/contexts/languageContext'
import { useOwner } from '@/contexts/ownerInfo'
import { useTheme } from '@/contexts/themeProvider'
import { PurchaseType } from '@/types'
import React, { useMemo } from 'react'
import SkeletonLoading from '../sub/SkeletonLoading'

type Props = { purchases?: PurchaseType[] }

const OrderData = ({ purchases }: Props) => {
    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const { ownerInfo } = useOwner();

    const subTotal = useMemo(() => {
        return purchases?.reduce((acc, purchase) => {
            // @ts-ignore
            const price = purchase.specification?.price || 0;
            return acc + (price * (purchase.quantity || 1));
        }, 0) || 0;
    }, [purchases]);

    if (!ownerInfo) return <div className="h-20 animate-pulse bg-gray-100 rounded-xl" />;

    const finalTotal = subTotal + (ownerInfo?.shippingCost || 0);

    return (
        <div className='flex flex-col gap-1 w-full'>
            <h4 className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-2">{activeLanguage.orderSummary}</h4>
            
            <div className="flex justify-between items-center text-xs">
                <span className="opacity-60">{activeLanguage.totalPrice}</span>
                <span className="font-semi-bold">{subTotal.toFixed(2)} D.T</span>
            </div>

            <div className="flex justify-between items-center text-xs">
                <span className="opacity-60">{activeLanguage.shippingCoast}</span>
                <span className="font-semi-bold">{ownerInfo.shippingCost?.toFixed(2)} D.T</span>
            </div>

            <div className="my-2 border-t border-dashed" style={{ borderColor: colors.light[300] }} />

            <div 
                className="flex justify-between items-center p-3 rounded-xl"
                style={{ backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
            >
                <span className="text-[11px] uppercase font-bold tracking-tight">{activeLanguage.totalAmmount}</span>
                <span className="text-lg font-bold tracking-tight" style={{ color: colors.dark[100] }}>
                    {finalTotal.toFixed(2)} <span className="text-[10px]">D.T</span>
                </span>
            </div>
        </div>
    );
}

export default OrderData;