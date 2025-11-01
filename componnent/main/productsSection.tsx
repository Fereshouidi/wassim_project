"use client";
import { CollectionType, ProductType } from '@/types'
import React, { useEffect, useState } from 'react'
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
}

const ProductsSection = ({
    collection
}: ProductsSectionType) => {

    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();
    const { screenWidth } = useScreen();
    const [limit, setLimit] = useState<number>(6);
    const [skip, setSkip] = useState<number>(0);
    const [productsCount, setProductsCount] = useState<number>(0);
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const [products, setProducts] = useState<ProductType[]>(productsLoading);

    // useEffect(() => {
    //     console.log({productsCount});
    //     console.log({products});
        
    // }, [products])


    useEffect(() => {

        const fetchData = async () => {
            

                // isFirstRender && setProducts(productsLoading);
                
                setLoading(true);

                if (collection._id?.length && collection._id?.length < 3) return setProducts(productsLoading);

                await axios.get(backEndUrl + "/getProductsByCollection", { params: { 
                    collectionId: collection._id, 
                    limit, 
                    skip 
                }})

                .then(({data}) => {

                    !isFirstRender && data.products ?
                        setProducts([...products, ...data.products]) : 
                        setProducts(data.products);

                    setProductsCount(data.productsCount);
                    setIsFirstRender(false);
                    setLoading(false);
                    
                })
                .catch((err) => {
                    console.log(err);
                })

        }

        fetchData();

    }, [collection, skip])

  return (

    <div className='w-full flex flex-col justify-center items-center'>

        {collection.name[activeLanguage.language] ?
            <h2 
                className='text-2xl sm:text-5xl sm:m-20 m-10'
                style={{
                    color: colors.dark[100]
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

                <div className='w-full sm:px-24 flex flex-col justify-center items-center'>

                    <div className='w-full flex flex-wrap justify-center gap-2 sm:gap-10'>

                        {
                            products?.map((product, index) => (
                                <ProductCard
                                    key={index}
                                    product={product}
                                    className="w-[185px] sm:w-[250px] min-h-[185px] sm:min-h-[250px] my-3"
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
                    />
            
        }

    </div>

  )
}

export default ProductsSection
