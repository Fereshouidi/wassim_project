"use client";

import { useLanguage } from '@/contexts/languageContext';
import { useSocket } from '@/contexts/soket';
import { useTheme } from '@/contexts/themeProvider';
import { PurchaseType } from '@/types';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Props = {
    purchase: PurchaseType;
    setPurchases: (purchases: PurchaseType[]) => void;
};

const PurchaseItem = ({ purchase, setPurchases }: Props) => {
    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const socket = useSocket();
    const router = useRouter();
    const [purchase_, setPurchase_] = useState<PurchaseType | null>(null);

    useEffect(() => { setPurchase_(purchase); }, [purchase]);

    const updatePurchase = (updatedData: PurchaseType) => {
        if (!updatedData) return;
        socket.emit("update_purchase", updatedData);
        if (!updatedData.cart) {
            // @ts-ignore
            setPurchases((prev: PurchaseType[]) => prev.filter(p => p._id !== updatedData._id));
        }
    };

    if (!purchase_ || !purchase) return null;

    return (
        <div 
            className='group flex gap-3 p-3 rounded-sm border transition-all hover:border-gray-400 bg-white cursor-pointer'
            style={{ 
                borderColor: colors.light[200],
                backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.02)' : '#fff'
            }}
            onClick={() => {
                localStorage.setItem('purchaseId', purchase._id ?? "");
                // @ts-ignore
                router.push(`/product/${purchase.product?._id}`);
            }}
        >
            {/* Thumbnail */}
            <div className="w-20 h-24 flex-shrink-0 overflow-hidden rounded-sm bg-gray-50 border" style={{ borderColor: colors.light[200] }}>
                <img 
                    // @ts-ignore
                    src={purchase.product?.thumbNail} 
                    className='w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-300'
                    alt="" 
                />
            </div>

            {/* Info & Controls */}
            <div className='flex-1 flex flex-col justify-between py-1'>
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <h3 className=' flex flex-1 text-[13px] font-bold leading-tight line-clamp-2'>
                            {
                                // @ts-ignore
                                purchase.product?.name[activeLanguage.language]
                            }
                        </h3>
                        {/* Remove Icon */}
                        <button 
                            className='w-3 h-3 opacity-50 hover:opacity-100 transition-opacity p-1-'
                            onClick={(e) => {
                                e.stopPropagation();
                                updatePurchase({...purchase, cart: null, status: "viewed"});
                            }}
                        >
                            <img src="/icons/trash.png" className="w-full h-full" alt="remove"/>
                        </button>
                    </div>

                    <div className='flex flex-wrap gap-2 mt-2 opacity-60 text-[10px] uppercase font-medium tracking-wide'>
                        {/* @ts-ignore */}
                        {purchase.specification?.color && <span>{purchase.specification.color}</span>}
                        {/* @ts-ignore */}
                        {purchase.specification?.size && <span className="border-l pl-2" style={{borderColor: colors.dark[200]}}>{purchase.specification.size}</span>}
                        {/* @ts-ignore */}
                        {purchase.specification?.type && <span className="border-l pl-2" style={{borderColor: colors.dark[200]}}>{purchase.specification.type}</span>}
                    </div>
                </div>

                <div className='flex justify-between items-end mt-2'>
                    <div className='flex items-center border rounded-sm h-7' style={{ borderColor: colors.light[300] }}>
                        <button 
                            className='w-7 h-full flex items-center justify-center hover:bg-black/5'
                            onClick={(e) => {
                                e.stopPropagation();
                                if ((purchase.quantity || 0) <= 1) return;
                                updatePurchase({...purchase, quantity: (purchase.quantity || 0) - 1});
                            }}
                        >
                            <img src={activeTheme == "dark" ? "/icons/minus-light.png" : "/icons/minus-dark.png"} className='w-2 h-2 opacity-60' alt="-" />
                        </button>
                        <span className='px-2 text-xs font-bold w-6 text-center'>{purchase.quantity}</span>
                        <button 
                            className='w-7 h-full flex items-center justify-center hover:bg-black/5'
                            onClick={(e) => {
                                e.stopPropagation();
                                // @ts-ignore
                                if ((purchase.quantity || 0) >= (purchase?.specification?.quantity || 100)) return;
                                updatePurchase({...purchase, quantity: (purchase.quantity || 0) + 1});
                            }}
                        >
                            <img src={activeTheme == "dark" ? "/icons/add-white.png" : "/icons/add-black.png"} className='w-2 h-2 opacity-60' alt="+" />
                        </button>
                    </div>
                    
                    <p className='text-sm font-bold' style={{ color: colors.dark[100] }}>
                        {/* @ts-ignore */}
                        {purchase.specification?.price} <span className="text-[10px] font-normal">T.D</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PurchaseItem;