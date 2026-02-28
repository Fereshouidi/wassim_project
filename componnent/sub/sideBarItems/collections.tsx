import { backEndUrl } from '@/api';
import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider';
import { CollectionType } from '@/types';
import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useRouter } from 'next/navigation';
import { useLoadingScreen } from '@/contexts/loadingScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { useScreen } from '@/contexts/screenProvider';

type ExtendedCollection = CollectionType & { hasChildren?: boolean };

type NavLevel = {
    id: string;
    name: Record<string, string | null>;
    items: ExtendedCollection[];
    parentIds: string[]; // Track path for cumulative search
};

type props = {
    sideBarActive: boolean
}

const Collections = ({ sideBarActive }: props) => {
    const { activeLanguage } = useLanguage();
    const { activeTheme, colors } = useTheme();
    const { screenWidth } = useScreen();
    const [loading, setLoading] = useState<boolean>(false);
    const [panelVisible, setPanelVisible] = useState<boolean>(false);
    const [navStack, setNavStack] = useState<NavLevel[]>([]);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const router = useRouter();
    const { setLoadingScreen } = useLoadingScreen();

    const currentLevel = useMemo(() => navStack[navStack.length - 1], [navStack]);

    const isMobile = screenWidth < 640;

    const getRootCollections = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${backEndUrl}/getCollectionsInSideBar`);
            const rootLevel: NavLevel = {
                id: 'root',
                name: { en: 'Collections', fr: 'Collections' },
                items: data.collections,
                parentIds: []
            };
            setNavStack([rootLevel]);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleArrowClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!panelVisible) {
            getRootCollections();
        }
        setPanelVisible(!panelVisible);
    };

    const handleLevelUp = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (navStack.length > 1) {
            setNavStack(prev => prev.slice(0, -1));
        } else {
            setPanelVisible(false);
        }
    };

    const fetchSubCollections = async (collection: ExtendedCollection) => {
        if (loadingId) return;
        setLoadingId(collection._id!);
        try {
            const currentParentIds = currentLevel.id === 'root' ? [] : [...currentLevel.parentIds, currentLevel.id];
            const { data } = await axios.get(`${backEndUrl}/getSubCollections`, {
                params: {
                    parentId: collection._id,
                    excludeIds: [...currentParentIds, collection._id]
                }
            });

            const newLevel: NavLevel = {
                id: collection._id!,
                name: collection.name as Record<string, string | null>,
                items: data.collections,
                parentIds: [...currentParentIds, collection._id!]
            };
            setNavStack(prev => [...prev, newLevel]);
        } catch (err) {
            console.error(err);
        }
        setLoadingId(null);
    };

    const handleNavigate = (collection: ExtendedCollection) => {
        setLoadingScreen(true);
        const currentParentIds = currentLevel.id === 'root' ? [] : currentLevel.parentIds;
        const path = [...currentParentIds, currentLevel.id !== 'root' ? currentLevel.id : '', collection._id].filter(Boolean);

        const filtration: any = {
            price: { from: 0, to: 10000 },
            collections: path,
            colors: ["all"],
            types: ["all"],
            sizes: ["all"],
            sortBy: "date",
            sortDirection: "asc",
            activeLanguage: activeLanguage.language
        };
        router.push(`/search?filter=${encodeURIComponent(JSON.stringify(filtration))}`);
    };

    useEffect(() => {
        if (!sideBarActive) {
            setPanelVisible(false);
            setNavStack([]);
        }
    }, [sideBarActive]);

    return (
        <div className="w-full h-full relative flex items-center justify-between">
            {/* Root Label */}
            <div
                className="flex-1 h-full flex items-center text-[13px] sm:text-sm font-normal cursor-pointer"
                style={{ color: colors.light[200] }}
                onClick={() => {
                    setLoadingScreen(true);
                    router.push('/search');
                }}
            >
                {activeLanguage.nav.collections}
            </div>

            {/* Root Arrow */}
            <div
                onClick={handleArrowClick}
                className={`p-1.5 -mr-2 rounded-full transition-all active:scale-90 ${activeTheme === 'dark' ? 'hover:bg-black/5' : 'hover:bg-white/5'}`}
            >
                {loading && navStack.length === 0 ? (
                    <div className="w-3 h-3" style={{ filter: activeTheme === 'light' ? 'invert(1)' : 'none' }}>
                        <DotLottieReact
                            src="/icons/LoadingDotsBlack.json"
                            loop
                            autoplay
                        />
                    </div>
                ) : (
                    <img
                        src={activeTheme === "dark" ? "/icons/right-arrow-black.png" : "/icons/right-arrow-white.png"}
                        className={`w-3 h-3 transition-transform duration-300 ${panelVisible ? 'rotate-180' : ''}`}
                        alt="expand"
                    />
                )}
            </div>

            {/* Drill-Down Panel */}
            <AnimatePresence>
                {panelVisible && currentLevel && (
                    <motion.div
                        initial={{ opacity: 0, x: isMobile ? 0 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isMobile ? 0 : -20 }}
                        className="fixed top-0 h-dvh border-l z-[999] flex flex-col overflow-hidden transition-all"
                        style={{
                            left: isMobile ? '0' : '320px',
                            width: isMobile ? '320px' : '300px',
                            backgroundColor: colors.dark[100],
                            borderColor: colors.dark[300],
                            boxShadow: isMobile ? 'none' : '20px 0 40px rgba(0,0,0,0.3)'
                        }}
                    >
                        {/* Header with Back/Close Button */}
                        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: colors.dark[300] }}>
                            <div className="flex items-center gap-3">
                                <div
                                    onClick={handleLevelUp}
                                    className={`p-2 rounded-full cursor-pointer transition-all ${activeTheme === 'dark' ? 'hover:bg-black/10' : 'hover:bg-white/10'}`}
                                >
                                    <img
                                        src={activeTheme === "dark" ? "/icons/right-arrow-black.png" : "/icons/right-arrow-white.png"}
                                        className="w-3 h-3 rotate-180"
                                        alt="back"
                                    />
                                </div>
                                <h3 className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: colors.light[200] }}>
                                    {navStack.length > 1 ? currentLevel.name[activeLanguage.language] : activeLanguage.nav.collections}
                                </h3>
                            </div>

                            {isMobile && (
                                <div
                                    onClick={() => setPanelVisible(false)}
                                    className="text-[10px] uppercase opacity-60 font-bold px-2 py-1"
                                    style={{ color: colors.light[200] }}
                                >
                                    {activeLanguage.close}
                                </div>
                            )}
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 scrollbar-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentLevel.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col gap-1"
                                >
                                    {currentLevel.items.map((col) => (
                                        <div
                                            key={col._id}
                                            className={`flex items-center justify-between py-3 px-3 rounded-lg transition-colors cursor-pointer ${activeTheme === 'dark' ? 'hover:bg-black/5' : 'hover:bg-white/5'}`}
                                            onClick={() => handleNavigate(col)}
                                        >
                                            <span className="text-[13px] font-medium" style={{ color: colors.light[200] }}>
                                                {col.name[activeLanguage.language] || ""}
                                            </span>

                                            {col.hasChildren && (
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        fetchSubCollections(col);
                                                    }}
                                                    className="p-1.5 rounded-full transition-all active:scale-95"
                                                >
                                                    {loadingId === col._id ? (
                                                        <div className="w-3.5 h-3.5" style={{ filter: activeTheme === 'light' ? 'invert(1)' : 'none' }}>
                                                            <DotLottieReact
                                                                src="/icons/LoadingDotsBlack.json"
                                                                loop
                                                                autoplay
                                                            />
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={activeTheme === "dark" ? "/icons/right-arrow-black.png" : "/icons/right-arrow-white.png"}
                                                            className="w-3 h-3 opacity-60"
                                                            alt="next"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {currentLevel.items.length === 0 && !loading && (
                                        <div className="py-10 text-center opacity-40 text-[12px]" style={{ color: colors.light[200] }}>
                                            No sub-collections found
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Collections;
