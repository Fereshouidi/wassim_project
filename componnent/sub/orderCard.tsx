import { useLanguage } from '@/contexts/languageContext'
import { useLoadingScreen } from '@/contexts/loadingScreen'
import { useOwner } from '@/contexts/ownerInfo'
import { useTheme } from '@/contexts/themeProvider'
import { calcTotalPrice, timeAgo } from '@/lib'
import { OrderType, EvaluationType } from '@/types'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import PurshasesTable from './purshasesTable'
import MoreDetailsTable from './moreDetailsTable'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { backEndUrl } from '@/api'
import { useClient } from '@/contexts/client'
import ProductRatingForm from './ProductRatingForm'

type Props = {
    order: OrderType;
    cardOpenedByDefault: boolean,
}


const OrderCard = ({
    order,
    cardOpenedByDefault,
}: Props) => {
    const { colors, activeTheme } = useTheme();
    const { activeLanguage } = useLanguage();
    const { client } = useClient();
    const [cardOpened, setCardOpened] = useState<boolean>(false);
    const [ratedPurchaseIds, setRatedPurchaseIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        setCardOpened(cardOpenedByDefault)
    }, [cardOpenedByDefault])

    const handleRated = useCallback((purchaseId: string) => {
        setRatedPurchaseIds(prev => new Set([...prev, purchaseId]));
    }, []);

    const statusConfig = {
        pending: { label: activeLanguage.pending, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
        delivered: { label: activeLanguage.delivered, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
        failed: { label: activeLanguage.failed, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    };

    const currentStatus = order.status || 'pending';
    const total = useMemo(() => calcTotalPrice(order), [order]);

    // Only show ratable purchases for delivered orders (those with a real product id)
    const ratablePurchases = useMemo(() => {
        if (currentStatus !== 'delivered') return [];
        return (order.purchases ?? []).filter(p => {
            const pId = (p.product as any)?._id || p.productId;
            return !!pId && !p.isCustomized;
        });
    }, [order.purchases, currentStatus]);

    return (
        <div
            className='w-full flex flex-col gap-2 sm:gap-4 rounded-lg- sm:rounded-lg p-2.5 sm:p-4 transition-all duration-300'
            style={{
                backgroundColor: colors.light[100],
                border: `1px solid ${cardOpened ? colors.light[350] : colors.light[250]}`,
                boxShadow: cardOpened ? `0 10px 40px ${activeTheme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}` : 'none'
            }}
        >
            {/* Collapsed Header */}
            <div
                className='w-full flex flex-row justify-between items-center cursor-pointer group gap-2'
                onClick={() => setCardOpened(!cardOpened)}
            >
                <div className='flex flex-row items-center gap-2 sm:gap-4 min-w-0'>
                    {/* Thumbnails */}
                    <div className='flex items-center flex-shrink-0'>
                        {order.purchases?.slice(0, 3).map((purchase, i) => (
                            <div
                                key={purchase._id}
                                className='w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2  overflow-hidden bg-white shadow-sm'
                                style={{
                                    borderColor: colors.light[100],
                                    marginLeft: i > 0 ? '-10px' : '0',
                                    zIndex: 5 - i
                                }}
                            >
                                <img
                                    //@ts-ignore
                                    src={purchase.product?.thumbNail || purchase.productThumb || "/icons/shopping-bag-black.png"}
                                    alt="product"
                                    className='w-full h-full object-cover'
                                />
                            </div>
                        ))}
                    </div>

                    <div className='flex flex-col gap-0.5 min-w-0'>
                        <div className='flex items-center gap-1 sm:gap-1.5'>
                            <span className='text-[7px] sm:text-[10px] uppercase font-bold tracking-widest opacity-40 leading-none truncate'>{activeLanguage.orderNum}</span>
                            <span className='text-[9px] sm:text-xs font-bold leading-none' style={{ color: colors.dark[100] }}>#{order.orderNumber}</span>
                        </div>
                        <span className='text-[8px] sm:text-[10px] opacity-60 truncate'>
                            {order.createdAt && timeAgo(order.createdAt, activeLanguage.language)}
                        </span>
                    </div>
                </div>

                <div className='flex items-center gap-2 sm:gap-4 flex-shrink-0'>
                    <div className='flex flex-col items-end gap-0.5 sm:gap-1'>
                        <div
                            className='px-1 sm:px-2 py-0.5 rounded-full text-[7px] sm:text-[9px] font-bold uppercase tracking-wider'
                            style={{
                                color: statusConfig[currentStatus].color,
                                backgroundColor: statusConfig[currentStatus].bg
                            }}
                        >
                            {statusConfig[currentStatus].label}
                        </div>
                        <span className='text-[10px] sm:text-xs font-bold' style={{ color: colors.dark[100] }}>
                            {total} <span className='text-[8px] sm:text-[10px] opacity-50 font-normal'>D.T</span>
                        </span>
                    </div>

                    <motion.div
                        animate={{ rotate: cardOpened ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className='w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center rounded-full border opacity-40 group-hover:opacity-100 transition-opacity'
                        style={{ borderColor: colors.light[350] }}
                    >
                        <span className='text-[8px] sm:text-xs'>↓</span>
                    </motion.div>
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {cardOpened && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className='overflow-hidden'
                    >
                        <div className='pt-2 sm:pt-4 flex flex-col gap-3 sm:gap-6 border-t mt-1.5 sm:mt-2' style={{ borderColor: colors.light[250] }}>
                            <PurshasesTable
                                purchases={order.purchases ?? []}
                                order={order}
                            />

                            <MoreDetailsTable
                                order={order}
                            />

                            {/* ── Rate Products Section (delivered orders only) ── */}
                            {ratablePurchases.length > 0 && client?._id && (
                                <div
                                    className="rounded-xl- overflow-hidden"
                                    style={{ border: `0.5px solid ${colors.light[300]}` }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Section header */}
                                    <div
                                        className="flex items-center gap-2 px-4 py-3"
                                        style={{ backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderBottom: `0.1px solid ${colors.light[300]}` }}
                                    >
                                        <span className="text-lg leading-none">⭐</span>
                                        <div>
                                            <p className="text-[12px] font-bold" style={{ color: colors.dark[100] }}>
                                                {activeLanguage.language === 'fr' ? 'Évaluez vos produits' : 'Rate your products'}
                                            </p>
                                            <p className="text-[10px] opacity-50">
                                                {activeLanguage.language === 'fr'
                                                    ? 'Partagez votre avis sur les articles reçus'
                                                    : 'Share your opinion on the items you received'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Per-product rating rows */}
                                    <div className="flex flex-col divide-y p-0">
                                        {ratablePurchases.map((purchase, idx) => {
                                            const productId = (purchase.product as any)?._id || purchase.productId || '';
                                            const purchaseId = purchase._id || `${productId}-${idx}`;
                                            const productName = purchase.product
                                                ? (purchase.product as any).name?.[activeLanguage.language] || (purchase.product as any).name?.en || 'Product'
                                                : purchase.productName?.[activeLanguage.language] || 'Product';
                                            const thumb = (purchase.product as any)?.thumbNail || purchase.productThumb || '/icons/shopping-bag-black.png';

                                            if (ratedPurchaseIds.has(purchaseId)) {
                                                return (
                                                    <div key={purchaseId} className="flex items-center justify-between px-4 py-3">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 ">
                                                                <img src={thumb} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="text-[11px] opacity-70 truncate max-w-[120px]">{productName + "fffffffffffffffff"}</span>
                                                        </div>
                                                        <div
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                                                            style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: '#10b981' }}
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                            {activeLanguage.language === 'fr' ? 'Noté' : 'Rated'}
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div key={purchaseId} className="px-4 py-3" style={{ borderBottom: `0.1px solid ${colors.light[250]}` }}>
                                                    <ProductRatingForm
                                                        purchaseId={purchaseId}
                                                        productId={productId}
                                                        productName={productName}
                                                        thumb={thumb}
                                                        clientId={client._id!}
                                                        colors={colors}
                                                        activeTheme={activeTheme}
                                                        activeLanguage={activeLanguage}
                                                        onDone={handleRated}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default OrderCard;
