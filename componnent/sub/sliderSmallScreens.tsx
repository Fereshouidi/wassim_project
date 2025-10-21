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

    const [cardWidth, setCardWidth] = useState<number>(250);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [userScroll, setUserScroll] = useState<boolean>(false);
    // const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

    const sliderRef = useRef<HTMLDivElement>(null);

    const productLoading = useRef<HTMLDivElement>(null);
    const [productLoadingVisible, setProductLoadingVisible] = useState(false);
    const [atEnd, setAtEnd] = useState(false);
    const [productLoadingShowUp, setProductLoadingShowUp] = useState<boolean>(true);
    const slidesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        
        // if (isFirstRender) return;

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
            if (!slider) return;
            slider.scrollLeft += 3;
        }, 50);

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



        return (
            <div 
                className='w-full relative overflow-x-scroll scrollbar-hidden slide'
                ref={sliderRef}
                onMouseDown={() => setUserScroll(true)} 
                onTouchStart={() => setUserScroll(true)}             
                onMouseEnter={() => setUserScroll(true)}
            >
                
                <div 
                    className='w-max h-full flex flex-row justify-start gap-2 px-5 slide' 
                    ref={slidesRef}
                    style={{
                        // transform: `translateX(-${currentIndex}px)`,
                    }}
                >

                    <div className='w-max h-full flex flex-row justify-start gap-2 smpx-5'>{

                        products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                className='w-[170px] sm:w-[220px] min-h-[150px] sm:min-h-[220px] m-0'
                                // style={{
                                //     width: cardWidth + "px"
                                // }}
                            />
                        ))

                    }</div>

                    
                    { productLoadingShowUp && 

                        <div ref={productLoading} className=''>
                            <ProductLoading
                                className='w-[170px] sm:w-[220px] min-h-[150px] sm:min-h-[220px] m-0 '
                            />
                        </div>

                    }


                </div>

            </div>
        )

}

export default Slider;
