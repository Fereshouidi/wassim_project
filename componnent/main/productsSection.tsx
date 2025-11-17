"use client";
import { CollectionType, ProductType } from '@/types'
import React, { CSSProperties, useEffect, useState } from 'react'
import ProductCard from '../sub/productCard'
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


type ProductsSectionType = {
    collection: CollectionType
    autoScroll: boolean
    product?: ProductType
    tittleStyle?: CSSProperties
    isThereProducts: boolean
    setIsThereProducts: (value: boolean) => void
}

const ProductsSection = ({
    collection,
    autoScroll,
    product,
    tittleStyle,
    isThereProducts, 
    setIsThereProducts
}: ProductsSectionType) => {

    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();
    const { screenWidth } = useScreen();
    const [limit, setLimit] = useState<number>(20);
    const [skip, setSkip] = useState<number>(0);
    const [productsCount, setProductsCount] = useState<number>(0);
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const [products, setProducts] = useState<ProductType[]>(productsLoading);

    useEffect(() => {
        setIsThereProducts && setIsThereProducts(products.length > 0)
            // alert(isThereProducts)

    }, [products])


    useEffect(() => {

        const fetchData = async () => {
            

                // isFirstRender && setProducts(productsLoading);

                if (loading) return;
                
                setLoading(true);

                if (collection._id?.length && collection._id?.length < 3) return setProducts(productsLoading);

                await axios.get(backEndUrl + "/getProductsByCollection", { params: { 
                    collectionId: collection._id, 
                    limit, 
                    skip 
                }})

                .then(({data}) => {

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

    if (!isThereProducts) return

  return (

    <div className='w-full flex flex-col justify-center items-center'>

        {collection.name[activeLanguage.language] ?
            <h2 
                className='text-xl sm:text-4xl sm:m-20 m-10'
                style={{
                    color: colors.dark[100],
                    ...tittleStyle
                }}
            >
                {collection.name[activeLanguage.language]}
            </h2>
            :
            <div className='w-[150px] h-8 rounded-sm overflow-hidden text-2xl sm:text-5xl sm:m-20 m-10'>
                <SkeletonLoading/>
            </div>
        }

        {
            collection.display == "vertical" ?

                <div className='w-full sm:px-14 flex flex-col justify-center items-center'>

                    <div className='w-full flex flex-wrap justify-center gap-2 sm:gap-10'>

                        {
                            products?.map((product, index) => (
                                <ProductCard
                                    key={index}
                                    product={product}
                                    className="w-[175px] sm:w-[225px] min-h-[185px] sm:min-h-[250px] my-3"
                                />
                            ))
                        }

                    </div>

                    { 
                        products?.length != productsCount &&  

                            <MoreBotton
                                skip={skip}
                                setSkip={setSkip}
                                limit={limit}
                                isLoading={loading}
                            /> 

                    }

                </div>


            :
                
                screenWidth > 1500 ?

                    <Slider
                        products={products}
                        productsCount={productsCount}
                        isFirstRender={isFirstRender}
                        setIsFirstRender={setIsFirstRender}
                        skip={skip}
                        setSkip={setSkip}
                        limit={limit}
                        autoScroll={autoScroll}
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
                    />
            
        }

    </div>

  )
}

export default ProductsSection
