import { CollectionType, ProductType } from '@/types'
import React, { useEffect, useState } from 'react'
import ProductsSection from './productsSection'
import axios from 'axios'
import { backEndUrl } from '@/api'

type OtherSimilarChoseType = {
    product: ProductType
}

const OtherSimilarChose = ({
    product
}: OtherSimilarChoseType) => {

    const [collections, setCollections] = useState<CollectionType[]>([]);
    const [limit, setLimit] = useState<number>(5);
    const [skip, setSkip] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(backEndUrl + "/getCollectionsByProduct", {
                params: { productId: product._id }
            })
            .then(({ data }) => {
                setCollections(data.collections)
            })
            .catch(( err ) => {
                throw err;
            })
        }
        fetchData();
    }, [product])



  return (
    <div className='w-full h-[500px] flex justify-center items-center'>
      {/* {
        collections.map((collection) => (
            <ProductsSection
                key={collection._id}
                collection={collection}
            />
        ))
      } */}
    </div>
  )
}

export default OtherSimilarChose
