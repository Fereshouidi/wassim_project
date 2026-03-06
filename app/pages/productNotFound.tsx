'use client';
import React from 'react';
import { useTheme } from '@/contexts/themeProvider';
import { useLanguage } from '@/contexts/languageContext';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Search } from 'lucide-react';

const ProductNotFound = () => {
    const { colors, activeTheme } = useTheme();
    const { activeLanguage } = useLanguage();
    const isDark = activeTheme === 'dark';

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-6 transition-colors duration-300"
            style={{
                backgroundColor: colors.light[100],
                color: colors.dark[200]
            }}
        >
            {/* Visual icon with background effect */}
            <div className="relative mb-8">
                <div
                    className="absolute inset-0 scale-150 blur-3xl opacity-20 rounded-full"
                    style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}
                />
                <div
                    className="relative w-24 h-24 rounded-3xl flex items-center justify-center border shadow-xl"
                    style={{
                        backgroundColor: colors.light[200],
                        borderColor: colors.light[250]
                    }}
                >
                    <Search size={40} strokeWidth={1.5} className="opacity-40" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                        !
                    </div>
                </div>
            </div>

            {/* Page content */}
            <div className="text-center max-w-md">
                <h1 className="text-2xl font-black uppercase tracking-[0.15em] mb-3">
                    {activeLanguage.productNotFound}
                </h1>
                <p className="text-sm opacity-60 leading-relaxed mb-10">
                    {activeLanguage.productNotFoundDesc}
                </p>

                {/* Back options */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-md"
                        style={{
                            backgroundColor: colors.dark[100],
                            color: colors.light[100]
                        }}
                    >
                        <ShoppingBag size={16} />
                        {activeLanguage.continueShopping}
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest border transition-all hover:bg-current/5 active:scale-95"
                        style={{ borderColor: colors.light[250] }}
                    >
                        <ArrowLeft size={16} />
                        {activeLanguage.goBack}
                    </button>
                </div>
            </div>

            {/* Bottom decorative touch */}
            <div className="mt-20 opacity-10 font-black text-[60px] select-none uppercase tracking-[0.5em] pointer-events-none">
                404
            </div>
        </div>
    );
};

export default ProductNotFound;