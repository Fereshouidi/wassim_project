"use client";

import { useLanguage } from '@/contexts/languageContext'
import { useOwner } from '@/contexts/ownerInfo'
import { useTheme } from '@/contexts/themeProvider'
import { PurchaseType } from '@/types'
import React, { useMemo } from 'react'

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

    if (!ownerInfo) return <div className="h-20 animate-pulse rounded-xl" style={{ backgroundColor: colors.light[200] }} />;

    const isFreeShipping = (ownerInfo.freeShippingThreshold || 0) > 0 && subTotal >= (ownerInfo.freeShippingThreshold || 0);
    const effectiveShippingCost = isFreeShipping ? 0 : (ownerInfo.shippingCost || 0);
    const finalTotal = subTotal + effectiveShippingCost;

    return (
        <div
            className='w-full p-6 rounded-xl border transition-all duration-300'
            style={{
                backgroundColor: colors.light[100],
                borderColor: colors.light[250],
            }}
        >
            {/* Header with Technical Accent */}
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 rounded-full' style={{ backgroundColor: colors.dark[100] }} />
                    <h4 className="text-[10px] uppercase font-black tracking-[0.3em] opacity-40">
                        {activeLanguage.orderSummary}
                    </h4>
                </div>
                {/* <span className='text-[10px] font-semibold opacity-20 tracking-tighter'>SECURE_CHECKOUT</span> */}
            </div>

            {/* Price Details */}
            <div className='flex flex-col gap-4 mb-6'>
                <div className="flex justify-between items-center text-[10px]">
                    <span className="opacity-50 font-semibold uppercase tracking-wider">{activeLanguage.totalPrice}</span>
                    <span className="font-semibold text-[14px] " style={{ color: colors.dark[100] }}>
                        {subTotal.toFixed(2)} <span className="text-[12px] opacity-40 ml-1">D.T</span>
                    </span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                    <span className="opacity-50 font-semibold uppercase tracking-wider">{activeLanguage.shippingCoast}</span>
                    <span className="font-semibold text-[14px] " style={{ color: colors.dark[100] }}>
                        {isFreeShipping ? (
                            <span className="text-emerald-500 font-black">FREE</span>
                        ) : (
                            <>
                                {effectiveShippingCost.toFixed(2)} <span className="text-[12px] opacity-40 ml-1">D.T</span>
                            </>
                        )}
                    </span>
                </div>
                {!isFreeShipping && (ownerInfo.freeShippingThreshold || 0) > 0 && (
                    <div className="bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50 mt-1">
                        <p className="text-[8px] font-black uppercase text-emerald-600/60 tracking-wider text-center">
                            {(ownerInfo.freeShippingThreshold! - subTotal).toFixed(0)} D.T remaining for FREE SHIPPING
                        </p>
                    </div>
                )}
            </div>

            {/* Minimalist Divider */}
            <div className="w-full h-[1px] mb-6 opacity-10" style={{ backgroundColor: colors.dark[100] }} />

            {/* Grand Total Area */}
            <div className="flex justify-between items-end">
                <div className='flex flex-col'>
                    <span className="text-[11px] uppercase font-semibold tracking-widest" style={{ color: colors.dark[100] }}>
                        {activeLanguage.totalAmmount}
                    </span>
                    <span className='text-[10px] font-semibold opacity-30 uppercase mt-1'>
                        ({activeLanguage.IncludingDeliveryCost})
                    </span>
                </div>
                
                <div className='flex items-baseline gap-1'>
                    <span className="text-2xl font-semibold tracking-tighter" style={{ color: colors.dark[100] }}>
                        {finalTotal.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-semibold opacity-40">D.T</span>
                </div>
            </div>
        </div>
    );
}

export default OrderData;