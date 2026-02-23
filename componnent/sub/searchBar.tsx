"use client";
import { backEndUrl } from '@/api';
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import { CollectionType, FiltrationType, ProductType, SearchBarProps } from '@/types';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import AiMode from './aiMode';
import { useRouter } from 'next/navigation';
import FilterBar from '../main/filterBar';
import { useLoadingScreen } from '@/contexts/loadingScreen';
import { useAiChatBubble } from '@/contexts/AiChatBubble';
import { useClient } from '@/contexts/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useCartSide } from '@/contexts/cart';

const SearchBar = ({
    className, inputClassName, style, inputStyle, searchIcon,
    searchIconClassName, searchIconStyle, containerClassName,
    resSectionStyle, aiIconStyle, aiIconContentStyle, searchInput,
    searchIconClicked, importedFrom, containerStyle
}: SearchBarProps) => {

    const { client } = useClient();
    const { activeTheme, colors } = useTheme();
    const { setLoadingScreen } = useLoadingScreen();
    const { activeLanguage } = useLanguage();
    const { setIsActive } = useCartSide();
    const { setBubbleProps, addMessage } = useAiChatBubble();
    
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [aiModeActive, setAiModeActive] = useState<boolean>(false);
    const [resSecVisible, setResSecVisible] = useState<boolean>(false);
    
    const searchRef = useRef<HTMLInputElement | null>(null);
    const filterBarRef = useRef<HTMLDivElement | null>(null);
    const searchResultDivRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const [filteBarActive, setFilterBarActive] = useState<boolean>(false);

    const [mostProductExpensive, setMostProductExpensive] = useState<ProductType | undefined>(undefined);
    const [availableColors, setAvailableColors] = useState<string[]>([]);
    const [availableSizes, setAvailableSizes] = useState<string[]>([]);
    const [availableTypes, setAvailableTypes] = useState<string[]>([]);
    const [allCollections, setAllCollections] = useState<CollectionType[]>([]);

    const [productsFound, setProductsFound] = useState<ProductType[]>([]);
    const [productsCount, setProductsCount] = useState<number>(0);
    const [filtration, setFiltration] = useState<FiltrationType | undefined>(undefined);

    const aiGradient = "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)";
    const isDark = activeTheme === 'dark';

    useEffect(() => {
        if (!input || !filtration || aiModeActive) {
            if (aiModeActive && input) setResSecVisible(true);
            return;
        }
        const fetchProductBySearch = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.post(backEndUrl + "/getProductsBySearch", {
                    searchText: input, limit: 8, skip: 0, filtration
                });
                setProductsFound(data.products);
                setProductsCount(data.productsCount);
                setAvailableColors(data.availableColors);
                setAvailableSizes(data.availableSizes);
                setAvailableTypes(data.availableTypes);
            } catch (err) { console.error(err); } finally { setIsLoading(false); }
        };
        const timer = setTimeout(() => { setResSecVisible(true); fetchProductBySearch(); }, 300);
        return () => clearTimeout(timer);
    }, [filtration, input, aiModeActive]);

    useEffect(() => {
        const fetchDefaultFiltration = async () => {
            try {
                const [priceRes, collRes] = await Promise.all([
                    axios.get(backEndUrl + '/getMostProductExpensive'),
                    axios.get(backEndUrl + '/getAllCollections')
                ]);
                setMostProductExpensive(priceRes.data.product);
                setAllCollections(collRes.data.allCollections.filter((col: CollectionType) => col.type == "public"));
            } catch (err) { console.error(err); }
        };
        fetchDefaultFiltration();
    }, []);

    useEffect(() => {
        setFiltration({
            price: { from: 0, to: mostProductExpensive?.price ?? 100 },
            collections: allCollections.map(collection => (collection._id ?? '')),
            colors: availableColors,
            types: availableTypes,
            sizes: availableTypes,
            sortBy: "price",
            sortDirection: "asc",
            activeLanguage: activeLanguage.language
        });
    }, [mostProductExpensive, allCollections]);

    const handleSearchIconClicked = () => {
        if (aiModeActive) handleSendMessage();
        else {
            setLoadingScreen(true);
            setFilterBarActive(false);
            router.push(`/search?searchInput=${encodeURIComponent(input)}&filter=${encodeURIComponent(JSON.stringify(filtration))}`);
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;
        const currentMsg = input;
        addMessage('user', currentMsg);
        setBubbleProps(prev => ({ ...prev, exist: true, isTherAnswer: false }));
        setInput('');
        setResSecVisible(false);
        setIsLoading(true);

        try {
            const { data } = await axios.post(`${backEndUrl}/getAnswerFromAi`, {
                userId: client?._id, 
                message: currentMsg, 
                agent: "SEARCH"
            });
            if (data.uiAction && data.uiAction.element === 'cart') setIsActive(data.uiAction.state === 'open');
            if (data.filtrationUsed || data.searchQuery) {
                setFiltration(data.filtrationUsed);
                router.push(`/search?searchInput=${encodeURIComponent(data.searchQuery ?? "")}&filter=${encodeURIComponent(JSON.stringify(data.filtrationUsed))}`);
            }
            addMessage('assistant', data.answer);
            setBubbleProps(prev => ({ ...prev, isTherAnswer: true, exist: true }));
        } catch (err) { 
            setBubbleProps(prev => ({ ...prev, answer: "Connection error..." })); 
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchResultDivRef.current && !searchResultDivRef.current.contains(event.target as Node)) setResSecVisible(false);
            if (filterBarRef.current && !filterBarRef.current.contains(event.target as Node)) setFilterBarActive(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div 
            className={`relative w-[60%] flex flex-row items-center justify-center transition-all duration-500 rounded-xl p-[1.2px] ${containerClassName}`}
            style={{ ...containerStyle, background: aiModeActive ? aiGradient : 'transparent' }}
        >
            {importedFrom !== "sidBar" && !aiModeActive && (
                <div className='w-14 h-14 flex justify-center items-center cursor-pointer' onClick={() => setFilterBarActive(!filteBarActive)}>
                    <img src={isDark ? "/icons/settings-white.png" : "/icons/settings-black.png"} className='w-5 h-5 opacity-60' alt="settings" />
                </div>
            )}

            <div className={`w-full rounded-[11px] relative flex flex-row transition-all duration-300 z-10 overflow-hidden ${className}`} style={{ ...style, backgroundColor: importedFrom == "sidBar" ? "" : colors.light[100] }}> 
                <input 
                    type="text" 
                    placeholder={(aiModeActive ? activeLanguage.searchByAi : activeLanguage.sideMatter.search) + "..."}
                    className={`h-full flex flex-1 pl-[20px] bg-transparent outline-none text-sm ${inputClassName}`} 
                    style={{...inputStyle}} 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchIconClicked()}
                    ref={searchRef}
                />
                
                <div className='h-full flex items-center px-2 gap-2'>
                    {importedFrom !== "sidBar" && (
                        <AiMode aiModeActive={aiModeActive} setAiModeActive={setAiModeActive} aiIconStyle={aiIconStyle} aiIconContentStyle={aiIconContentStyle} />
                    )}
                    <div 
                        className={`h-[42px] w-[42px] flex items-center justify-center rounded-xl cursor-pointer`}
                        style={{ background: aiModeActive ? aiGradient : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)') }}
                        onClick={handleSearchIconClicked}
                    >
                        {aiModeActive ? 
                            <FontAwesomeIcon icon={faPaperPlane} className="text-white text-xs" /> : 
                            <div 
                                className='w-full h-full p-3 rounded-xl overflow-hidden' 
                                style={{...searchIconStyle, backgroundColor: importedFrom == "sidBar" ? colors.light[100] : colors.dark[100] }}
                            >
                                <img src={searchIcon} className={`h-full w-full opacity-70-`} style={{...searchIconStyle, backgroundColor: importedFrom == "sidBar" ? "" : colors.dark[100] }} alt="search" />
                            </div>
                        }
                    </div>
                </div>
            </div>

            {/* Filtration Bar */}
            {filteBarActive && filtration && (
                <div ref={filterBarRef} className="absolute top-full left-0 mt-3 z-[1000] w-full">
                    <FilterBar filtration={filtration} setFiltration={setFiltration} mostProductExpensive={mostProductExpensive?.price ?? 100} allCollections={allCollections} availableColors={availableColors} availableSizes={availableSizes} availableTypes={availableTypes} productsCount={productsCount} filteBarActive={filteBarActive} setFilterBarActive={setFilterBarActive} />
                </div>
            )}

            {/* AI Search Info Section */}
            {aiModeActive && resSecVisible && input && (
                <div className="absolute top-full left-0 w-full mt-4 p-[1.5px] rounded-2xl z-[999] animate-in fade-in slide-in-from-top-4 shadow-2xl" style={{ background: aiGradient }}>
                    <div className="w-full h-full p-5 rounded-[15px] backdrop-blur-2xl" style={{ backgroundColor: isDark ? 'rgba(10, 10, 10, 0.98)' : 'rgba(255, 255, 255, 0.98)' }}>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">AI SEARCHING MODE</span>
                        </div>
                        <p className="mt-3 text-sm font-medium opacity-90 truncate" style={{ color: isDark ? '#eee' : '#333' }}>"{input}"</p>
                    </div>
                </div>
            )}

            {/* Live Search Result Section (Re-added) */}
            {!aiModeActive && resSecVisible && input.length > 0 && (
                <div 
                    className={`w-full max-h-[400px] absolute top-full rounded-2xl overflow-y-auto z-[998] shadow-2xl mt-3 p-2 border border-white/5 transition-all duration-300`}
                    style={{ ...resSectionStyle, backgroundColor: isDark ? '#121212' : '#fff' }}
                    ref={searchResultDivRef}
                >
                    {productsFound.length > 0 ? (
                        productsFound.map((product) => (
                            <div
                                key={product._id}
                                className='px-4 py-3 rounded-xl text-sm cursor-pointer flex flex-row items-center gap-4 hover:bg-current/5 transition-all group'
                                onClick={() => router.push(`/product/${product._id}`)}
                            >
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-current/5">
                                    <img src={product.thumbNail ?? ''} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' alt="" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="truncate font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                                        {product.name[activeLanguage.language]}
                                    </p>
                                    <p className="text-[11px] opacity-50 uppercase font-bold tracking-tighter">View Details</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='p-10 text-center space-y-2 opacity-40'>
                            <div className="text-2xl animate-bounce">🔍</div>
                            <p className='text-xs font-bold uppercase tracking-widest'>
                                {isLoading ? activeLanguage.sideMatter.loading : activeLanguage.sideMatter.noRes}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;