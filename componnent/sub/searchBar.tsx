"use client";
import { backEndUrl } from '@/api';
import { useLanguage } from '@/contexts/languageContext';
import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { CollectionType, FiltrationType, ProductType, SearchBarProps } from '@/types';
import axios from 'axios';
// import SearchIcon from "@/app/svg/icons/search";
import React, { CSSProperties, useState, useContext, useEffect, useRef } from 'react';
import AiMode from './aiMode';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useRouter } from 'next/navigation';
import FilterBar from '../main/filterBar';
// import english from '@/app/languages/english.json';
// import arabic from '@/app/languages/arabic.json';
// import { LanguageSelectorContext } from "@/app/contexts/LanguageSelectorContext";



const SearchBar = ({
    className,
    inputClassName,
    style,
    inputStyle,
    searchIcon,
    searchIconClassName,
    searchIconStyle,
    containerClassName,
    resSectionStyle,
    aiIconStyle,
    aiIconContentStyle,
    searchInput,
    searchIconClicked,
    importedFrom,
    containerStyle
}: SearchBarProps) => {

    const [focus, setFocus] = useState(false);
    const { activeTheme, colors } = useTheme();
    const { activeLanguage } = useLanguage();
    const [input, setInput] = useState<string>('');
    const [searchResult, setSearchResult] = useState<ProductType[]>([]);
    const [skip, setSkip] = useState<number>(0);
    const [limit, setLimit] = useState<number>(8);
    const [searchResultCount, setSearchResultCount] = useState<number>(0);
    const resRef = useRef<(HTMLParagraphElement | null)[]>([]);
    const searchResultDivRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { screenWidth } = useScreen();
    const [aiModeActive, setAiModeActive] = useState<boolean>(false);
    const [resSecVisible, setResSecVisible] = useState<boolean>(false);
    // const [filterSecVisible, setFilterSecVisible] = useState<boolean>(false);
    const searchRef = useRef<HTMLInputElement | null>(null);
    const filterBarRef = useRef<HTMLInputElement | null>(null);
    
    const router = useRouter();
    const [filteBarActive, setFilterBarActive] = useState<boolean>(false);
    const [searchText, setSeachText] = useState<string>('');
    // const [loading, setLoading] = useState<boolean>(false);

    const [mostProductExpensive, setMostProductExpensive] = useState<ProductType | undefined>(undefined);
    const [availableColors, setAvailableColors] = useState<string[]>([]);
    const [availableSizes, setAvailableSizes] = useState<string[]>([]);
    const [availableTypes, setAvailableTypes] = useState<string[]>([]);
    const [allCollections, setAllCollections] = useState<CollectionType[]>([]);

    const [productsFound, setProductsFound] = useState<ProductType[]>([]);
    const [productsCount, setProductsCount] = useState<number>(0);
      
    const [filtration, setFiltration] = useState<FiltrationType | undefined>(undefined);


  useEffect(() => {

    if (!input || !filtration) return;

    // if (loading) {
    //     setTimeout(() => {
    //         setLoading(false)
    //     }, 3000)
    // }
    
    const fetchProductBySearch = async () => {
      setIsLoading(true);
      await axios.post( backEndUrl + "/getProductsBySearch", {
        searchText: input,
        limit,
        skip: 0,
        filtration
      })
      .then(({ data }) => {
        setProductsFound(data.products);
        setProductsCount(data.productsCount);
        setAvailableColors(data.availableColors);
        setAvailableSizes(data.availableSizes);
        setAvailableTypes(data.availableTypes);
        setIsLoading(false);
      })
      .catch(( err ) => {
        setIsLoading(false);
        throw err;
      })
    }

    setResSecVisible(true);

    fetchProductBySearch();
    
    localStorage.setItem('searchFilter', JSON.stringify(filtration));
    localStorage.setItem('searchText', searchText);
    
  }, [filtration, input])

//   useEffect(() => {console.log("Component rendered");

//     if (!searchText || !filtration) return;
    
//     const fetchProductBySearch = async () => {
//       setLoading(true);
//       await axios.post( backEndUrl + "/getProductsBySearch", {
//         searchText,
//         limit,
//         skip,
//         filtration
//       })
//       .then(({ data }) => {
//         setProductsFound([...productsFound, ...data.products]);
//         setProductsCount(data.productsCount);
//         setAvailableColors(data.availableColors);
//         setAvailableSizes(data.availableSizes);
//         setAvailableTypes(data.availableTypes);
//         setLoading(false);
//       })
//       .catch(( err ) => {
//         setLoading(false);
//         throw err;
//       })
//     }
//     fetchProductBySearch();
    
//   }, [skip])

  useEffect(() => {console.log("Component rendered");

    const fetchDefaultFiltration = async () => {

      await axios.get(backEndUrl + '/getMostProductExpensive')
      .then(({ data }) => {
        setMostProductExpensive(data.product)
        // setFiltration({
        //   ...filtration, 
        //   price: {
        //     ...filtration.price,
        //     to: data.product.specifications[0].price
        //   }
        // })
      })
      .catch( (err) => {throw err})

      await axios.get(backEndUrl + '/getAllCollections')
      .then(({ data }) => {
        setAllCollections(data.allCollections);
      })
      .catch( (err) => {throw err})

    }
    
    fetchDefaultFiltration();


  }, [])

  useEffect(() => {

    setFiltration({
        price: {
            from: 0,
            to: mostProductExpensive?.specifications[0].price ?? 100
        },
        collections: allCollections.map(collection => (collection._id?? '')),
        colors: availableColors,
        types: availableTypes,
        sizes: availableTypes,

        sortBy: "name",
        sortDirection: "desc"
    
    })
  }, [mostProductExpensive, allCollections])

    // useEffect(() => {

    //     const fetchData = async () => {
    //         setIsLoading(true);
    //         await axios.post(backEndUrl + "/getProductsBySearch", { 
    //             searchText: input, 
    //             limit, 
    //             skip,
    //             filtration: undefined
    //         })
    //         .then(({ data }) => {
    //             setSearchResult(prev => {
    //                 const map = new Map();

    //                 [...prev, ...data.products].forEach(product => {
    //                     map.set(product._id, product);
    //                 });

    //                 return Array.from(map.values());
    //             })
    //             setSearchResultCount(data.productsCount);
    //             setIsLoading(false);
    //         })
    //         .catch(( err ) => {
    //             throw err;
    //         })
    //     }

    //     input && fetchData();

    // }, [skip])

    // useEffect(() => {

    //     if (loading) return;
        
    //     setIsLoading(true);
    //     const fetchData = async () => {
    //         await axios.post(backEndUrl + "/getProductsBySearch", { 
    //             searchText: input, 
    //             limit, 
    //             skip,
    //             filtration: undefined
    //         })
    //         .then(({ data }) => {
    //             setSearchResult(data.products);  
    //             setSearchResultCount(data.productsCount);
    //             setIsLoading(false);
    //         })
    //         .catch(( err ) => {
    //             setLoading(false);
    //             throw err;
    //         })
    //     }

    //     if (input.length > 0) {
    //         setSkip(0);
    //         fetchData(); 
    //     }    
        
    //     setResSecVisible(input ? true : false);

    // }, [input])
    
    const handleScroll = () => {

        if (!searchResultDivRef.current) return;
        

        const { scrollTop, scrollHeight, clientHeight } = searchResultDivRef.current;
        const reachedToEnd = scrollTop + clientHeight >= scrollHeight;

        if (reachedToEnd) {
            setSkip(skip + limit);
        }
    };

    const handleSearchIconClicked = () => {

        setFilterBarActive(false);

        if (aiModeActive) {

            return;

        } else {

            router.push(
                `/search?searchInput=${encodeURIComponent(input)}&filter=${encodeURIComponent(JSON.stringify(filtration))}`
            );
        }

    }

    function handleClickOutside(event: any) {
        const ResSecEl = searchResultDivRef.current;
        const filterEl = filterBarRef.current;
        const target = (event as any).target as Node;

        const clickedOutsideSearch = !ResSecEl?.contains(target);
        const clickedOutsideFilter = !filterEl?.contains(target);

        if (clickedOutsideSearch && clickedOutsideFilter) {
            setResSecVisible(false);
            setFilterBarActive(false);
        }
    }


    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return(
        <div 
            className={`relative w-[60%] flex flex-row items-center justify-center ${aiModeActive && "overflow-hidden-"} relative rounded-sm p-[1.5px] no-sellect ${containerClassName} `}
            style={{
                ...containerStyle
            }}
        >

            {importedFrom != "sidBar" && 
            
            <div 
                className='w-14 h-14 flex justify-center items-center cursor-pointer'
                onClick={() => filteBarActive ? null : setFilterBarActive(true)}
            >
                <img 
                    src={
                        activeTheme == 'dark' ? "/icons/filter-white.png" : "/icons/filter-black.png"
                    }
                    className='w-5 h-5'
                />
            </div>
            
            }

            <div 
                className={`w-full relative flex flex-row rounded-sm- z-10 ${className}`}
                style={style} 
            > 

                <input 
                    type="text" 
                    placeholder={
                        activeLanguage.sideMatter.search + "..."
                    }
                    className={`h-full flex flex-1 pl-[20px] outline-none ${inputClassName}`} 
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    style={{
                        ...inputStyle
                    }} 
                    defaultValue={searchInput?? ''}
                    onChange={(e) => setInput(e.target.value)}
                    ref={searchRef}
                />
                
                <div
                    className='h-full rounded-sm cursor-pointer flex justify-between items-center transition-[width] duration-300'
                >
                    {importedFrom != "sidBar" && <AiMode
                        aiModeActive={aiModeActive}
                        setAiModeActive={setAiModeActive}
                        aiIconStyle={aiIconStyle} 
                        aiIconContentStyle={aiIconContentStyle}
                    />}

                    <img 
                        className='h-[95%] mr-0.5 p-4 rounded-sm cursor-pointer'
                        src={searchIcon} 
                        alt="" 
                        style={{
                            // backgroundColor: colors.dark[100]
                            ...searchIconStyle,
                        }}
                        onClick={() => {
                            handleSearchIconClicked();
                            searchIconClicked ? searchIconClicked() : null
                            setSeachText(input);
                        }}
                    />
                </div>


            </div>

                    
            { 
                aiModeActive ?

                    <div 
                        className={`w-full max-h-[500px] absolute top-full rounded-sm overflow-y-scroll scrollbar-hidden z-[999] ${!resSecVisible && "invisible"}`}
                        style={{
                            ...resSectionStyle
                            
                        }}
                    >
                        {resSecVisible ? <p className='p-2'>ya wassim ridh rahi mazelet mate5demch hadhika</p> : null }
                    </div>

                :

                <div 
                    className={`w-full max-h-[500px] absolute top-full rounded-sm overflow-y-scroll scrollbar-hidden ${resSecVisible && !filteBarActive ? "visible" : "invisible"}`}
                    style={{
                        
                        ...resSectionStyle,
                    }}
                    ref={searchResultDivRef}
                    onScroll={handleScroll}
                    // onMouseDown={(e) => handleClickOutside(e)}
                >
                    {
                        productsFound.length > 0 && input.length > 0 ?

                            productsFound.map((product, index) => (
                                <p 
                                    key={product._id}
                                    ref={(el: HTMLParagraphElement | null) => {
                                        resRef.current[index] = el;
                                    }}                            
                                    onMouseEnter={(e) => {
                                        if (resRef.current[index]) {
                                            resRef.current[index].style.backgroundColor = resSectionStyle?.color + '20'
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (resRef.current[index]) {
                                            resRef.current[index].style.backgroundColor = 'transparent'
                                        }
                                    }}
                                    className='px-4 py-2 text-sm cursor-pointer'
                                    style={{
                                        color: resSectionStyle?.color
                                    }}
                                >
                                    {
                                        screenWidth > 1000 ?

                                            (product.name[activeLanguage.language]?.length ?? 0) > 80 ? 
                                                (product.name[activeLanguage.language]?.slice(0, 80) ?? "") + "..." :
                                                (product.name[activeLanguage.language] ?? "")

                                        : 

                                            (product.name[activeLanguage.language]?.length ?? 0) > 30 ? 
                                                (product.name[activeLanguage.language]?.slice(0, 30) ?? "") + "..." :
                                                (product.name[activeLanguage.language] ?? "")

                                    }
                                </p>
                            ))
                        : input.length > 0 && productsFound.length == 0 ?

                            isLoading ? 
                                <p className='p-5 text-sm'>{activeLanguage.sideMatter.loading + "..."}</p>
                            :
                                <p className='p-5 text-sm'>{activeLanguage.sideMatter.noRes}</p>
                        : null
                    }
                </div>

            }

        {
            filteBarActive &&
            filtration && 
            mostProductExpensive?.specifications[0].price && 

            <div 
                className='w-full absolute top-full'
                onClick={(e) => e.stopPropagation()}
                ref={filterBarRef}
            >
                <FilterBar
                    filtration={filtration}
                    setFiltration={setFiltration}
                    mostProductExpensive={mostProductExpensive.specifications[0].price}
                    productsCount={productsCount}
                    allCollections={allCollections}
                    availableColors={availableColors}
                    availableSizes={availableSizes}
                    availableTypes={availableTypes}
                    searchText={input}
                    filteBarActive={filteBarActive}
                    setFilterBarActive={setFilterBarActive}
                />
            </div>

        }

            {/* {aiModeActive && <div className='absolute top-0 left-0 w-full h-full'>
                <video 
                    src="/AIBg.webm"
                    className=" w-full  rounded-sm"
                    loop={true}
                    autoPlay={true}
                ></video>
            </div>} */}




        </div>

    )



}
export default  SearchBar;

