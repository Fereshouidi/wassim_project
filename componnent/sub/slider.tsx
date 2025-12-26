import { ProductType } from '@/types'
import React, { useEffect, useRef, useState } from 'react'
import ProductCard from './productCard'
import ProductLoading from './productLoading'
import { useScreen } from '@/contexts/screenProvider'
import { useTheme } from '@/contexts/themeProvider'

type sliderProps = {
    products: ProductType[]
    productsCount: number, 
    isFirstRender: boolean
    setIsFirstRender: (value: boolean) => void
    skip: number,
    setSkip: (value: number) => void,
    limit: number
    autoScroll: boolean
}

const Slider = ({
    products,
    productsCount,
    isFirstRender,
    setIsFirstRender,
    skip,
    setSkip,
    limit,
    autoScroll
}: sliderProps) => {

    const [cardWidth, setCardWidth] = useState<number>(270);
    const [userScroll, setUserScroll] = useState<boolean>(false);

    const sliderRef = useRef<HTMLDivElement>(null);
    const productLoading = useRef<HTMLDivElement>(null);
    const [productLoadingVisible, setProductLoadingVisible] = useState(false);
    
    // Logic to hide the loader once all products are fetched
    const [productLoadingShowUp, setProductLoadingShowUp] = useState<boolean>(true);
    
    const { screenWidth } = useScreen();
    const { activeTheme, colors } = useTheme();
    const [ leftArrowHover, setLeftArrowHover ] = useState<boolean>(false);
    const [ rightArrowHover, setRightArrowHover ] = useState<boolean>(false);

    const slidesRef = useRef<HTMLDivElement>(null);

    // Update visibility of the loader based on product count
    useEffect(() => {
        if (!isFirstRender && products.length >= productsCount) {
            setProductLoadingShowUp(false);
        } else {
            setProductLoadingShowUp(true);
        }
    }, [products.length, productsCount, isFirstRender])

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        if (!productLoading.current || !sliderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                setProductLoadingVisible(entry.isIntersecting);
            },
            {
                root: sliderRef.current,
                threshold: 0.1, // Trigger earlier for smoother UX
            }
        );

        observer.observe(productLoading.current);
        return () => observer.disconnect();
    }, [products.length]); // Re-observe when items are added

    // Trigger Fetching
    useEffect(() => {
        if (productLoadingVisible && products.length < productsCount && !isFirstRender) {
            setSkip(skip + limit);
        }
    }, [productLoadingVisible]);

    // Auto Scroll Logic
    useEffect(() => {
        if (productLoadingVisible || userScroll || !autoScroll) return;

        const timer = setInterval(() => {
            const slider = sliderRef.current;
            if (!slider) return;
            
            // Smoothly scroll to the next card
            slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }, 3000);

        return () => clearInterval(timer);
    }, [productLoadingVisible, userScroll, autoScroll, cardWidth]);

    // Reset User Scroll status
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

    const arrowStyle = { transform: 'scale(1)' }
    const arrowHoverStyle = {
        backgroundColor: colors.light[250],
        transform: 'scale(1.2)'
    }

    return ( 
        <div className={`w-full- max-w-full- bg-red-500- ${screenWidth < 1000 && 'px-5-'}`}>
            <div className={`w-full flex flex-row items-center justify-between `}>

                {/* Left Arrow */}
                <div 
                    className={`w-20 h-20 flex justify-center items-center rounded-full mx-10 cursor-pointer duration-300`}
                    onMouseEnter={() => setLeftArrowHover(true)}
                    onMouseLeave={() => setLeftArrowHover(false)}
                    onClick={handleLeftArrowClick}
                    style={leftArrowHover ? arrowHoverStyle : arrowStyle}
                >
                    <img 
                        src={activeTheme == "dark" ? "/icons/left-arrow-white.png" : "/icons/left-arrow-black.png"}
                        className='w-10 h-10'
                    />
                </div>
                
                {/* Main Slider Window */}
                <div 
                    className='flex relative overflow-x-scroll scrollbar-hidden slide flex-1 justify-between'
                    ref={sliderRef}
                    onMouseDown={() => setUserScroll(true)} 
                    onTouchStart={() => setUserScroll(true)}             
                    onMouseEnter={() => setUserScroll(true)}
                    style={{
                        width: screenWidth > 1500 ? 
                                cardWidth * 4 + "px" 
                            : screenWidth < 1600 && screenWidth > 1100 ?
                                cardWidth * 3 + "px"
                            : cardWidth * 2 + "px"
                    }}
                >
                    <div 
                        className='w-max h-full flex flex-row justify-start slide' 
                        ref={slidesRef}
                    >
                        <div className='w-max h-full flex flex-row justify-start'>
                            {products.map((product, index) => (
                                <div 
                                    key={index}
                                    className=' min-h-[150px] sm:min-h-[220px] m-0 '
                                    style={{
                                        width: cardWidth  + "px",
                                        paddingLeft: '5px',
                                        paddingRight: '5px',
                                    }}
                                >
                                    <ProductCard
                                        product={product}
                                        className='w-[100%] h-full'
                                    />
                                </div>
                            ))}
                        </div>

                        {productLoadingShowUp && (
                            <div ref={productLoading}>
                                <ProductLoading
                                    style={{ width: cardWidth }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Arrow */}
                <div 
                    className={`w-20 h-20 flex justify-center items-center rounded-full mx-10 cursor-pointer duration-300`}
                    onMouseEnter={() => setRightArrowHover(true)}
                    onMouseLeave={() => setRightArrowHover(false)}
                    onClick={handleRightArrowClick}
                    style={rightArrowHover ?  arrowHoverStyle : arrowStyle}
                >
                    <img 
                        src={activeTheme == "dark" ? "/icons/right-arrow-white.png" : "/icons/right-arrow-black.png"}
                        className='w-10 h-10'
                    />
                </div>
            </div>
        </div>
    )
}

export default Slider;