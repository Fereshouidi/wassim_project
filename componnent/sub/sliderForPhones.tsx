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

const SliderForPhones = ({
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

    const [cardWidth, setCardWidth] = useState<number>(270);
    const [userScroll, setUserScroll] = useState<boolean>(false);

    const sliderRef = useRef<HTMLDivElement>(null);
    const productLoading = useRef<HTMLDivElement>(null);
    const [productLoadingVisible, setProductLoadingVisible] = useState(false);
    const [productLoadingShowUp, setProductLoadingShowUp] = useState<boolean>(true);
    
    const { screenWidth } = useScreen();
    const { activeTheme, colors } = useTheme();
    const slidesRef = useRef<HTMLDivElement>(null);

    // Update loading visibility logic
    useEffect(() => {
        if (!isFirstRender && products.length >= productsCount) {
            setProductLoadingShowUp(false);
        } else {
            setProductLoadingShowUp(true);
        }
    }, [products.length, productsCount, isFirstRender])

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        if (!slidesRef.current || !productLoading.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                setProductLoadingVisible(entry.isIntersecting);
            },
            {
                root: sliderRef.current,
                threshold: 0.1, // Changed to 0.1 to trigger loading more reliably
            }
        );

        observer.observe(productLoading.current);
        return () => observer.disconnect();
    }, [products.length]);

    // Handle Ticker Auto-Scroll
    useEffect(() => {
        if (productLoadingVisible || userScroll || !autoScroll) {
            return;
        }

        const timer = setInterval(() => {
            const slider = sliderRef.current;
            if (!slider) return;
            slider.scrollLeft += 5; // Continuous ticker movement
        }, 100);

        return () => clearInterval(timer);
    }, [productLoadingVisible, userScroll, autoScroll]);

    // Trigger next page fetch
    useEffect(() => {
        if (productLoadingVisible && products.length < productsCount && !isFirstRender) {
            setSkip(skip + limit);
        }
    }, [productLoadingVisible]);

    // Reset User Scroll status after interaction
    useEffect(() => {
        if (!userScroll) return;
        const timeout = setTimeout(() => {
            setUserScroll(false);
        }, 3000)
        return () => clearTimeout(timeout);
    }, [userScroll])

    return (
        <div className={`w-full ${screenWidth < 1000 && 'px-5-'}`}>
            <div className={`w-full flex flex-row items-center justify-between `}>
                
                <div 
                    className='flex relative overflow-x-scroll scrollbar-hidden slide flex-1 justify-between'
                    ref={sliderRef}
                    onMouseDown={() => setUserScroll(true)} 
                    onTouchStart={() => setUserScroll(true)}             
                    onMouseEnter={() => setUserScroll(true)}
                >
                    <div 
                        className='w-max h-full flex flex-row justify-start slide' 
                        ref={slidesRef}
                    >
                        <div className='w-max h-full flex flex-row justify-start gap-2- smpx-5'>
                            {products.map((product, index) => (
                                <div 
                                    key={index}
                                    className='w-[180px] sm:w-[250px] rounded-xl overflow-hidden'
                                    style={{
                                        // width: cardWidth  + "px"
                                        // width="w-"
                                    }}
                                >
                                    <ProductCard
                                        product={product}
                                        className='w-[95%] h-[97%] rounded-xl overflow-hidden'
                                        useLike={useLike}
                                    />
                                </div>
                            ))}
                        </div>

                        {productLoadingShowUp && (
                            <div ref={productLoading} className=''>
                                <ProductLoading
                                    className='w-[170px] sm:w-[220px] min-h-[150px] sm:min-h-[220px] m-0 '
                                />
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SliderForPhones;