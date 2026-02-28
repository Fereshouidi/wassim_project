import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { OrderType } from '@/types';
import React, { useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useLanguage } from '@/contexts/languageContext';
import { motion } from 'framer-motion';

type props = {
    orders: OrderType[]
    activePage: "pending" | "failed" | "delivered"
    setActivePage: (value: "pending" | "failed" | "delivered") => void
    ordersCount: number
    totalOrdersCount: number
    limit: number,
    skip: number
    getMore: () => void
    getLess: () => void
}

const OrdersSectionHeader = ({
    activePage,
    setActivePage,
    totalOrdersCount,
    limit,
    skip,
    getMore,
    getLess
}: props) => {

    const { screenWidth } = useScreen();
    const { activeTheme, colors } = useTheme();
    const { activeLanguage } = useLanguage();

    // The skip prop represents the next page's offset, so we subtract limit to get current page offset
    const currentOffset = Math.max(0, skip - limit);
    const currentPage = Math.floor(currentOffset / limit) + 1;
    const totalPages = Math.ceil(totalOrdersCount / limit) || 1;

    const [loadingRightArrow, setLoadingRightArrow] = useState<boolean>(false);

    const handleLeftArrowClick = async () => {
        if (currentPage <= 1) return;
        await getLess();
    }

    const handleRightArrowClick = async () => {
        if (currentPage >= totalPages) return;
        setLoadingRightArrow(true);
        await getMore();
        setLoadingRightArrow(false);
    }

    const tabs = [
        { id: "pending", label: activeLanguage.pending, iconWhite: "/icons/pendingWhite.png", iconBlack: "/icons/pendingBlack.png" },
        { id: "failed", label: activeLanguage.failed, iconWhite: "/icons/closeWhite.png", iconBlack: "/icons/closeBlack.png" },
        { id: "delivered", label: activeLanguage.delivered, iconWhite: "/icons/checkWhite.png", iconBlack: "/icons/checkBlack.png" },
    ] as const;

    const renderTabs = () => (
        <div
            className='flex items-center p-1 rounded-xl shadow-inner border'
            style={{
                backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                borderColor: colors.light[250]
            }}
        >
            {tabs.map((tab) => {
                const isActive = activePage === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActivePage(tab.id as any)}
                        className={`relative flex items-center justify-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider transition-all duration-500`}
                        style={{
                            color: isActive ? colors.light[100] : colors.dark[400],
                            flex: screenWidth < 500 ? 1 : 'none'
                        }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeTabGlow"
                                className="absolute inset-0 rounded-lg sm:rounded-xl shadow-lg"
                                style={{
                                    backgroundColor: colors.dark[100],
                                    boxShadow: activeTheme === 'dark' ? '0 2px 10px rgba(255,255,255,0.05)' : '0 2px 10px rgba(0,0,0,0.1)'
                                }}
                                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                            />
                        )}
                        <img
                            src={activeTheme === "dark" || isActive ? tab.iconWhite : tab.iconBlack}
                            className='w-3 sm:w-3.5 h-3 sm:h-3.5 relative z-10'
                            alt=""
                        />
                        <span className='relative z-10'>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );

    const renderPagination = () => (
        <div
            className='flex items-center gap-1 p-1 rounded-xl border'
            style={{
                backgroundColor: colors.light[100],
                borderColor: colors.light[250],
            }}
        >
            <button
                onClick={handleLeftArrowClick}
                disabled={currentPage <= 1}
                className='w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl hover:bg-black hover:bg-opacity-5 transition-all active:scale-90 disabled:opacity-20'
            >
                <img
                    src={activeTheme === "dark" ? "/icons/left-arrow-white.png" : "/icons/left-arrow-black.png"}
                    className='w-2.5 sm:w-3.5 h-2.5 sm:h-3.5'
                    alt="prev"
                />
            </button>

            <div
                className='flex flex-col items-center justify-center px-2 sm:px-4 h-7 sm:h-9 rounded-lg sm:rounded-xl border border-dashed'
                style={{ borderColor: colors.light[350] }}
            >
                <div className='flex items-baseline gap-1'>
                    <span className='text-[10px] sm:text-xs font-semibold' style={{ color: colors.dark[100] }}>{currentPage}</span>
                    <span className='text-[8px] sm:text-[10px] opacity-30 font-semibold'>OF</span>
                    <span className='text-[10px] sm:text-xs font-semibold' style={{ color: colors.dark[100] }}>{totalPages}</span>
                </div>
            </div>

            <button
                onClick={handleRightArrowClick}
                disabled={currentPage >= totalPages || loadingRightArrow}
                className='w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl hover:bg-black hover:bg-opacity-5 transition-all active:scale-90 disabled:opacity-20'
            >
                {loadingRightArrow ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <LoaderIcon className='w-3 h-3 sm:w-4 sm:h-4 opacity-50' />
                    </motion.div>
                ) : (
                    <img
                        src={activeTheme === "dark" ? "/icons/right-arrow-white.png" : "/icons/right-arrow-black.png"}
                        className='w-2.5 sm:w-3.5 h-2.5 sm:h-3.5'
                        alt="next"
                    />
                )}
            </button>
        </div>
    );

    return (
        <div className={`w-full flex-col flex ${screenWidth < 1100 ? 'gap-3 sm:gap-6' : 'gap-8'} p-4 sm:p-8`}>
            {/* Upper Row: Title and Stats */}
            <div className='flex flex-row justify-between items-end'>
                <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-2 sm:gap-3'>
                        <div className='w-1.5 h-6 sm:w-2 sm:h-8 rounded-full' style={{ backgroundColor: colors.dark[100] }} />
                        <h1 className='text-lg sm:text-2xl font-semibold tracking-tighter leading-none' style={{ color: colors.dark[100] }}>
                            {activePage === "pending" ? activeLanguage.pendingOrders
                                : activePage === "failed" ? activeLanguage.failedgOrders
                                    : activeLanguage.deliveredOrders}
                        </h1>
                    </div>
                    <div className='flex items-center gap-1.5 sm:gap-2 pl-4 sm:pl-5'>
                        <span className='flex h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full animate-pulse' style={{ backgroundColor: colors.dark[300] }} />
                        <p className='text-[9px] sm:text-[11px] uppercase font-semibold tracking-widest opacity-40'>
                            {totalOrdersCount} orders total
                        </p>
                    </div>
                </div>

                {screenWidth > 800 && renderPagination()}
            </div>

            {/* Lower Row: Switcher and Search/Filters (Could be added later) */}
            <div className={`flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 border-t pt-4 sm:pt-8`} style={{ borderColor: colors.light[250] }}>
                {renderTabs()}
                {screenWidth <= 800 && (
                    <div className='w-full flex justify-end'>
                        {renderPagination()}
                    </div>
                )}
            </div>
        </div>
    );
};

// Simple Loader Icon since we need it
const LoaderIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

export default OrdersSectionHeader;
