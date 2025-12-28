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


    return (

        <div 
            className='w-full'
            style={{
                // backgroundColor: colors.light[250]
            }}
        >
        
            {collections?.map((collection) => (
                <ProductsSection
                    key={collection._id}
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
