"use client";
import { backEndUrl } from '@/api';
import { CollectionType } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ProductsSection from './productsSection';
import { useTheme } from '@/contexts/themeProvider';
import { collectionsLoading } from '@/constent/data';

const HomeCollections = () => {

    const [collections, setCollections] = useState<CollectionType[] | undefined>(collectionsLoading);
    const { colors } = useTheme();
    const [isThereProducts, setIsThereProducts] = useState<boolean>(false);


    useEffect(() => {
        
        const fetchData = async () => {

            await axios.get(backEndUrl + "/homeCollections")

            .then(({data}) => setCollections(data.homeCollections))
            .catch((err) => {
                console.log(err);
            })

        }

        fetchData();

    }, [])

    useEffect(() => {
        // alert(collections?.length)
    }, [collections?.length])


    if (collections?.length === 0) return null;

    return (

        <div 
            className='w-full'
            style={{
                // backgroundColor: colors.light[250]
            }}
        >
        
            {collections?.map((collection, index) => (
                <ProductsSection
                    key={index}
                    collection={collection}
                    autoScroll={true}
                    isThereProducts={isThereProducts}
                    setIsThereProducts={setIsThereProducts}
                    useLike={false}
                />
            ))}

        </div>

    )
}

export default HomeCollections;
