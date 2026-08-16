"use client";
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { useTheme } from '@/contexts/themeProvider';
import { useLanguage } from '@/contexts/languageContext';
import { useScreen } from '@/contexts/screenProvider';
import { headerHeight } from '@/constent';
import { backEndUrl } from '@/api';
import axios from 'axios';
import { Trash2, ShoppingBag, Sparkles, Move, RotateCcw, GripVertical, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { ProductSpecification } from '@/types';
import SpecificationsSlider from '@/componnent/sub/specificationsSlider';
import { useClient } from '@/contexts/client';
import { useCartSide } from '@/contexts/cart';
import { useRegisterSection } from '@/contexts/registerSec';
import { useStatusBanner } from '@/contexts/StatusBanner';
import { useLoadingScreen } from '@/contexts/loadingScreen';
/* ─── Data ─────────────────────────────────── */

/* ─── Types ──────────────────────────────────── */

interface CustomizableBase {
    id: string;
    name: { en: string; fr: string };
    price: number;
    chainColor: string;
    chainHighlight: string;
    thumbNail?: string;
    specifications: ProductSpecification[];
    images: { uri: string; specification: any }[];
}

interface CustomizableCharm {
    id: string;
    name: { en: string; fr: string };
    price: number;
    color: string;
    thumbNail?: string;
    emoji?: string;
    specifications: ProductSpecification[];
    images: { uri: string; specification: any }[];
}

// Preset positions along the necklace SVG path curve
const NECKLACE_POSITIONS = [
    { x: 50, y: 88 },
    { x: 35, y: 75 },
    { x: 65, y: 75 },
    { x: 22, y: 55 },
    { x: 78, y: 55 },
    { x: 17, y: 38 },
    { x: 83, y: 38 },
    { x: 43, y: 82 },
    { x: 57, y: 82 },
    { x: 28, y: 65 },
    { x: 72, y: 65 },
    { x: 50, y: 84 },
];

interface PlacedCharm {
    instanceId: string;
    charmId: string;
    specId?: string; // selected specification ID
    x: number;
    y: number;
    posVersion: number;
}

/* ─── Spec Selector Component ────────────────── */



/* ─── SVG Necklace ───────────────────────────── */

const NecklaceSVG = ({ chainColor, chainHighlight }: { chainColor: string; chainHighlight: string }) => (
    <svg viewBox="0 0 400 420" className="w-full h-full select-none pointer-events-none" style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.15))' }}>
        <defs>
            <linearGradient id="chainGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={chainHighlight} />
                <stop offset="50%" stopColor={chainColor} />
                <stop offset="100%" stopColor={chainHighlight} />
            </linearGradient>
        </defs>
        <path
            d="M 90 40 Q 60 40, 50 70 Q 30 130, 60 200 Q 80 250, 130 310 Q 170 355, 200 370 Q 230 355, 270 310 Q 320 250, 340 200 Q 370 130, 350 70 Q 340 40, 310 40"
            fill="none"
            stroke="url(#chainGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
        />
        <path
            d="M 90 40 Q 60 40, 50 70 Q 30 130, 60 200 Q 80 250, 130 310 Q 170 355, 200 370 Q 230 355, 270 310 Q 320 250, 340 200 Q 370 130, 350 70 Q 340 40, 310 40"
            fill="none"
            stroke={chainColor}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.08"
        />
        <circle cx="90" cy="40" r="4.5" fill={chainColor} stroke={chainHighlight} strokeWidth="1.5" />
        <circle cx="310" cy="40" r="4.5" fill={chainColor} stroke={chainHighlight} strokeWidth="1.5" />
    </svg>
);

/* ─── Draggable Charm (on canvas) ────────────── */

