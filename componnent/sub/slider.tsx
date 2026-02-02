"use client";

import { ProductType } from '@/types'
import React, { useEffect, useRef, useState } from 'react'
import ProductLoading from './productCard/productLoading'
import { useScreen } from '@/contexts/screenProvider'
import { useTheme } from '@/contexts/themeProvider'
import ProductCard from './productCard/productCardForSlider'

type sliderProps = {
    products: ProductType[]
    productsCount: number, 
    isFirstRender: boolean
    setIsFirstRender: (value: boolean) => void
    skip: number,
    setSkip: (value: number) => void,
    limit: number
    autoScroll: boolean
    useLike: boolean
}

const Slider = ({
    products,
    productsCount,
    isFirstRender,
    setIsFirstRender,
    skip,
    setSkip,
    limit,
    autoScroll,
    useLike
}: sliderProps) => {

    const [cardWidth, setCardWidth] = useState<number>(250);
    const [userScroll, setUserScroll] = useState<boolean>(false);

    const sliderRef = useRef<HTMLDivElement>(null);
    const productLoading = useRef<HTMLDivElement>(null);
    const [productLoadingVisible, setProductLoadingVisible] = useState(false);
    
    const [productLoadingShowUp, setProductLoadingShowUp] = useState<boolean>(true);
    
    const { screenWidth } = useScreen();
    const { activeTheme, colors } = useTheme();
    const [ leftArrowHover, setLeftArrowHover ] = useState<boolean>(false);
    const [ rightArrowHover, setRightArrowHover ] = useState<boolean>(false);

    const slidesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isFirstRender && products.length >= productsCount) {
            setProductLoadingShowUp(false);
        } else {
            setProductLoadingShowUp(true);
        }
    }, [products.length, productsCount, isFirstRender])

    useEffect(() => {
        if (!productLoading.current || !sliderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                setProductLoadingVisible(entry.isIntersecting);
            },
            {
                root: sliderRef.current,
                threshold: 0.1,
            }
        );

        observer.observe(productLoading.current);
        return () => observer.disconnect();
    }, [products.length]);

    useEffect(() => {
        if (productLoadingVisible && products.length < productsCount && !isFirstRender) {
            setSkip(skip + limit);
        }
    }, [productLoadingVisible]);

    useEffect(() => {
        if (productLoadingVisible || userScroll || !autoScroll) return;

        const timer = setInterval(() => {
            const slider = sliderRef.current;
            if (!slider) return;
            slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }, 3000);

        return () => clearInterval(timer);
    }, [productLoadingVisible, userScroll, autoScroll, cardWidth]);

    useEffect(() => {
        if (!userScroll) return;
        const timeout = setTimeout(() => setUserScroll(false), 3000);
        return () => clearTimeout(timeout);
    }, [userScroll]);

    const handleLeftArrowClick = () => {
        if (!sliderRef.current) return;
        setUserScroll(true);
        sliderRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }

    const handleRightArrowClick = () => {
        if (!sliderRef.current) return;
        setUserScroll(true);
        sliderRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }

    if (products.length < 1) return;

    return ( 
        <div className={`w-full- max-w-full- bg-red-500- ${screenWidth < 1000 && 'px-5-'}`}>
            <div className={`w-full flex flex-row items-center justify-between `}>

                {/* Left Arrow */}
                <button 
                    onClick={handleLeftArrowClick} 
                    onMouseEnter={() => setLeftArrowHover(true)}
                    onMouseLeave={() => setLeftArrowHover(false)}
                    className="p-2.5 mr-5 rounded-full shrink-0 border shadow-sm active:scale-90 transition-transform"
                    style={{
                        backgroundColor: leftArrowHover ? colors.light[250] : 'transparent',
                        borderColor: colors.dark[100] + '20',
                        transform: leftArrowHover ? 'scale(1.2)' : 'scale(1)'
                    }}
                >
                    <img 
                        src={activeTheme === "dark" ? "/icons/left-arrow-white.png" : "/icons/left-arrow-black.png"} 
                        className="w-4 h-4" 
                        alt="prev" 
                    />
                </button>
                
                {/* Main Slider Window */}
                <div 
                    className='flex relative overflow-x-scroll scrollbar-hidden slide flex-1 justify-between'
                    ref={sliderRef}
                    onMouseDown={() => setUserScroll(true)} 
                    onTouchStart={() => setUserScroll(true)}             
                    onMouseEnter={() => setUserScroll(true)}
                    style={{
                        width: screenWidth > 1800 ?
                                cardWidth * 6 + "px" 
                            :screenWidth < 1800 && screenWidth > 1500 ? 
                                cardWidth * 5 + "px" 
                            :screenWidth < 1500 && screenWidth > 1300 ? 
                                cardWidth * 4 + "px" 
                            : screenWidth < 1300 && screenWidth > 1000 ?
                                cardWidth * 3 + "px"
                            : cardWidth * 2 + "px"
                    }}
                >
                    <div 
                        className='w-max h-full flex flex-row justify-start slide bg-red-500-' 
                        ref={slidesRef}
                    >
                        <div className='w-max h-full  flex flex-row justify-start gap-5-'>
                            {products.map((product, index) => (
                                <div 
                                    key={index}
                                    className=' h-[250px] h-fit- bg-red-500- sm:h-[320px] m-2- px-2 rounded-xl overflow-hidden'
                                    style={{
                                        width: cardWidth  + "px",
                                    }}
                                >
                                    <ProductCard
                                        product={product}
                                        className='w-[100%] h-[90%] py-2-'
                                        useLike={useLike}
                                    />
                                </div>
                            ))}
                        </div>

                        {productLoadingShowUp && (
                            <div 
                                ref={productLoading}
                                className=' h-[250px] h-fit- bg-red-500- sm:h-[320px] m-2- px-2 rounded-xl overflow-hidden'
                                style={{
                                    width: cardWidth  + "px",
                                }}
                            >
                                <ProductLoading
                                    style={{ width: cardWidth }}
                                    className='w-[100%] h-[90%] py-2-'
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Arrow */}
                <button 
                    onClick={handleRightArrowClick} 
                    onMouseEnter={() => setRightArrowHover(true)}
                    onMouseLeave={() => setRightArrowHover(false)}
                    className="p-2.5 ml-5 rounded-full shrink-0 border shadow-sm active:scale-90 transition-transform"
                    style={{
                        backgroundColor: rightArrowHover ? colors.light[250] : 'transparent',
                        borderColor: colors.dark[100] + '20',
                        transform: rightArrowHover ? 'scale(1.2)' : 'scale(1)'
                    }}
                >
                    <img 
                        src={activeTheme === "dark" ? "/icons/right-arrow-white.png" : "/icons/right-arrow-black.png"} 
                        className="w-4 h-4" 
                        alt="next" 
                    />
                </button>
            </div>
        </div>
    )
}

export default Slider;