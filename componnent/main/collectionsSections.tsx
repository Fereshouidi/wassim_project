import { backEndUrl } from '@/api';
import { useLanguage } from '@/contexts/languageContext';
import { CollectionType } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CollectionCard from '../sub/collectionCard';

const CollectionsSections = () => {

    const { activeLanguage } = useLanguage();
    const [collections, setCollections] = useState<CollectionType[] | undefined>(undefined);

    useEffect(() => {

        const fetchData = async () => {
            await axios.get(backEndUrl + "/getPublicCollections")
            .then(({ data }) => {
                setCollections(data.publicCollections)
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
    <div className='w-full flex flex-col items-center sm:p-10'>
      
      <h4 className='text-2xl sm:text-4xl py-5'>{activeLanguage.nav.collection}</h4>

      <div className='w-full flex flex-wrap justify-center sm:justify-start gap-5 sm:p-10'>

        {collections?.map((collection) => (

            <CollectionCard
                key={collection._id}
                collection={collection}
            />

        ))}

      </div>

    </div>
  )
}

export default CollectionsSections;
