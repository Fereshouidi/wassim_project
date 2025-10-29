"use client";
import { backEndUrl } from '@/api';
import FilterBar from '@/componnent/main/filterBar';
import Footer from '@/componnent/main/footer';
import Header from '@/componnent/main/header';
import SideBar from '@/componnent/main/sideBar';
import MoreBotton from '@/componnent/sub/moreBotton';
import ProductCard from '@/componnent/sub/productCard';
import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { CollectionType, FiltrationType, OwnerInfoType, ProductSpecification, ProductType, PubType } from '@/types';
import axios from 'axios';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {

  const params = useSearchParams();
  const collectionId = params.get('collectionId');
  const searchText = params.get('searchInput');
  const [sideBarActive, setSideBarActive] = useState<boolean>(false);
  const { colors } = useTheme();
  const [pub, setPub] = useState<PubType | undefined>(undefined);
  const { screenWidth } = useScreen();
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfoType | undefined>(undefined);

  const [mostProductExpensive, setMostProductExpensive] = useState<ProductType | undefined>(undefined);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [allCollections, setAllCollections] = useState<CollectionType[]>([]);

  const [productsFound, setProductsFound] = useState<ProductType[]>([]);
  const [productsCount, setProductsCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [skip, setSkip] = useState<number>(0);


  const [filtration, setFiltration] = useState<FiltrationType | undefined>(undefined);

  useEffect(() => {
    console.log({productsFound});
    
  }, [productsFound])

  useEffect(() => {
    console.log({allCollections});
    
  }, [mostProductExpensive && allCollections])

  useEffect(() => {

    if (!searchText || !filtration) return;
    
    const fetchProductBySearch = async () => {
      await axios.post( backEndUrl + "/getProductsBySearch", {
        searchText,
        limit,
        skip: 0,
        filtration
      })
      .then(({ data }) => {
        setProductsFound(data.products);
        setProductsCount(data.productsCount);
        setAvailableColors(data.availableColors);
        setAvailableSizes(data.availableSizes);
        setAvailableTypes(data.availableTypes);

      })
      .catch(( err ) => {
        throw err;
      })
    }
    fetchProductBySearch();
    
  }, [filtration, searchText])

  useEffect(() => {

    if (!searchText || !filtration) return;
    
    const fetchProductBySearch = async () => {
      await axios.post( backEndUrl + "/getProductsBySearch", {
        searchText,
        limit,
        skip,
        filtration
      })
      .then(({ data }) => {
        setProductsFound([...productsFound, ...data.products]);
        setProductsCount(data.productsCount);
        setAvailableColors(data.availableColors);
        setAvailableSizes(data.availableSizes);
        setAvailableTypes(data.availableTypes);

      })
      .catch(( err ) => {
        throw err;
      })
    }
    fetchProductBySearch();
    
  }, [skip])

  useEffect(() => {
    console.log({availableColors, availableSizes, availableTypes});
    console.log({filtration});
    
    
  }, [availableColors, availableSizes, availableTypes, filtration])

  useEffect(() => {
    const fetchDefaultFiltration = async () => {

      await axios.get(backEndUrl + '/getMostProductExpensive')
      .then(({ data }) => {
        setMostProductExpensive(data.product)
        // setFiltration({
        //   ...filtration, 
        //   price: {
        //     ...filtration.price,
        //     to: data.product.specifications[0].price
        //   }
        // })
      })
      .catch( (err) => {throw err})

      await axios.get(backEndUrl + '/getAllCollections')
      .then(({ data }) => {
        setAllCollections(data.allCollections);
      })
      .catch( (err) => {throw err})

    }
    
    fetchDefaultFiltration();


  }, [])

  useEffect(() => {
    setFiltration({
        price: {
            from: 0,
            to: mostProductExpensive?.specifications[0].price ?? 9999999999
        },
        collections: allCollections,
        colors: availableColors,
        types: availableTypes,
        sizes: availableTypes,

        Ranking: {
            price: "asc",
            name: "asc",
            date: "asc"
        }
    
    })
  }, [mostProductExpensive, allCollections])

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(backEndUrl + "/getOwnerInfo")
      .then(({ data }) => setOwnerInfo(data.ownerInfo))
      .catch((err) => {
        throw err
      })
    }
    fetchData();
  }, [])

  useEffect(() => {

  }, [searchText ])

    useEffect(() => {
    console.log({ownerInfo});
    
  }, [ownerInfo])

  return (
    <div className='page flex flex-col items-center'>
      <Header
        isSideBarActive={sideBarActive}
        setIsSideBarActive={setSideBarActive}
        ownerInfo={ownerInfo}
        setOwnerInfo={setOwnerInfo}
        searchInput={searchText}
      />

      {
        filtration && 
        mostProductExpensive?.specifications[0].price && 

        <FilterBar
          filtration={filtration}
          setFiltration={setFiltration}
          mostProductExpensive={mostProductExpensive.specifications[0].price}
          productsCount={productsCount}
        />

      }

        <div className='w-full sm:px-24 flex flex-col justify-center items-center overflow-scroll'>

            <div className='w-full flex flex-wrap justify-center gap-2 sm:gap-10'>

                {
                    productsFound?.map((product, index) => (
                        <ProductCard
                            key={index}
                            product={product}
                            className="w-[185px] sm:w-[250px] min-h-[185px] sm:min-h-[250px] my-3"
                        />
                    ))
                }

            </div>
        </div>

        { 
            productsFound?.length != productsCount &&  

                <MoreBotton
                    skip={skip}
                    setSkip={setSkip}
                    limit={limit}
                    isLoading={false}
                /> 

        }

      <div className='w-full min-h-screen'>
        {collectionId}
        <p>{searchText}</p>
      </div>

      <Footer/>

        
      <SideBar
        isActive={sideBarActive}
        setIsActive={setSideBarActive}
        ownerInfo={ownerInfo}
        setOwnerInfo={setOwnerInfo}
      />

    </div>
  )
}

export default Page
