import { useLanguage } from '@/contexts/languageContext'
import { useLoadingScreen } from '@/contexts/loadingScreen'
import { useOwner } from '@/contexts/ownerInfo'
import { useTheme } from '@/contexts/themeProvider'
import { calcTotalPrice, timeAgo } from '@/lib'
import { OrderType } from '@/types'
import React, { useEffect, useState, useMemo } from 'react'
import PurshasesTable from './purshasesTable'
import MoreDetailsTable from './moreDetailsTable'
import { motion, AnimatePresence } from 'framer-motion'

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
    const [cardOpened, setCardOpened] = useState<boolean>(false);

    useEffect(() => {
        setCardOpened(cardOpenedByDefault)
    }, [cardOpenedByDefault])

    const statusConfig = {
        pending: { label: activeLanguage.pending, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
        delivered: { label: activeLanguage.delivered, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
        failed: { label: activeLanguage.failed, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    };

    const currentStatus = order.status || 'pending';
    const total = useMemo(() => calcTotalPrice(order), [order]);

    return (
        <div
            className='w-full flex flex-col gap-2 sm:gap-4 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 transition-all duration-300'
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
                                className='w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 overflow-hidden bg-white shadow-sm'
                                style={{
                                    borderColor: colors.light[100],
                                    marginLeft: i > 0 ? '-10px' : '0',
                                    zIndex: 5 - i
                                }}
                            >
                                <img
                                    //@ts-ignore
                                    src={purchase.product?.thumbNail ?? ""}
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default OrderCard;
