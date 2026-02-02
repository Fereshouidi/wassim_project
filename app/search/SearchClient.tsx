"use client";
import { backEndUrl } from '@/api';
import FilterBar2 from '@/componnent/main/filterbar2';
import Footer from '@/componnent/main/footer';
import Header from '@/componnent/main/header';
import SideBar from '@/componnent/main/sideBar';
import LoadingScreen from '@/componnent/sub/loading/loadingScreen';
import MoreBotton from '@/componnent/sub/moreBotton';
import ProductCard from '@/componnent/sub/productCard/productCard';
import { headerHeight, headerHeightForPhones } from '@/constent';
import { useLanguage } from '@/contexts/languageContext';
import { useLoadingScreen } from '@/contexts/loadingScreen';
import { useOwner } from '@/contexts/ownerInfo';
import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { CollectionType, FiltrationType, ProductType } from '@/types';
import axios from 'axios';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {
    const params = useSearchParams();
    const filter = params.get('filter');
    const searchText = params.get('searchInput');

    const [sideBarActive, setSideBarActive] = useState<boolean>(false);
    const { colors, activeTheme } = useTheme();
    const { activeLanguage } = useLanguage();
    const { screenWidth } = useScreen();
    const { ownerInfo, setOwnerInfo } = useOwner();

    const [mostProductExpensive, setMostProductExpensive] = useState<ProductType | undefined>(undefined);
    const [availableColors, setAvailableColors] = useState<string[]>(["all"]);
    const [availableSizes, setAvailableSizes] = useState<string[]>(["all"]);
    const [availableTypes, setAvailableTypes] = useState<string[]>(["all"]);
    const [allCollections, setAllCollections] = useState<CollectionType[]>([]);

    const [productsFound, setProductsFound] = useState<ProductType[]>([]);
    const [productsCount, setProductsCount] = useState<number>(0);
    const [limit, setLimit] = useState<number>(8);
    const [skip, setSkip] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const { setLoadingScreen } = useLoadingScreen();

    const [filtration, setFiltration] = useState<FiltrationType | undefined>(undefined);
    const [filteBarActive, setFilterBarActive] = useState<boolean>(false);

    // 1. Fetch Default Data
    useEffect(() => {
        const fetchDefaultData = async () => {
            try {
                const [expensiveRes, collectionsRes] = await Promise.all([
                    axios.get(`${backEndUrl}/getMostProductExpensive`),
                    axios.get(`${backEndUrl}/getAllCollections`)
                ]);
                setMostProductExpensive(expensiveRes.data.product);
                setAllCollections(collectionsRes.data.allCollections.filter((col: CollectionType) => col.type === "public"));
            } catch (err) { console.error(err); }
        };
        fetchDefaultData();
    }, []);

    // 2. Initial Filtration Setup
    useEffect(() => {
        if (filter) {
            try {
                setFiltration(JSON.parse(decodeURIComponent(filter)));
            } catch (e) { console.error("Filter parse error"); }
        } else if (mostProductExpensive) {
            const maxPrice = mostProductExpensive?.specifications?.[0]?.price ?? 1000;
            setFiltration({
                price: { from: 0, to: maxPrice },
                collections: allCollections.map(col => col._id ?? ''),
                colors: ["all"],
                types: ["all"],
                sizes: ["all"],
                sortBy: "date",
                sortDirection: "asc",
                activeLanguage: activeLanguage.language
            });
        }
    }, [mostProductExpensive, allCollections, filter]);

    // 3. Search Fetching Logic
    useEffect(() => {
        if (!filtration) return;
        const fetchProducts = async () => {
            setLoadingScreen(true);
            try {
                const { data } = await axios.post(`${backEndUrl}/getProductsBySearch`, {
                    searchText: searchText ?? '',
                    limit,
                    skip: 0,
                    filtration
                });
                setProductsFound(data.products || []);
                setProductsCount(data.productsCount || 0);
                setAvailableColors(data.availableColors || ["all"]);
                setAvailableSizes(data.availableSizes || ["all"]);
                setAvailableTypes(data.availableTypes || ["all"]);
                setSkip(0);
            } catch (err) { console.error(err); }
            finally { setLoadingScreen(false); }
        };
        fetchProducts();
    }, [filtration, searchText]);

    const getMore = async () => {
        if (!filtration) return;
        setLoading(true);
        try {
            const nextSkip = skip + limit;
            const { data } = await axios.post(`${backEndUrl}/getProductsBySearch`, {
                searchText, limit, skip: nextSkip, filtration
            });
            setProductsFound([...productsFound, ...data.products]);
            setSkip(nextSkip);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    if (!ownerInfo) return <LoadingScreen />

    return (
        <div className='min-h-screen flex flex-col' style={{ backgroundColor: colors.light[100] }}>
            <Header
                isSideBarActive={sideBarActive}
                setIsSideBarActive={setSideBarActive}
                ownerInfo={ownerInfo}
                setOwnerInfo={setOwnerInfo}
                searchInput={searchText}
            />

            {/* --- Toolbar --- */}
            <div 
                className="w-full fixed sm:sticky z-[40] border-b px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex justify-between items-center transition-all duration-300"
                style={{ 
                    backgroundColor: colors.light[100], 
                    borderColor: colors.light[200],
                    top: screenWidth > 1024 ? `${headerHeight}px` : `${headerHeightForPhones}px`
                }}
            >
                <div className="flex flex-col">
                    <h1 className="text-[12px] sm:text-xs lg:text-sm font-black uppercase tracking-tighter" style={{ color: colors.dark[100] }}>
                        {activeLanguage.sideMatter.resultsFound}
                    </h1>
                    <p className="text-[10px] opacity-60 uppercase">{productsCount} Items Found</p>
                </div>

                <button 
                    onClick={() => setFilterBarActive(!filteBarActive)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border text-[12px] font-bold transition-all active:scale-95 shadow-sm"
                    style={{ 
                        borderColor: colors.light[300],
                        backgroundColor: filteBarActive ? colors.dark[100] : 'transparent',
                        color: filteBarActive ? colors.light[100] : colors.dark[100]
                    }}
                >
                    <img 
                        src={(activeTheme === 'dark' || filteBarActive) ? "/icons/filter-white.png" : "/icons/filter-black.png"} 
                        className="w-3 h-3" 
                        alt="filter"
                    />
                    <span>{filteBarActive ? "Hide" : "Filter"}</span>
                </button>
            </div>

            <div className="flex flex-col lg:flex-row items-start w-full relative min-h-screen">
                
                {/* Overlay: يعمل كحماية لمنع الضغط خارج الفلتر في الموبايل */}
                {screenWidth <= 1024 && filteBarActive && (
                    <div 
                        className="fixed inset-0 bg-black/40 z-[45] backdrop-blur-sm lg:hidden transition-all duration-300"
                        onClick={() => setFilterBarActive(false)}
                    />
                )}

                {/* Sidebar/FilterBar */}
                <aside 
                    className={`
                        fixed lg:sticky z-[49] lg:z-[10] border-r transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                        ${filteBarActive 
                            ? "w-[280px] sm:w-[320px] translate-x-0 opacity-100 visible" 
                            : "w-0 -translate-x-full opacity-0 invisible pointer-events-none" 
                        }
                    `}
                    style={{
                        top: screenWidth > 1024 ? `${headerHeight + 73}px` : `0px`,
                        height: screenWidth > 1024 ? `calc(100dvh - ${headerHeight}px - 73px)` : `100dvh`,
                        backgroundColor: colors.light[100],
                        borderColor: colors.light[200]
                    }}
                >
                    <div className="w-[280px] sm:w-[320px] h-full overflow-y-auto scrollbar-hidden">
                        {filtration && (
                            <FilterBar2
                                filtration={filtration}
                                setFiltration={setFiltration}
                                mostProductExpensive={mostProductExpensive?.specifications?.[0]?.price ?? 1000}
                                productsCount={productsCount}
                                allCollections={allCollections}
                                availableColors={availableColors}
                                availableSizes={availableSizes}
                                availableTypes={availableTypes}
                                importedFrom='searchPage'
                                filteBarActive={filteBarActive}
                                setFilterBarActive={setFilterBarActive}
                            />
                        )}
                    </div>
                </aside>

                {/* Main Content: شبكة المنتجات */}
                <main className="flex-1 w-full py-4 sm:py-8 px-3 sm:px-6 lg:px-10 z-[1]">
                    <div className={`
                        w-full grid justify-items-center gap-2 sm:gap-4
                        grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
                    `}>
                        {productsFound.length > 0 ? (
                            productsFound.map((product, index) => (
                                <ProductCard
                                    key={product._id || index}
                                    product={product}
                                    className="w-full"
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 opacity-20 font-black uppercase tracking-[0.2em] text-center text-xs">
                                No Matching Products
                            </div>
                        )}
                    </div>

                    {/* Load More */}
                    {productsFound.length < productsCount && (
                        <div className="w-full flex justify-center mt-12 mb-10">
                            <MoreBotton
                                skip={skip}
                                setSkip={setSkip}
                                limit={limit}
                                isLoading={loading}
                                getMore={getMore}
                            />
                        </div>
                    )}
                </main>
            </div>

            <Footer />
            <SideBar
                isActive={sideBarActive}
                setIsActive={setSideBarActive}
                ownerInfo={ownerInfo}
                setOwnerInfo={setOwnerInfo}
            />
        </div>
    )
}

export default Page;