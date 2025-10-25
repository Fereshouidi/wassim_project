import { ProductType } from '@/types'
import React, { useEffect, useRef, useState } from 'react'
import ProductCard from './productCard'
import ProductLoading from './productLoading'
import { useScreen } from '@/contexts/screenProvider'
import { useTheme } from '@/contexts/themeProvider'
import { transform } from 'next/dist/build/swc/generated-native'

type sliderProps = {
    products: ProductType[]
    productsCount: number, 
    isFirstRender: boolean
    setIsFirstRender: (value: boolean) => void
    skip: number,
    setSkip: (value: number) => void,
    limit: number
}

const Slider = ({
    products,
    productsCount,
    isFirstRender,
    setIsFirstRender,
    skip,
    setSkip,
    limit
}: sliderProps) => {

    const [cardWidth, setCardWidth] = useState<number>(270);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [userScroll, setUserScroll] = useState<boolean>(false);
    // const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

    const sliderRef = useRef<HTMLDivElement>(null);

    // const [productWidth, setProductWidth] = useState<number>(250);
    const productLoading = useRef<HTMLDivElement>(null);
    const [productLoadingVisible, setProductLoadingVisible] = useState(false);
    const [atEnd, setAtEnd] = useState(false);
    const [productLoadingShowUp, setProductLoadingShowUp] = useState<boolean>(true);
    const { screenWidth } = useScreen();
    const { activeTheme, colors } = useTheme();
    const leftArrowRef = useRef<HTMLDivElement>(null);
    const rightArrowRef = useRef<HTMLDivElement>(null);
    const [ leftArrowHover, setLeftArrowHover ] = useState<boolean>(false);
    const [ rightArrowHover, setRightArrowHover ] = useState<boolean>(false);

    const slidesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (!isFirstRender && products.length == productsCount) {
            setProductLoadingShowUp(false);
        }

    }, [products.length, isFirstRender])

    useEffect(() => {
        if (!slidesRef.current || !productLoading.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                setProductLoadingVisible(entry.isIntersecting);
            },
            {
                root: sliderRef.current,
                threshold: 1,
            }
        );

        observer.observe(productLoading.current);

        return () => observer.disconnect();
    }, [sliderRef, productLoading.current]);

    useEffect(() => {

        if (productLoadingVisible || userScroll) {
            return () => {};
        }

        const timer = setInterval(() => {
            const slider = sliderRef.current;
            if (!slider || atEnd) return;
            slider.scrollLeft += cardWidth;
            
        }, 3000);

        return () => {
            clearInterval(timer);
        };

    }, [ productLoadingVisible, userScroll]);

    useEffect(() => {
            if (productLoadingVisible) {
                setSkip(skip + limit);
            }
    }, [productLoadingVisible])

    useEffect(() => {

        if (!userScroll) return;

        setTimeout(() => {
            setUserScroll(false);
        }, 3000)

    }, [userScroll])

  const handleLeftArrowClick = () => {
        if (!sliderRef.current) return;
        sliderRef.current.scrollLeft -= cardWidth;
  }

    const handleRightArrowClick = () => {
        if (!sliderRef.current) return;
        sliderRef.current.scrollLeft += cardWidth;
    }

    const arrowStyle = {
        transform: 'scale(1)'
    }
    const arrowHoverStyle = {
        backgroundColor: colors.light[250],
        transform: 'scale(1.2)'
    }

        return ( 

            <div className={`w-full- ${screenWidth < 1000 && 'px-5-'}`}>

                <div className={`w-full flex flex-row items-center justify-between `}>

                    <div 
                        className={`w-32 h-32 flex justify-center items-center rounded-full mx-10 cursor-pointer duration-300`}
                        onMouseEnter={() => setLeftArrowHover(true)}
                        onMouseLeave={() => setLeftArrowHover(false)}
                        onClick={handleLeftArrowClick}
                        style={leftArrowHover ?  arrowHoverStyle : arrowStyle}
                    >
                        <img 
                            src={activeTheme == "dark" ? "/icons/left-arrow-white.png" : "/icons/left-arrow-black.png"}
                            className='w-12 h-12'
                        />
                    </div>
                    
                    <div 
                        className='flex relative overflow-x-scroll scrollbar-hidden slide flex-1 justify-between'
                        ref={sliderRef}
                        onMouseDown={() => setUserScroll(true)} 
                        onTouchStart={() => setUserScroll(true)}             
                        onMouseEnter={() => setUserScroll(true)}
                        style={{
                            width: cardWidth * 4 + "px"
                        }}
                    >

                        <div 
                            className='w-max h-full flex flex-row justify-start slide' 
                            ref={slidesRef}
                            style={{
                                // transform: `translateX(-${currentIndex}px)`,
                            }}
                        >

                            <div className='w-max h-full flex flex-row justify-start'>{

                                products.map((product) => (
                                    <div 
                                        key={product._id}
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
                                ))

                            }</div>

                            
                            { productLoadingShowUp && 

                                <div ref={productLoading} className=''>
                                    <ProductLoading
                                        // className='w-[170px] sm:w-[220px] min-h-[150px] sm:min-h-[220px] m-0 '
                                        style={{
                                            width: cardWidth
                                        }}
                                    />
                                </div>

                            }


                        </div>

                    </div>

                    <div 
                        className={`w-32 h-32 flex justify-center items-center rounded-full mx-10 cursor-pointer duration-300`}
                        onMouseEnter={() => setRightArrowHover(true)}
                        onMouseLeave={() => setRightArrowHover(false)}
                        onClick={handleRightArrowClick}
                        style={rightArrowHover ?  arrowHoverStyle : arrowStyle}
                    >
                        <img 
                            src={activeTheme == "dark" ? "/icons/right-arrow-white.png" : "/icons/right-arrow-black.png"}
                            className='w-12 h-12'
                        />
                    </div>

                </div>

            </div>

        )

}

export default Slider;
