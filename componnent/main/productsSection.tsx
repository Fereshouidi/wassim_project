"use client";
import { CollectionType, ProductType } from '@/types'
import React, { CSSProperties, useEffect, useState } from 'react'
import ProductCard from '../sub/productCard/productCard'
import { useTheme } from '@/contexts/themeProvider'
import { useLanguage } from '@/contexts/languageContext'
import axios from 'axios';
import { backEndUrl } from '@/api';
import MoreBotton from '../sub/moreBotton';
import { fakeProducts, productsLoading } from '@/constent/data';
import Slider from '../sub/slider';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useScreen } from '@/contexts/screenProvider';
import SliderForPhones from '../sub/sliderForPhones';
import SkeletonLoading from '../sub/SkeletonLoading';
// استيراد motion
import { motion } from 'framer-motion';

type ProductsSectionType = {
    collection: CollectionType
    autoScroll: boolean
    product?: ProductType
    tittleStyle?: CSSProperties
    isThereProducts: boolean
    setIsThereProducts: (value: boolean) => void
    useLike: boolean
}

const ProductsSection = ({
    collection,
    autoScroll,
    product,
    tittleStyle,
    isThereProducts, 
    setIsThereProducts,
    useLike
}: ProductsSectionType) => {

    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();
    const { screenWidth } = useScreen();
    const [limit, setLimit] = useState<number>(10);
    const [skip, setSkip] = useState<number>(0);
    const [productsCount, setProductsCount] = useState<number>(0);
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const [products, setProducts] = useState<ProductType[]>(productsLoading);

    // الـ Variants الخاصة بالعنوان
    const titleAnimation = {
        hidden: { y: -20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1, 
            transition: { duration: 0.6, ease: "easeOut" } 
        }
    };

    useEffect(() => {
        setIsThereProducts && setIsThereProducts(products.length > 0)
            // alert(isThereProducts)

    }, [products])


    useEffect(() => {

        const fetchData = async () => {

                if (loading) return;
                
                setLoading(true);

                if (collection._id?.length && collection._id?.length < 3) return setProducts(productsLoading);

                await axios.get(backEndUrl + "/getProductsByCollection", { params: { 
                    collectionId: collection._id, 
                    limit, 
                    skip,
                }})

                .then(({data}) => {

                    console.log({data});
                    

                    const filterTheProduct = data.products?.filter((product_: ProductType) => product_._id != product?._id)

                    !isFirstRender && data.products ?
                        setProducts([...products, ...filterTheProduct]) : 
                        setProducts(filterTheProduct);

                    setProductsCount(data.productsCount - 1);
                    setIsFirstRender(false);
                    setLoading(false);
                    
                })
                .catch((err) => {
                    console.log(err);
                })

        }

        fetchData();

    }, [collection, skip])

    if (!isThereProducts) return;

  return (

    <div className='w-full flex flex-col justify-center items-center sm:my-5 overflow-hidden'>

        {collection.name[activeLanguage.language] ?
            <motion.h2 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={titleAnimation}
                className='text-xl sm:text-4xl sm:mb-20 m-10'
                style={{
                    color: colors.dark[100],
                    ...tittleStyle
                }}
            >
                {collection.name[activeLanguage.language]}
            </motion.h2>
            :
            <div className='w-[150px] h-8 rounded-xl overflow-hidden text-2xl sm:text-5xl sm:m-20 m-10'>
                <SkeletonLoading/>
            </div>
        }

        {
            collection.display == "vertical" ?

                <div className='w-full sm:px-5 flex flex-col justify-center items-center'>

                    <div className='w-full flex flex-wrap wrap-break-word- justify-center items-center px-4- bg-red-500- py-10 gap-2 sm:gap-4'>

                        {
                            products?.map((product, index) => (
                                <ProductCard
                                    key={index}
                                    product={product}
                                    className="w-[45%]- sm:w-[500px]- h-[370px] sm:min-h-[500px] bg-red-500- my-3- p-2-"
                                    useLike={useLike}
                                    style={{
                                        width: screenWidth > 800 ? "300px"  : "47%",
                                        // height: 
                                    }}
                                />
                            ))
                        }

                    </div>

                    {/* <div>{products?.length}, {productsCount}</div> */}

                    { 
                        products?.length < productsCount &&  

                            <MoreBotton
                                skip={skip}
                                setSkip={setSkip}
                                limit={limit}
                                isLoading={loading}
                            /> 

                    }

                </div>


            :
                
                screenWidth > 750 ?

                    <Slider
                        products={products}
                        productsCount={productsCount}
                        isFirstRender={isFirstRender}
                        setIsFirstRender={setIsFirstRender}
                        skip={skip}
                        setSkip={setSkip}
                        limit={limit}
                        autoScroll={autoScroll}
                        useLike={useLike}
                    /> 
                :
                    <SliderForPhones
                        products={products}
                        productsCount={productsCount}
                        isFirstRender={isFirstRender}
                        setIsFirstRender={setIsFirstRender}
                        skip={skip}
                        setSkip={setSkip}
                        limit={limit}
                        autoScroll={autoScroll}
                        useLike={useLike}
                    />
            
        }

    </div>

  )
}

export default ProductsSection