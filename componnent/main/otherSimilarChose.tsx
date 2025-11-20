import { CollectionType, CollectionWithProductsType, ProductType } from '@/types'
import React, { useEffect, useState } from 'react'
import ProductsSection from './productsSection'
import axios from 'axios'
import { backEndUrl } from '@/api'
import { collectionsLoading } from '@/constent/data'

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

    useEffect(() => {
        collectinsWithProducts.map(col => 
            col.products.length > 0 && setIsThereProducts(true)
        )
    }, [])

    // useEffect(() => {
    //     const fetchData = async () => {
    //         await axios.get(backEndUrl + "/getCollectionsByProduct", {
    //             params: { productId: product._id }
    //         })
    //         .then(({ data }) => {
    //             setCollections(data.collections)
    //         })
    //         .catch(( err ) => {
    //             throw err;
    //         })
    //     }
    //     fetchData();
    // }, [product])

    // useEffect(() => {

    //     const fetchData = async () => {
            

    //             // isFirstRender && setProducts(productsLoading);

    //             if (loading) return;
                
    //             setLoading(true);

    //             Promise.all((collections.map( async collection => {
    //                 if (collection._id?.length && collection._id?.length < 3) return setCollectinsWithProducts(collectionsLoading);

    //                 await axios.get(backEndUrl + "/getProductsByCollection", { params: { 
    //                     collectionId: collection._id, 
    //                     limit, 
    //                     skip 
    //                 }})

    //                 .then(({data}) => {

    //                     !isFirstRender && data.products ?
    //                         setProducts([...products, ...data.products]) : 
    //                         setProducts(data.products);

    //                     setProductsCount(data.productsCount);
    //                     setIsFirstRender(false);
    //                     setLoading(false);
                        
    //                 })
    //                 .catch((err) => {
    //                     console.log(err);
    //                 })
    //             })))

    //     }

    //     fetchData();

    // }, [collection, skip])

    if (
        collections.length < 1 
        // || !isThereProducts
    ) return <div className='bg-red-400'>{isThereProducts}</div>

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>


        {isThereProducts && <h2 className='text-lg sm:text-xl font-semibold pb-5 sm:pb-10'>You may like : </h2>}

        <div className='w-full h-full flex justify-center items-center overflow-scroll- scrollbar-hidden'>
            {
                collections.map((collection) => (
                    <ProductsSection
                        key={collection._id}
                        collection={collection}
                        autoScroll={false}
                        product={product}
                        isThereProducts={isThereProducts}
                        setIsThereProducts={setIsThereProducts}
                        tittleStyle={{
                            fontSize: "15px",
                            display: 'none'
                        }}
                    />
                ))
            }
        </div>


        {/* لهنا مش يكون فما اقتراحات مشابهة */}

    </div>
  )
}

export default OtherSimilarChose
