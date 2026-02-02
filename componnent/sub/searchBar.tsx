"use client";
import { backEndUrl } from '@/api';
import { useLanguage } from '@/contexts/languageContext';
import { useScreen } from '@/contexts/screenProvider';
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
    const [input, setInput] = useState<string>('');
    const [skip, setSkip] = useState<number>(0);
    const [limit, setLimit] = useState<number>(8);
    const searchResultDivRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { screenWidth } = useScreen();
    const [aiModeActive, setAiModeActive] = useState<boolean>(false);
    const [resSecVisible, setResSecVisible] = useState<boolean>(false);
    const searchRef = useRef<HTMLInputElement | null>(null);
    const filterBarRef = useRef<HTMLDivElement | null>(null);

    const router = useRouter();
    const [filteBarActive, setFilterBarActive] = useState<boolean>(false);

    const [mostProductExpensive, setMostProductExpensive] = useState<ProductType | undefined>(undefined);
    const [availableColors, setAvailableColors] = useState<string[]>([]);
    const [availableSizes, setAvailableSizes] = useState<string[]>([]);
    const [availableTypes, setAvailableTypes] = useState<string[]>([]);
    const [allCollections, setAllCollections] = useState<CollectionType[]>([]);

    const { setBubbleProps } = useAiChatBubble();
    const [productsFound, setProductsFound] = useState<ProductType[]>([]);
    const [productsCount, setProductsCount] = useState<number>(0);
    const [filtration, setFiltration] = useState<FiltrationType | undefined>(undefined);

    const aiGradient = "linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #ef4444)";

    useEffect(() => {
        if (!input || !filtration || aiModeActive) {
            if (aiModeActive) setResSecVisible(true);
            return;
        }

        const fetchProductBySearch = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.post(backEndUrl + "/getProductsBySearch", {
                    searchText: input, limit, skip: 0, filtration
                });
                setProductsFound(data.products);
                setProductsCount(data.productsCount);
                setAvailableColors(data.availableColors);
                setAvailableSizes(data.availableSizes);
                setAvailableTypes(data.availableTypes);
            } catch (err) { console.error(err); } finally { setIsLoading(false); }
        };

        setResSecVisible(true);
        fetchProductBySearch();
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
        if (aiModeActive) {
            handleSendMessage();
        } else {
            setLoadingScreen(true);
            setFilterBarActive(false);
            router.push(`/search?searchInput=${encodeURIComponent(input)}&filter=${encodeURIComponent(JSON.stringify(filtration))}`);
        }
    };

    const handleSendMessage = async () => {
        if (!input) return;
        const currentMsg = input;
        setInput('');
        setResSecVisible(false);
        try {
            setBubbleProps(prev => ({ ...prev, answer: '...', exist: true }));
            const { data } = await axios.post(`${backEndUrl}/getAnswerFromAi`, {
                userId: client?._id, message: currentMsg, agent: "SEARCH"
            });
            if (data.filtrationUsed || data.searchQuery) {
                setFiltration(data.filtrationUsed);
                router.push(`/search?searchInput=${encodeURIComponent(data.searchQuery ?? "")}&filter=${encodeURIComponent(JSON.stringify(data.filtrationUsed))}`);
            }
            setBubbleProps(prev => ({ ...prev, answer: data.answer, isTherAnswer: true, exist: true }));
        } catch (err) { setBubbleProps(prev => ({ ...prev, answer: "Connection error..." })); }
    };

    function handleClickOutside(event: any) {
        if (searchResultDivRef.current && !searchResultDivRef.current.contains(event.target)) {
            setResSecVisible(false);
        }
        if (filterBarRef.current && !filterBarRef.current.contains(event.target)) {
            setFilterBarActive(false);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div 
            className={`relative w-[60%] flex flex-row items-center justify-center transition-all duration-700 rounded-xl p-[1.5px] no-sellect ${containerClassName}`}
            style={{
                ...containerStyle,
                backgroundColor: aiModeActive ? aiGradient : 'transparent',
                boxShadow: aiModeActive ? `0 0 20px rgba(139, 92, 246, 0.3)` : 'none',
            }}
        >
            {importedFrom !== "sidBar" && !aiModeActive && (
                <div 
                    className='w-14 h-14 flex justify-center items-center cursor-pointer hover:scale-110 transition-transform rounded-xl overflow-hidden'
                    // Updated to toggle, consistent with UI behavior
                    onClick={() => setFilterBarActive(!filteBarActive)}
                >
                    <img 
                        src={activeTheme === "light" ? "/icons/settings-black.png" : "/icons/settings-white.png"}
                        className='w-5 h-5 opacity-70' alt="settings"
                    />
                </div>
            )}

            <div 
                className={`w-full relative flex flex-row transition-all duration-500 z-10 rounded-xl overflow-hidden ${className}`}
                style={{
                    ...style,
                    backgroundColor: aiModeActive 
                        ? (activeTheme === 'dark' ? '#121212' : '#fff') 
                        : style?.backgroundColor
                }}
            > 
                <input 
                    type="text" 
                    placeholder={(aiModeActive ? activeLanguage.searchByAi : activeLanguage.sideMatter.search) + "..."}
                    className={`h-full flex flex-1 pl-[20px] rounded-xl outline-none text-sm sm:text-md transition-all ${inputClassName} ${aiModeActive ? 'font-medium' : ''}`} 
                    style={inputStyle} 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchIconClicked()}
                    ref={searchRef}
                />
                
                <div className='h-full flex items-center px-1 gap-2'>
                    {importedFrom !== "sidBar" && (
                        <AiMode
                            aiModeActive={aiModeActive}
                            setAiModeActive={setAiModeActive}
                            aiIconStyle={aiIconStyle} 
                            aiIconContentStyle={aiIconContentStyle}
                        />
                    )}

                    <div 
                        className={`h-[45px] w-[45px] flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 transform active:scale-90`}
                        style={{
                            background: aiModeActive ? aiGradient : 'transparent',
                            boxShadow: aiModeActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                        }}
                        onClick={() => {
                            handleSearchIconClicked();
                            searchIconClicked?.();
                        }}
                    >
                        {aiModeActive ? (
                            <FontAwesomeIcon icon={faPaperPlane} className="text-white text-sm" />
                        ) : (
                            <img src={searchIcon} className={`h-[100%] p-3 rounded-xl cursor-pointer transition-all duration-300 `} style={{...searchIconStyle}} alt="search" />
                        )}
                    </div>
                </div>
            </div>

            {/* FIXED FILTER BAR SECTION */}
            {filteBarActive && filtration && (
                <div ref={filterBarRef} className="absolute top-full left-0 mt-2 z-[1000] w-full">
                    <FilterBar 
                        filtration={filtration} 
                        setFiltration={setFiltration}
                        // Corrected: Passing .price (number) instead of the object
                        mostProductExpensive={mostProductExpensive?.price ?? 100}
                        allCollections={allCollections}
                        availableColors={availableColors}
                        availableSizes={availableSizes}
                        availableTypes={availableTypes}
                        // Added missing props required by the component
                        productsCount={productsCount}
                        // searchText={input}
                        filteBarActive={filteBarActive}
                        setFilterBarActive={setFilterBarActive}
                    />
                </div>
            )}

            {aiModeActive && resSecVisible && input && (
                <div 
                    className="absolute top-full left-0 w-full mt-3 p-[1px] rounded-xl z-[999] animate-in fade-in zoom-in-95 duration-300 shadow-2xl"
                    style={{ background: aiGradient }}
                >
                    <div 
                        className="w-full h-full p-4 rounded-[11px] backdrop-blur-xl"
                        style={{ backgroundColor: activeTheme === 'dark' ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{animationDelay: '0ms'}}></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{animationDelay: '150ms'}}></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style={{animationDelay: '300ms'}}></span>
                            </div>
                            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-transparent bg-clip-text" style={{ backgroundImage: aiGradient }}>
                                Artificial Intelligence
                            </span>
                        </div>
                        <p className="text-sm font-medium opacity-80 italic leading-relaxed" style={{ color: colors.dark[200] }}>
                            {input}
                        </p>
                    </div>
                </div>
            )}

            {!aiModeActive && resSecVisible && (
                <div 
                    className={`w-full max-h-[500px] absolute top-full rounded-xl overflow-y-scroll scrollbar-hidden z-[998] shadow-2xl mt-1`}
                    style={{ ...resSectionStyle, backgroundColor: activeTheme === 'dark' ? '#121212' : '#fff' }}
                    ref={searchResultDivRef}
                >
                    {productsFound.length > 0 && input.length > 0 ? (
                        productsFound.map((product) => (
                            <div
                                key={product._id}
                                className='px-4 py-3 text-sm cursor-pointer flex flex-row items-center gap-3 border-b border-black/5 last:border-none hover:bg-black/5 transition-colors'
                                style={{ color: colors.dark[200] }}
                                onClick={() => router.push(`/product/${product._id}`)}
                            >
                                <img src={product.thumbNail ?? ''} className='w-10 h-10 rounded-lg object-cover shadow-sm' alt="" />
                                <p className="truncate flex-1 font-medium">{product.name[activeLanguage.language]}</p>
                            </div>
                        ))
                    ) : input.length > 0 && (
                        <p className='p-6 text-center text-sm opacity-40 italic' style={{ color: colors.dark[200] }}>
                            {isLoading ? activeLanguage.sideMatter.loading + "..." : activeLanguage.sideMatter.noRes}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;