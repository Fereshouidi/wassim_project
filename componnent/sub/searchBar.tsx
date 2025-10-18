"use client";
import { backEndUrl } from '@/api';
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import { ProductType, SearchBarProps } from '@/types';
import axios from 'axios';
// import SearchIcon from "@/app/svg/icons/search";
import React, { CSSProperties, useState, useContext, useEffect, useRef } from 'react';
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
}: SearchBarProps) => {

    const [focus, setFocus] = useState(false);
    const { activeTheme, colors } = useTheme();
    const { activeLanguage } = useLanguage();
    const [input, setInput] = useState<string>('');
    const [searchResult, setSearchResult] = useState<ProductType[]>([]);
    const [skip, setSkip] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [searchResultCount, setSearchResultCount] = useState<number>(0);
    const resRef = useRef<(HTMLParagraphElement | null)[]>([]);


    useEffect(() => {

        const fetchData = async () => {
            await axios.get(backEndUrl + "/getProductsBySearch", {
                params: { 
                    searchText: input, 
                    limit, 
                    skip 
                }
            })
            .then(({ data }) => {
                setSearchResult(data.products);
                setSearchResultCount(data.productsCount);
            })
            .catch(( err ) => {
                throw err;
            })
        }

        input && fetchData();

    }, [input])

    useEffect(() => {
        console.log({searchResult});
        
    }, [searchResult])

    return(
        <div className={`w-[60%] relative flex flex-col`}>

            <div 
                className={`w-full relative flex flex-row ${className}`}
                style={style} 
            > 
                <input 
                    type="text" 
                    placeholder={
                        activeLanguage.sideMatter.search + "..."
                    }
                    className={`w-full h-full px-[20px] outline-none ${inputClassName}`} 
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    style={{
                        // color: colors.dark[100],
                        ...inputStyle
                    }} 
                    onChange={(e) => setInput(e.target.value)}
                />
                
                <img 
                    className='h-[90%] p-4 absolute right-[3px] top-[50%] translate-y-[-50%] rounded-sm cursor-pointer'
                    src={searchIcon} 
                    alt="" 
                    style={{
                        // backgroundColor: colors.dark[100]
                        ...searchIconStyle,
                    }}
                />

            </div>

            <div 
                className='w-full absolute top-full rounded-sm'
                style={{
                    backgroundColor: colors.light[100]
                }}
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
                                        resRef.current[index].style.backgroundColor = colors.light[300]
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (resRef.current[index]) {
                                        resRef.current[index].style.backgroundColor = 'transparent'
                                    }
                                }}
                                className='px-4 py-2 cursor-pointer'
                                style={{
                                    color: colors.dark[200]
                                }}
                            >
                                {product.name[activeLanguage.language]}
                            </p>
                        ))
                    : input.length > 0 && searchResult.length == 0 ?

                        <p className='p-5'>{activeLanguage.sideMatter.noRes}</p>
                    : null
                }
            </div>

        </div>

    )



}
export default  SearchBar;