const DraggableCharm = ({
    pc,
    charm,
    isSelected,
    isDark,
    necklaceRef,
    onSelect,
    onRemove,
    onUpdatePos,
}: {
    pc: PlacedCharm;
    charm: CustomizableCharm;
    isSelected: boolean;
    isDark: boolean;
    necklaceRef: React.RefObject<HTMLDivElement | null>;
    onSelect: () => void;
    onRemove: () => void;
    onUpdatePos: (x: number, y: number) => void;
}) => {
    const dragX = useMotionValue(0);
    const dragY = useMotionValue(0);

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            style={{ x: dragX, y: dragY }}
            onDragEnd={() => {
                if (!necklaceRef.current) return;
                const rect = necklaceRef.current.getBoundingClientRect();
                // Calculate new position as: current % + drag offset in %
                const offsetXPct = (dragX.get() / rect.width) * 100;
                const offsetYPct = (dragY.get() / rect.height) * 100;
                const newX = Math.max(5, Math.min(95, pc.x + offsetXPct));
                const newY = Math.max(5, Math.min(95, pc.y + offsetYPct));
                // Reset motion values BEFORE state update to avoid flash
                dragX.set(0);
                dragY.set(0);
                onUpdatePos(newX, newY);
            }}
            whileDrag={{ scale: 1.25, zIndex: 999 }}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute cursor-grab active:cursor-grabbing"
            layoutId={undefined}
        >
            {/* Selection ring */}
            {isSelected && (
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-[-10px] rounded-full pointer-events-none"
                    style={{ border: `2px dashed ${charm.color}`, boxShadow: `0 0 16px ${charm.color}30` }}
                />
            )}

            {/* Charm circle */}
            <div
                className="w-16 h-16 flex items-center justify-center select-none transition-all"
                style={{
                    filter: isSelected ? `drop-shadow(0 0 12px ${charm.color})` : 'none',
                }}
            >
                <div className="w-full h-full relative p-1">
                    {(() => {
                        // Priority: Spec image -> Base thumbnail -> Emoji
                        const spec = charm.specifications.find(s => s._id === pc.specId);
                        let displayImg = charm.thumbNail;

                        if (spec && charm.images?.length) {
                            const normalizeHex = (h?: string | null) => {
                                if (!h) return '';
                                let v = h.trim().toLowerCase();
                                return (v.length === 4 && v.startsWith('#')) ? `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}` : v;
                            };
                            const specHex = normalizeHex(spec.colorHex);
                            const specColor = spec.color?.trim().toLowerCase();

                            const matched = charm.images.find(img => {
                                const imgSpecId = typeof img.specification === 'string' ? img.specification : img.specification?._id;
                                if (imgSpecId === spec._id) return true;

                                const imgSpecObj = imgSpecId ? charm.specifications.find(s => s._id === imgSpecId) : null;

                                const imgColorHex = normalizeHex(imgSpecObj?.colorHex || img.specification?.colorHex);
                                const imgColorName = (imgSpecObj?.color || img.specification?.color)?.trim().toLowerCase();

                                if (specHex && imgColorHex && specHex === imgColorHex) return true;
                                if (specColor && imgColorName && specColor === imgColorName) return true;

                                return false;
                            });
                            if (matched) displayImg = matched.uri;
                        }

                        if (displayImg) {
                            return (
                                <div className="w-full h-full relative rounded-sm- overflow-hidden">
                                    <Image
                                        src={displayImg}
                                        alt=""
                                        fill
                                        className="object-contain pointer-events-none"
                                        sizes="50px"
                                    />
                                </div>
                            );
                        }

                        return (
                            <span className="text-xl pointer-events-none drop-shadow-sm flex items-center justify-center h-full w-full">
                                {charm.emoji}
                            </span>
                        );
                    })()}
                </div>
            </div>

            {/* Delete button */}
            <AnimatePresence>
                {isSelected && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.15 }}
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center pointer-events-auto shadow-lg bg-black text-white dark:bg-white dark:text-black"
                    >
                        <Trash2 size={11} />
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

/* ─── Main Component ─────────────────────────── */

