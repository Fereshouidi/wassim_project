"use client";

import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import { PurchaseType } from '@/types';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backEndUrl } from '@/api';
import { useCartSide } from '@/contexts/cart';

type Props = {
    purchase: PurchaseType;
    setPurchases: (purchases: PurchaseType[] | ((prev: PurchaseType[]) => PurchaseType[])) => void;

};

const PurchaseItem = ({ purchase, setPurchases }: Props) => {
    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const router = useRouter();
    const [purchase_, setPurchase_] = useState<PurchaseType | null>(null);
    const { setIsActive } = useCartSide();

    useEffect(() => { setPurchase_(purchase); }, [purchase]);

    // Optimistic UI update function
    const updatePurchaseData = async (updatedData: PurchaseType) => {
        if (!updatedData) return;

        // Save original data for potential revert
        const originalPurchase = { ...purchase };

        // 1. Optimistically update the UI in the parent state
        setPurchases((prev: PurchaseType[]) => {
            if (updatedData.status === "viewed") {
                return prev.filter(p => p._id === updatedData._id ? false : true);
            }
            return prev.map(p => p._id === updatedData._id ? updatedData : p);
        });

        try {
            // 2. Send update to server in background
            const { data } = await axios.put(`${backEndUrl}/updatePurchase`, updatedData);

            if (!data.success) {
                throw new Error("Server update failed");
            }
            
            // Optionally, sync with server's returned data to ensure consistency (e.g., final price/stock)
            setPurchases((prev: PurchaseType[]) =>
                prev.map(p => p._id === data.purchase._id ? data.purchase : p)
            );
        } catch (err) {
            console.error("Failed to update purchase, reverting:", err);
            // 3. Revert to original state on error
            setPurchases((prev: PurchaseType[]) => {
                const itemExists = prev.find(p => p._id === originalPurchase._id);
                if (!itemExists && originalPurchase.status !== "viewed") {
                    // Re-add if it was optimistically removed
                    return [...prev, originalPurchase];
                }
                return prev.map(p => p._id === originalPurchase._id ? originalPurchase : p);
            });
        }
    };

const getSpecImage = (product: any, specIdObj: any) => {
    let imgUri = product?.thumbNail || product?.productThumb || "/icons/shopping-bag-black.png";
    if (!product || !product.images || !product.specifications || !specIdObj) return imgUri;
    
    const specId = typeof specIdObj === 'string' ? specIdObj : specIdObj._id;
    const specObj = product.specifications.find((s: any) => s._id === specId);
    
    if (!specObj) return imgUri;

    const normalizeHex = (h?: string | null) => {
        if (!h) return '';
        let v = h.trim().toLowerCase();
        return (v.length === 4 && v.startsWith('#')) ? `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}` : v;
    };
    
    const specHex = normalizeHex(specObj.colorHex);
    const specColor = specObj.color?.trim().toLowerCase();

    const matchingImg = product.images.find((img: any) => {
        const imgSpecId = typeof img.specification === 'string' ? img.specification : img.specification?._id;
        if (imgSpecId === specId) return true;
        
        const imgSpecObj = imgSpecId ? product.specifications.find((s: any) => s._id === imgSpecId) : null;
        const imgColorHex = normalizeHex(imgSpecObj?.colorHex || img.specification?.colorHex);
        const imgColorName = (imgSpecObj?.color || img.specification?.color)?.trim().toLowerCase();
        
        if (specHex && imgColorHex && specHex === imgColorHex) return true;
        if (specColor && imgColorName && specColor === imgColorName) return true;
        return false;
    });

    if (matchingImg?.uri) return matchingImg.uri;
    return imgUri;
};

    if (!purchase_ || !purchase) return null;

    return (
        <div
            className='group flex gap-3 p-3 rounded-xl border transition-all hover:border-gray-400 bg-white cursor-pointer'
            style={{
                borderColor: colors.light[200],
                backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.02)' : '#fff'
            }}
            onClick={() => {
                const pId = purchase?.product?._id || purchase?.productId;
                if (!pId) return;

                localStorage.setItem('purchaseId', purchase?._id ?? "");
                // @ts-ignore
                router.push(`/product/${pId}?fromCart=true`);
                setIsActive(false);
            }}
        >
            {/* Thumbnail */}
            <div className="w-22 h-22 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border" style={{ borderColor: colors.light[200] }}>
                <img
                    //@ts-ignore
                    src={getSpecImage(purchase.product, purchase.specification)}
                    alt="product"
                    className='w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-300'
                />
            </div>

            {/* Info & Controls */}
            <div className='flex-1 flex flex-col justify-between py-1'>
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <h3 className=' flex flex-1 text-[13px] font-bold leading-tight line-clamp-2'>
                            {purchase.isCustomized && <span className="text-purple-600 mr-1" style={{ color: '#9333ea' }}>🪄 DIY - </span>}
                            {
                                // @ts-ignore
                                purchase.product?.name?.[activeLanguage.language] || purchase.productName?.[activeLanguage.language] || "Deleted Product"
                            }
                        </h3>
                        {/* Remove Icon */}
                        <button
                            className='w-4 h-4 opacity-50 hover:opacity-100 transition-opacity'
                            onClick={(e) => {
                                e.stopPropagation();
                                updatePurchaseData({ ...purchase, cart: null, status: "viewed" });
                            }}
                        >
                            <img src="/icons/trash.png" className="w-full h-full" alt="remove" />
                        </button>
                    </div>

                    <div className='flex flex-wrap gap-2 mt-2 opacity-60 text-[10px] uppercase font-medium tracking-wide'>
                        {/* @ts-ignore */}
                        {purchase?.specification?.color && <span>{purchase?.specification.color}</span>}
                        {/* @ts-ignore */}
                        {purchase?.specification?.size && <span className="border-l pl-2" style={{ borderColor: colors.dark[200] }}>{purchase?.specification.size}</span>}
                        {/* @ts-ignore */}
                        {purchase?.specification?.type && <span className="border-l pl-2" style={{ borderColor: colors.dark[200] }}>{purchase?.specification.type}</span>}
                        {purchase.isCustomized && purchase.customizedCharms && purchase.customizedCharms.length > 0 && (
                            <span className="border-l pl-2 font-bold" style={{ borderColor: colors.dark[200], color: '#9333ea' }}>
                                +{purchase.customizedCharms.length} {activeLanguage.language === 'en' ? 'Charms' : 'Charmes'}
                            </span>
                        )}
                    </div>
                </div>

                <div className='flex justify-between items-end mt-2'>
                    <div className='flex items-center border rounded-xl h-7' style={{ borderColor: colors.light[300] }}>
                        <button
                            className='w-7 h-full rounded-full flex items-center justify-center hover:bg-black/5'
                            onClick={(e) => {
                                e.stopPropagation();
                                if ((purchase?.quantity || 0) <= 1) return;
                                updatePurchaseData({ ...purchase, quantity: (purchase?.quantity || 0) - 1 });
                            }}
                        >
                            <img src={activeTheme == "dark" ? "/icons/minus-light.png" : "/icons/minus-dark.png"} className='w-2 h-2 opacity-60' alt="-" />
                        </button>
                        <span className='px-2 text-xs font-bold w-6 text-center'>{purchase?.quantity}</span>
                        <button
                            className='w-7 rounded-full h-full flex items-center justify-center hover:bg-black/5'
                            onClick={(e) => {
                                e.stopPropagation();
                                // @ts-ignore
                                if (!purchase?.specification?.unlimited && (purchase?.quantity || 0) >= (purchase?.specification?.quantity || 100)) return;
                                updatePurchaseData({ ...purchase, quantity: (purchase?.quantity || 0) + 1 });
                            }}
                        >
                            <img src={activeTheme == "dark" ? "/icons/add-white.png" : "/icons/add-black.png"} className='w-2 h-2 opacity-60' alt="+" />
                        </button>
                    </div>

                    <p className='text-sm font-bold' style={{ color: colors.dark[100] }}>
                        {(() => {
                            const basePrice = (purchase?.specification as any)?.price || purchase?.specPrice || 0;
                            const charmsPrice = purchase?.customizedCharms?.reduce((acc, pc) => {
                                const charmPrice = (pc.spec as any)?.price || (pc.charm as any)?.price || (pc.charm as any)?.specifications?.[0]?.price || 0;
                                return acc + charmPrice;
                            }, 0) || 0;
                            return ((basePrice + charmsPrice) * (purchase?.quantity || 1)).toFixed(2);
                        })()} <span className="text-[10px] font-normal">T.D</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PurchaseItem;