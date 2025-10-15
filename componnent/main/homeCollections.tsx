"use client";
import { backEndUrl } from '@/api';
import { CollectionType } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CollectionSection from './collectionSection';
import { useTheme } from '@/contexts/themeProvider';

const HomeCollections = () => {

    const [collections, setCollection] = useState<CollectionType[] | undefined>(undefined);
    const { colors } = useTheme();

    useEffect(() => {
        console.log({collections});
        
    }, [collections])

    useEffect(() => {
        
        const fetchData = async () => {

            await axios.get(backEndUrl + "/homeCollections")

            .then(({data}) => setCollection(data.homeCollections))
            .catch((err) => {
                console.log(err);
            })

        }

        fetchData();

    }, [])


    return (

        <div 
            className='w-full min-h-44'
            style={{
                backgroundColor: colors.light[200]
            }}
        >
        
            {collections?.map((collection) => (
                <CollectionSection
                    key={collection._id}
                    collection={collection}
                />
            ))}

        </div>

    )
}

export default HomeCollections;