const Customizer = () => {
    const { colors, activeTheme } = useTheme();
    const { activeLanguage } = useLanguage();
    const { screenWidth } = useScreen();

    const [placedCharms, setPlacedCharms] = useState<PlacedCharm[]>([]);
    const [selectedCharmId, setSelectedCharmId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'bases' | 'charms'>('bases');
    const [loading, setLoading] = useState(true);
    const [isDraggingFromMenu, setIsDraggingFromMenu] = useState(false);

    const { client } = useClient();
    const { setRegisterSectionExist } = useRegisterSection();
    const { setStatusBanner } = useStatusBanner();
    const { setLoadingScreen } = useLoadingScreen();
    const { setPurchases, cart, purchases, setIsActive } = useCartSide();

    // Dynamic Data States
    const [availableBases, setAvailableBases] = useState<CustomizableBase[]>([]);
    const [availableCharms, setAvailableCharms] = useState<CustomizableCharm[]>([]);
    const [selectedBase, setSelectedBase] = useState<CustomizableBase | null>(null);

    // Specification selections: { [productId]: ProductSpecification }
    const [selectedSpecs, setSelectedSpecs] = useState<Record<string, ProductSpecification>>({});

    // Neckless Canvas Reference
    const necklaceRef = useRef<HTMLDivElement>(null);

    // Fetch Custom Data from API
    React.useEffect(() => {
        const fetchCustomData = async () => {
            setLoading(true);
            setLoadingScreen(true);
            try {
                // Fetch Bases
                const basesRes = await axios.get(`${backEndUrl}/getCollectionsByCustomizableType`, { params: { type: 'base' } });
                const baseProducts: CustomizableBase[] = (basesRes.data.collections || []).flatMap((col: any) =>
                    (col.products || []).map((p: any) => ({
                        id: p._id,
                        name: p.name,
                        price: p.price,
                        thumbNail: p.thumbNail,
                        chainColor: p.specifications?.find((s: any) => (s.colorHex || s.color))?.colorHex || '#b0b0b0',
                        chainHighlight: '#e5e7eb',
                        specifications: p.specifications || [],
                        images: p.images || [],
                    }))
                );

                // Fetch Pendants
                const pendantsRes = await axios.get(`${backEndUrl}/getCollectionsByCustomizableType`, { params: { type: 'pendant' } });
                const pendantProducts: CustomizableCharm[] = (pendantsRes.data.collections || []).flatMap((col: any) =>
                    (col.products || []).map((p: any) => ({
                        id: p._id,
                        name: p.name,
                        price: p.price,
                        thumbNail: p.thumbNail,
                        color: p.specifications?.find((s: any) => (s.colorHex || s.color))?.colorHex || '#6366f1',
                        specifications: p.specifications || [],
                        images: p.images || [],
                    }))
                );

                // Auto-select first spec for each product
                const initialSpecs: Record<string, ProductSpecification> = {};
                [...baseProducts, ...pendantProducts].forEach(item => {
                    if (item.specifications.length > 0) {
                        initialSpecs[item.id] = item.specifications[0];
                    }
                });
                setSelectedSpecs(initialSpecs);

                setAvailableBases(baseProducts);
                setAvailableCharms(pendantProducts);
                if (baseProducts.length > 0) setSelectedBase(baseProducts[0]);

            } catch (err) {
                console.error("Error fetching customizer data:", err);
            } finally {
                setLoading(false);
                setLoadingScreen(false);
            }
        };
        fetchCustomData();
    }, []);

    const currentCharm = useCallback((id: string) =>
        availableCharms.find(c => c.id === id) || { id, emoji: '✨', name: { en: '?', fr: '?' }, price: 0, color: '#ccc' }
        , [availableCharms]);

    /* ── Actions ───────────────────────── */

    const handleSpecSelect = useCallback((productId: string, spec: ProductSpecification) => {
        setSelectedSpecs(prev => ({ ...prev, [productId]: spec }));
    }, []);

    // Helper to get current thumbnail for an item based on selected spec
    const getCurrentThumbnail = useCallback((item: CustomizableBase | CustomizableCharm, forcedSpecId?: string) => {
        const spec = forcedSpecId
            ? item.specifications.find(s => s._id === forcedSpecId)
            : selectedSpecs[item.id];

        if (!spec || !item.images?.length) return item.thumbNail;

        // Find image that belongs to this spec (matching by _id or colorHex)
        const normalizeHex = (h?: string | null) => {
            if (!h) return '';
            let v = h.trim().toLowerCase();
            return (v.length === 4 && v.startsWith('#')) ? `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}` : v;
        };
        const specHex = normalizeHex(spec.colorHex);
        const specColor = spec.color?.trim().toLowerCase();

        const matchedImage = item.images.find(img => {
            const imgSpecId = typeof img.specification === 'string' ? img.specification : img.specification?._id;
            if (imgSpecId === spec._id) return true;

            const imgSpecObj = imgSpecId ? item.specifications.find(s => s._id === imgSpecId) : null;

            const imgColorHex = normalizeHex(imgSpecObj?.colorHex || img.specification?.colorHex);
            const imgColorName = (imgSpecObj?.color || img.specification?.color)?.trim().toLowerCase();

            if (specHex && imgColorHex && specHex === imgColorHex) return true;
            if (specColor && imgColorName && specColor === imgColorName) return true;

            return false;
        });

        return matchedImage?.uri || item.thumbNail;
    }, [selectedSpecs]);

    // Get the effective price for an item (spec price overrides base price)
    const getEffectivePrice = useCallback((item: CustomizableBase | CustomizableCharm) => {
        const spec = selectedSpecs[item.id];
        return (spec?.price != null && spec.price > 0) ? spec.price : item.price;
    }, [selectedSpecs]);

    const addCharm = useCallback((charmId: string, xPct?: number, yPct?: number) => {
        setPlacedCharms(prev => {
            let x = xPct;
            let y = yPct;
            if (x === undefined || y === undefined) {
                const pos = NECKLACE_POSITIONS[prev.length % NECKLACE_POSITIONS.length];
                x = pos.x;
                y = pos.y;
            }
            return [...prev, {
                instanceId: Math.random().toString(36).substr(2, 9),
                charmId,
                specId: selectedSpecs[charmId]?._id || undefined,
                x,
                y,
                posVersion: 0,
            }];
        });
    }, [selectedSpecs]);

    const removeCharm = useCallback((id: string) => {
        setPlacedCharms(prev => prev.filter(c => c.instanceId !== id));
        setSelectedCharmId(prev => prev === id ? null : prev);
    }, []);

    const updateCharmPos = useCallback((id: string, x: number, y: number) => {
        setPlacedCharms(prev => prev.map(c =>
            c.instanceId === id ? { ...c, x, y, posVersion: c.posVersion + 1 } : c
        ));
    }, []);

    const clearAll = useCallback(() => {
        setPlacedCharms([]);
        setSelectedCharmId(null);
    }, []);

    const handleMenuDragEnd = useCallback((event: any, info: any, charmId: string) => {
        setIsDraggingFromMenu(false);
        if (!necklaceRef.current) return;
        const rect = necklaceRef.current.getBoundingClientRect();
        const { x, y } = info.point;
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            addCharm(charmId, ((x - rect.left) / rect.width) * 100, ((y - rect.top) / rect.height) * 100);
        }
    }, [addCharm]);

    const handleAddCustomPurchaseToCart = async () => {
        if (!client) {
            setRegisterSectionExist(true);
            return;
        }

        if (!selectedBase) {
            setStatusBanner(true, "Please select a base necklace first.");
            return;
        }

        // setLoadingScreen(true); // Removed for instant add-to-cart experience

        try {
            const formattedCharms = placedCharms.map(pc => ({
                charm: pc.charmId,
                charmId: pc.instanceId,
                spec: pc.specId || undefined,
                x: pc.x,
                y: pc.y
            }));

            const baseSpecId = selectedSpecs[selectedBase.id]?._id;

            const purchaseData: any = {
                product: selectedBase.id,
                specification: baseSpecId ? baseSpecId : selectedBase.specifications[0]?._id,
                quantity: 1,
                client: client._id,
                isCustomized: true,
                customizedCharms: formattedCharms,
                status: 'inCart',
                cart: cart?._id // Link to cart immediately in first call
            };

            const tempId = `temp-${Date.now()}`;
            const optimisticPurchase = {
                _id: tempId,
                product: {
                    ...selectedBase,
                    _id: selectedBase.id,
                    thumbNail: selectedBase.thumbNail
                },
                specification: selectedSpecs[selectedBase.id] || selectedBase.specifications[0],
                quantity: 1,
                status: 'inCart',
                isCustomized: true,
                customizedCharms: formattedCharms
            } as any;

            // Optimistically update the UI and open sidebar instantly
            setPurchases(prev => [...prev, optimisticPurchase]);
            setIsActive(true);

            // Sync with backend in the background
            const { data: addRes } = await axios.post(`${backEndUrl}/addPurchase`, { purchaseData, clientId: client._id });
            const targetPurchase = addRes?.populatedPurchase || addRes?.newPurchase || addRes?.purchase;

            if (targetPurchase) {
                setPurchases(prev => {
                    const filtered = prev.filter(p => p._id !== tempId);
                    return [...filtered, targetPurchase];
                });
            } else {
                // If failed, remove from UI and notify
                setPurchases(prev => prev.filter(p => p._id !== tempId));
                setStatusBanner(true, "Failed to add to cart.");
            }

        } catch (error) {
            console.error(error);
            setStatusBanner(true, "Failed to update cart.");
        } finally {
            // setLoadingScreen(false);
        }
    };

    /* ── Derived ───────────────────────── */

    const isMobile = screenWidth < 1024;
    const isDark = activeTheme === 'dark';

    const totalPrice = (selectedBase ? getEffectivePrice(selectedBase) : 0) + placedCharms.reduce((acc, pc) => {
        const charm = availableCharms.find(c => c.id === pc.charmId);
        return acc + (charm ? getEffectivePrice(charm) : 0);
    }, 0);

    /* ── Colors (shorthand) ────────────── */
    const bg1 = colors.light[150];
    const bg2 = colors.light[100];
    const bg3 = colors.light[200];
    const bgTab = colors.light[250];
    const txt1 = colors.dark[100];
    const txt2 = colors.dark[500];
    const txt3 = colors.dark[600];
    const border1 = colors.light[300];
    const border2 = colors.light[400];

    if (loading) {
        return null; // Let the global loading screen handle the UI while loading
    }

    return (
        <div
            className="w-full flex flex-col lg:flex-row relative"
            style={{ backgroundColor: bg1 }}
        >
            {/* ═══════════ SIDEBAR / CONTROLS ═══════════ */}
            <div
                className="w-full lg:w-[400px] lg:min-w-[400px] flex flex-col order-2 lg:order-1 lg:h-[calc(100vh-80px)] lg:sticky lg:top-20"
                style={{
                    backgroundColor: bg2,
                    borderRight: isMobile ? 'none' : `1px solid ${border1}`,
                    borderTop: isMobile ? `1px solid ${border1}` : 'none',
                    zIndex: 40,
                }}
            >
                {/* Title */}
                <div className="px-6 pt-6 lg:pt-8 pb-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-sm- flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: colors.dark[100] }}>
                            <Sparkles size={18} color={colors.light[100]} />
                        </div>
                        <div>
                            <h1 className="text-lg lg:text-xl font-bold tracking-tight" style={{ color: txt1 }}>
                                {activeLanguage.nav.makeYourOwn}
                            </h1>
                            <p className="text-[11px]" style={{ color: txt3 }}>
                                {activeLanguage.language === 'en' ? 'Design your unique piece' : 'Créez votre pièce unique'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex px-6 gap-1 pb-4 flex-shrink-0 sticky top-0 lg:relative z-50 py-2 lg:py-0-" style={{ backgroundColor: bg2 }}>
                    {(['bases', 'charms'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="flex-1 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-sm- transition-all"
                            style={{
                                color: activeTab === tab ? txt1 : txt3,
                                backgroundColor: activeTab === tab ? bgTab : 'transparent',
                                border: activeTab === tab ? `1px solid ${border1}` : '1px solid transparent',
                            }}
                        >
                            {tab === 'bases'
                                ? (activeLanguage.language === 'en' ? '💍 Bases' : '💍 Bases')
                                : (activeLanguage.language === 'en' ? '✨ Charms' : '✨ Charms')
                            }
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="px-6 pb-6 flex-1 lg:overflow-y-auto scrollbar-hide">
                    <AnimatePresence mode="wait">
                        {activeTab === 'bases' ? (
                            <motion.div
                                key="bases"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-2 xs:grid-cols-3 gap-3"
                            >
                                {availableBases.map(base => (
                                    <motion.div
                                        key={base.id}
                                        onClick={() => setSelectedBase(base)}
                                        className="relative rounded-sm- cursor-pointer flex flex-col items-center justify-center py-5 px-2 transition-all"
                                        style={{
                                            backgroundColor: selectedBase?.id === base.id ? bg2 : bg3,
                                            border: `1px solid ${selectedBase?.id === base.id ? txt1 : border2}`,
                                        }}
                                        whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="w-12 h-12 mb-2 relative">
                                            {getCurrentThumbnail(base) ? (
                                                <Image src={getCurrentThumbnail(base)!} alt="" fill className="object-contain rounded-sm-" sizes="48px" />
                                            ) : (
                                                <div className="w-full h-full rounded-sm-" style={{ backgroundColor: base.chainColor }} />
                                            )}
                                        </div>
                                        <span className="text-[11px] font-bold text-center px-1 truncate w-full" style={{ color: txt1 }}>
                                            {base.name[activeLanguage.language as 'en' | 'fr'] || base.name.en}
                                        </span>
                                        <span className="text-[9px] font-semibold mt-1" style={{ color: txt3 }}>
                                            {getEffectivePrice(base).toFixed(2).replace(".", ",")} DT
                                        </span>
                                        <div className="mt-1 w-full" onClick={e => e.stopPropagation()}>
                                            <SpecificationsSlider
                                                specifications={base.specifications}
                                                onColorSelect={(hex) => {
                                                    if (!hex) return;
                                                    const normalizeHex = (h?: string | null) => {
                                                        if (!h) return '';
                                                        let v = h.trim().toLowerCase();
                                                        return (v.length === 4 && v.startsWith('#')) ? `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}` : v;
                                                    };
                                                    const hexLower = normalizeHex(hex);

                                                    const specWithImg = base.specifications.find(s => {
                                                        const sHex = normalizeHex(s.colorHex);
                                                        const isMatch = sHex === hexLower || (s.color && s.color.trim().toLowerCase() === hexLower);
                                                        return isMatch && base.images?.some(img => {
                                                            const imgSpecId = typeof img.specification === 'string' ? img.specification : img.specification?._id;
                                                            if (imgSpecId === s._id) return true;

                                                            const imgSpecObj = imgSpecId ? base.specifications.find(sp => sp._id === imgSpecId) : null;
                                                            const imgColorHex = normalizeHex(imgSpecObj?.colorHex || img.specification?.colorHex);
                                                            const imgColorName = (imgSpecObj?.color || img.specification?.color)?.trim().toLowerCase();

                                                            if (sHex && imgColorHex && sHex === imgColorHex) return true;
                                                            if (s.color && imgColorName && s.color.trim().toLowerCase() === imgColorName) return true;

                                                            return false;
                                                        });
                                                    });

                                                    const spec = specWithImg || base.specifications.find(s => {
                                                        const sHex = normalizeHex(s.colorHex);
                                                        return sHex === hexLower || (s.color && s.color.trim().toLowerCase() === hexLower);
                                                    });

                                                    if (spec) handleSpecSelect(base.id, spec);
                                                }}
                                            />
                                        </div>
                                        {selectedBase?.id === base.id && (
                                            <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: txt1 }}>
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: bg1 }} />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="charms"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-2 xs:grid-cols-3 gap-3"
                            >
                                {availableCharms.map(charm => (
                                    <motion.div
                                        key={charm.id}
                                        drag={!isMobile}
                                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                        dragElastic={0.1}
                                        onDragStart={() => setIsDraggingFromMenu(true)}
                                        onDragEnd={(e, info) => handleMenuDragEnd(e, info, charm.id)}
                                        onClick={() => addCharm(charm.id)}
                                        className="relative rounded-sm- cursor-pointer flex flex-col items-center justify-center py-5 px-2 transition-all"
                                        style={{ backgroundColor: bg3, border: `1px solid ${border2}` }}
                                        whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                                        whileTap={{ scale: 0.95 }}
                                        whileDrag={{ zIndex: 9999, scale: 1.1 }}
                                    >
                                        <div className="w-12 h-12 mb-2 relative">
                                            {getCurrentThumbnail(charm) ? (
                                                <Image src={getCurrentThumbnail(charm)!} alt="" fill className="object-contain rounded-sm-" sizes="48px" />
                                            ) : (
                                                <span className="text-3xl drop-shadow-md flex items-center justify-center h-full w-full">{charm.emoji}</span>
                                            )}
                                        </div>
                                        <span className="text-[11px] font-bold text-center px-1 truncate w-full" style={{ color: txt2 }}>
                                            {charm.name[activeLanguage.language as 'en' | 'fr'] || charm.name.en}
                                        </span>
                                        <span className="text-[9px] font-semibold mt-1" style={{ color: txt3 }}>
                                            +{getEffectivePrice(charm).toFixed(2).replace(".", ",")} DT
                                        </span>
                                        <div className="mt-1 w-full" onClick={e => e.stopPropagation()}>
                                            <SpecificationsSlider
                                                specifications={charm.specifications}
                                                onColorSelect={(hex) => {
                                                    if (!hex) return;
                                                    const normalizeHex = (h?: string | null) => {
                                                        if (!h) return '';
                                                        let v = h.trim().toLowerCase();
                                                        return (v.length === 4 && v.startsWith('#')) ? `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}` : v;
                                                    };
                                                    const hexLower = normalizeHex(hex);

                                                    const specWithImg = charm.specifications.find(s => {
                                                        const sHex = normalizeHex(s.colorHex);
                                                        const isMatch = sHex === hexLower || (s.color && s.color.trim().toLowerCase() === hexLower);
                                                        return isMatch && charm.images?.some(img => {
                                                            const imgSpecId = typeof img.specification === 'string' ? img.specification : img.specification?._id;
                                                            if (imgSpecId === s._id) return true;

                                                            const imgSpecObj = imgSpecId ? charm.specifications.find(sp => sp._id === imgSpecId) : null;
                                                            const imgColorHex = normalizeHex(imgSpecObj?.colorHex || img.specification?.colorHex);
                                                            const imgColorName = (imgSpecObj?.color || img.specification?.color)?.trim().toLowerCase();

                                                            if (sHex && imgColorHex && sHex === imgColorHex) return true;
                                                            if (s.color && imgColorName && s.color.trim().toLowerCase() === imgColorName) return true;

                                                            return false;
                                                        });
                                                    });

                                                    const spec = specWithImg || charm.specifications.find(s => {
                                                        const sHex = normalizeHex(s.colorHex);
                                                        return sHex === hexLower || (s.color && s.color.trim().toLowerCase() === hexLower);
                                                    });

                                                    if (spec) handleSpecSelect(charm.id, spec);
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Placed items summary */}
                {placedCharms.length > 0 && (
                    <div className="px-6 py-4 flex-shrink-0 sticky bottom-[80px] lg:bottom-0" style={{ backgroundColor: bg2, borderTop: `1px solid ${border1}` }}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: txt3 }}>
                                {activeLanguage.language === 'en' ? 'Elements' : 'Éléments'} ({placedCharms.length + (selectedBase ? 1 : 0)})
                            </span>
                            <button onClick={clearAll} className="text-[10px] font-bold uppercase flex items-center gap-1" style={{ color: txt1 }}>
                                <RotateCcw size={10} /> {activeLanguage.language === 'en' ? 'Reset' : 'Réinitialiser'}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedBase && (
                                <div className="w-10 h-10 rounded-sm- relative p-1.5" style={{ backgroundColor: bgTab, border: `1px solid ${border1}` }}>
                                    {getCurrentThumbnail(selectedBase) ? (
                                        <Image src={getCurrentThumbnail(selectedBase)!} alt="" fill className="object-contain" sizes="30px" />
                                    ) : (
                                        <div className="w-full h-full rounded-sm-" style={{ backgroundColor: selectedBase.chainColor }} />
                                    )}
                                </div>
                            )}
                            {placedCharms.map(pc => {
                                const charm = availableCharms.find(c => c.id === pc.charmId);
                                return charm ? (
                                    <div key={pc.instanceId} className="w-10 h-10 rounded-sm- relative p-1.5" style={{ backgroundColor: bgTab }}>
                                        {getCurrentThumbnail(charm, pc.specId) ? (
                                            <Image src={getCurrentThumbnail(charm, pc.specId)!} alt="" fill className="object-contain rounded-sm-" sizes="30px" />
                                        ) : (
                                            <span className="text-lg flex items-center justify-center h-full w-full">{charm.emoji}</span>
                                        )}
                                    </div>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}

                {/* Footer CTA */}
                <div className="px-6 py-4 sticky bottom-0 z-[60]" style={{ backgroundColor: bg2, borderTop: `1px solid ${border1}` }}>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[10px] uppercase font-bold opacity-40" style={{ color: txt1 }}>Total</p>
                            <p className="text-xl font-black" style={{ color: txt1 }}>{totalPrice.toFixed(2).replace(".", ",")} DT</p>
                        </div>
                        <motion.button
                            onClick={handleAddCustomPurchaseToCart}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-3 rounded-sm- flex items-center justify-center gap-3 shadow-xl-"
                            style={{ backgroundColor: colors.dark[100], color: colors.light[100] }}
                        >
                            <ShoppingBag size={18} />
                            <h4
                                className='text-sm font-semibold'
                            >
                                {activeLanguage.addToCart}
                            </h4>

                        </motion.button>
                    </div>
                </div>
            </div>

            {/* ═══════════ CANVAS AREA ═══════════ */}
            <div
                className="flex-1 relative order-1 lg:order-2"
                style={{
                    backgroundColor: bg1,
                    height: isMobile ? '60vh' : 'auto',
                }}
                onClick={() => setSelectedCharmId(null)}
            >
                <div className="sticky top-20 w-full flex items-center justify-center overflow-hidden"
                    style={{ height: isMobile ? '100%' : 'calc(100vh - 80px)' }}>
                    {/* Background decorations */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
                        style={{
                            backgroundImage: `radial-gradient(circle, ${colors.dark[100]} 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }}
                    />

                    <AnimatePresence mode="wait">
                        {selectedBase && (
                            <motion.div
                                key={selectedBase.id}
                                ref={necklaceRef}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative"
                                style={{
                                    width: isMobile ? '85vw' : 'min(70vh, 550px)',
                                    aspectRatio: '1',
                                }}
                            >
                                {getCurrentThumbnail(selectedBase) ? (
                                    <div className="absolute inset-0 pointer-events-none drop-shadow-xl">
                                        <Image src={getCurrentThumbnail(selectedBase)!} alt="" fill className="object-contain rounded-sm-" sizes="(max-width: 1024px) 85vw, 550px" priority />
                                    </div>
                                ) : (
                                    <NecklaceSVG chainColor={selectedBase.chainColor} chainHighlight={selectedBase.chainHighlight} />
                                )}

                                {placedCharms.map(pc => {
                                    const charm = availableCharms.find(c => c.id === pc.charmId);
                                    if (!charm) return null;
                                    const isSelected = selectedCharmId === pc.instanceId;

                                    return (
                                        <div
                                            key={pc.instanceId}
                                            className="absolute"
                                            style={{
                                                left: `${pc.x}%`,
                                                top: `${pc.y}%`,
                                                transform: 'translate(-50%, -50%)',
                                                zIndex: isSelected ? 200 : 100,
                                            }}
                                        >
                                            <DraggableCharm
                                                pc={pc}
                                                charm={charm}
                                                isSelected={isSelected}
                                                isDark={isDark}
                                                necklaceRef={necklaceRef}
                                                onSelect={() => setSelectedCharmId(isSelected ? null : pc.instanceId)}
                                                onRemove={() => removeCharm(pc.instanceId)}
                                                onUpdatePos={(x, y) => updateCharmPos(pc.instanceId, x, y)}
                                            />
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Hint */}
                    <div className="absolute top-6 px-4 py-2 rounded-full border backdrop-blur-sm shadow-sm pointer-events-none" style={{ backgroundColor: colors.light[100] + '80', borderColor: border1 }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: txt1 }}>
                            {activeLanguage.language === 'en' ? 'Click to add items' : 'Cliquez pour ajouter items'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Customizer;
