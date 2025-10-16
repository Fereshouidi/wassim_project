import { backEndUrl } from '@/api';
import { useLanguage } from '@/contexts/languageContext';
import { CollectionType } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CollectionCard from '../sub/collectionCard';
import { collectionsLoading } from '@/constent/data';

const CollectionsSections = () => {

    const { activeLanguage } = useLanguage();
    const [collections, setCollections] = useState<CollectionType[] | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {

        setCollections(collectionsLoading);

        const fetchData = async () => {
            setIsLoading(true);
            await axios.get(backEndUrl + "/getPublicCollections")
            .then(({ data }) => {
                setCollections(data.publicCollections);
                setIsLoading(false);
            })
            .catch((err) => {
                throw err;
            })
        }
        fetchData();

    }, [])

    // useEffect(() => {
    //     console.log({
    //         collections___: collections
    //     });
        
    // }, [collections])

    

  return (
    <div className='w-full flex flex-col items-center p-10 sm:p-10'>
      
      <h4 className='text-2xl sm:text-4xl py-5'>{activeLanguage.nav.collection}</h4>

      <div className='w-full flex flex-wrap justify-center sm:justify-start gap-5 sm:p-10'>

        {collections?.map((collection) => (

            <CollectionCard
                key={collection._id}
                collection={collection}
                isLoading={isLoading}
            />

        ))}

      </div>

    </div>
  )
}

export default CollectionsSections;
