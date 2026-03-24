import { CollectionType, CollectionWithProductsType, ProductType } from '@/types'
import React, { useEffect, useState } from 'react'
import ProductsSection from './productsSection'
import axios from 'axios'
import { backEndUrl } from '@/api'
import { collectionsLoading } from '@/constent/data'
import { useLanguage } from '@/contexts/languageContext'

type OtherSimilarChoseType = {
    collections: CollectionType[]
    product: ProductType
}

const OtherSimilarChose = ({
    collections,
    product
}: OtherSimilarChoseType) => {

    const [collectinsWithProducts, setCollectinsWithProducts] = useState<CollectionWithProductsType[]>([]);
    const [isThereProducts, setIsThereProducts] = useState<boolean>(false);
    const [limit, setLimit] = useState<number>(5);
    const [skip, setSkip] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const { activeLanguage } = useLanguage();

    useEffect(() => {
        collectinsWithProducts.map(col => {
            col.products.length > 0 && setIsThereProducts(true)
        })
    }, [])


    if (
        collections.length < 1 
    ) return <div className='bg-red-400'>{isThereProducts}</div>

  return (
    <div className='w-full h-full flex flex-col justify-center items-center mb-10'>


        {isThereProducts && <h2 className='text-lg sm:text-xl font-semibold pb-5 sm:pb-10'>{activeLanguage.youMayLike} : </h2>}

        <div className='w-full h-full flex flex-col justify-center items-center overflow-scroll- scrollbar-hidden'>
            {
                collections.map((collection) => (
                    <div 
                        className='w-full my-1'
                        key={collection._id}
                    >
                        <ProductsSection
                            collection={collection}
                            autoScroll={false}
                            product={product}
                            isThereProducts={isThereProducts}
                            setIsThereProducts={setIsThereProducts}
                            tittleStyle={{
                                fontSize: "15px",
                                display: 'none'
                            }}
                            useLike={true}
                        />
                    </div>
                ))
            }
        </div>


        {/* لهنا مش يكون فما اقتراحات مشابهة */}

    </div>
  )
}

export default OtherSimilarChose



