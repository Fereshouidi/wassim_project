"use client";
import { CollectionType, ProductType } from '@/types'
import React, { useEffect, useState } from 'react'
import ProductCard from '../sub/productCard'
import { useTheme } from '@/contexts/themeProvider'
import { useLanguage } from '@/contexts/languageContext'
import axios from 'axios';
import { backEndUrl } from '@/api';
import MoreBotton from '../sub/moreBotton';
import { fakeProducts } from '@/constent/data';

type collectionSectionType = {
    collection: CollectionType
}

const CollectionSection = ({
    collection
}: collectionSectionType) => {

    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();

    const [limit, setLimit] = useState<number>(6);
    const [skip, setSkip] = useState<number>(0);
    const [productsCount, setProductsCount] = useState<number>(0);

    const [products, setProducts] = useState<ProductType[] | undefined>(undefined);

    useEffect(() => {
        console.log({productsCount});
        
    }, [products])


    useEffect(() => {

        const fetchData = async () => {
            
                setProducts(fakeProducts);

                await axios.get(backEndUrl + "/getProductsByCollection", { params: { 
                    collectionId: collection._id, 
                    limit, 
                    skip 
                }})

                .then(({data}) => {

                    // products?.length && products?.length > limit ?
                    //     setProducts([...products, ...data.products]) : 
                    //     setProducts(data.products);

                    setProductsCount(data.productsCount);
                    
                })
                .catch((err) => {
                    console.log(err);
                })

        }

        fetchData();

    }, [collection, skip])

  return (

    <div className='w-full sm:px-24 flex flex-col justify-center items-center'>

        <h2 
            className='text-2xl sm:text-5xl sm:m-20 m-10'
            style={{
                color: colors.dark[100]
            }}
        >
            {collection.name[activeLanguage.language]}
        </h2>

        <div className='w-full flex flex-wrap justify-center gap-2 sm:gap-10'>

            {
                products?.map((product, index) => (
                    <ProductCard
                        key={index}
                        product={product}
                    />
                ))
            }

            {/* {
                collection.products?.length && collection.products?.length % 2 !== 0 &&
                <div className='w-[185px] sm:w-[250px] min-h-[185px] sm:min-h-[250px] flex flex-col items-center gap-3'></div>
            } */}

        </div>

        { 
            products?.length != productsCount &&  
            <MoreBotton
                skip={skip}
                setSkip={setSkip}
                limit={limit}
            />
        }


    </div>

  )
}

export default CollectionSection
