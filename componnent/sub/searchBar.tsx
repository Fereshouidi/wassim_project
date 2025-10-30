"use client";
import { backEndUrl } from '@/api';
import { useLanguage } from '@/contexts/languageContext';
import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { ProductType, SearchBarProps } from '@/types';
import axios from 'axios';
// import SearchIcon from "@/app/svg/icons/search";
import React, { CSSProperties, useState, useContext, useEffect, useRef } from 'react';
import AiMode from './aiMode';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useRouter } from 'next/navigation';
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
    searchIconClicked
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
    const searchRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();

    useEffect(() => {

        const fetchData = async () => {
            setIsLoading(true);
            await axios.post(backEndUrl + "/getProductsBySearch", { 
                searchText: input, 
                limit, 
                skip,
                filtration: undefined
            })
            .then(({ data }) => {
                setSearchResult(prev => {
                    const map = new Map();

                    [...prev, ...data.products].forEach(product => {
                        map.set(product._id, product);
                    });

                    return Array.from(map.values());
                })
                setSearchResultCount(data.productsCount);
                setIsLoading(false);
            })
            .catch(( err ) => {
                throw err;
            })
        }

        input && fetchData();

    }, [skip])

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            await axios.post(backEndUrl + "/getProductsBySearch", { 
                searchText: input, 
                limit, 
                skip,
                filtration: undefined
            })
            .then(({ data }) => {
                setSearchResult(data.products);  
                setSearchResultCount(data.productsCount);
                setIsLoading(false);
            })
            .catch(( err ) => {
                throw err;
            })
        }

        if (input.length > 0) {
            setSkip(0);
            fetchData(); 
        }    
        
        setResSecVisible(input ? true : false);

    }, [input])
    
    const handleScroll = () => {

        if (!searchResultDivRef.current) return;
        

        const { scrollTop, scrollHeight, clientHeight } = searchResultDivRef.current;
        const reachedToEnd = scrollTop + clientHeight >= scrollHeight;

        if (reachedToEnd) {
            setSkip(skip + limit);
        }
    };

    const handleSearchIconClicked = () => {

        if (aiModeActive) {

            return;

        } else {

            router.push(`/search?searchInput=${input}`)
        }

    }

    useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setResSecVisible(false);
        }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);

    return(
        <div 
            className={`w-[60%] flex flex-col ${aiModeActive && "overflow-hidden"} relative rounded-sm p-[1.5px] ${containerClassName} `}
            ref={searchRef}
        >

            <div 
                className={`w-full relative flex flex-row rounded-sm z-10 ${className}`}
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
                    <AiMode
                        aiModeActive={aiModeActive}
                        setAiModeActive={setAiModeActive}
                        aiIconStyle={aiIconStyle} 
                        aiIconContentStyle={aiIconContentStyle}
                    />

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
                    className={`w-full max-h-[500px] absolute top-full rounded-sm overflow-y-scroll scrollbar-hidden ${!resSecVisible && "invisible"} `}
                    style={{
                        
                        ...resSectionStyle,
                    }}
                    ref={searchResultDivRef}
                    onScroll={handleScroll}
                >
                    {
                        searchResult.length > 0 && input.length > 0 ?

                            searchResult.map((product, index) => (
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
                        : input.length > 0 && searchResult.length == 0 ?

                            isLoading ? 
                                <p className='p-5 text-sm'>{activeLanguage.sideMatter.loading + "..."}</p>
                            :
                                <p className='p-5 text-sm'>{activeLanguage.sideMatter.noRes}</p>
                        : null
                    }
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

