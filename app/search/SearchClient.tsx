"use client";
import { backEndUrl } from '@/api';
import FilterBar from '@/componnent/main/filterBar';
import Footer from '@/componnent/main/footer';
import Header from '@/componnent/main/header';
import SideBar from '@/componnent/main/sideBar';
import MoreBotton from '@/componnent/sub/moreBotton';
import ProductCard from '@/componnent/sub/productCard';
import { filterBarHeight } from '@/constent';
import { useLanguage } from '@/contexts/languageContext';
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
  const { colors, activeTheme } = useTheme();
  const {activeLanguage } = useLanguage();
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
  const [limit, setLimit] = useState<number>(10);
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [storedSearchText, setStoredSearchText] = useState<string>('');


  const [filtration, setFiltration] = useState<FiltrationType | undefined>(undefined);


  useEffect(() => {

    if (!searchText || !filtration) return;
    
    const fetchProductBySearch = async () => {
      setLoading(true);
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
        setLoading(false);
      })
      .catch(( err ) => {
        setLoading(false);
        throw err;
      })
    }

    fetchProductBySearch();
    localStorage.setItem('searchFilter', JSON.stringify(filtration));
    localStorage.setItem('searchText', searchText);
    
  }, [filtration, searchText])

  useEffect(() => {console.log("Component rendered");

    if (!searchText || !filtration) return;
    
    const fetchProductBySearch = async () => {
      setLoading(true);
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
        setLoading(false);
      })
      .catch(( err ) => {
        setLoading(false);
        throw err;
      })
    }
    fetchProductBySearch();
    
  }, [skip])

  useEffect(() => {console.log("Component rendered");

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

    // const savedFilter = localStorage.getItem("searchFilter");

    // alert(savedFilter)
    // if (savedFilter) return setFiltration(JSON.parse(savedFilter))

    setFiltration({
        price: {
            from: 0,
            to: mostProductExpensive?.specifications[0].price ?? 100
        },
        collections: allCollections.map(collection => (collection._id?? '')),
        colors: availableColors,
        types: availableTypes,
        sizes: availableTypes,

        sortBy: {
            price: "asc",
            name: "asc",
            date: "asc"
        }
    
    })
  }, [mostProductExpensive, allCollections])

  useEffect(() => {console.log("Component rendered");
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

    // const storedSearchText = localStorage.getItem('searchText');
    // // setStoredSearchText(storedSearchText);
    // if (storedSearchText != searchText) 
      
      // localStorage.removeItem("searchFilter");
    
  }, [searchText ])

    useEffect(() => {
    console.log({ownerInfo});
    
  }, [ownerInfo])

  return (
    <div 
      className='page flex flex-col items-center '
      style={{
        backgroundColor: colors.light[150]
      }}
    >
      <Header
        isSideBarActive={sideBarActive}
        setIsSideBarActive={setSideBarActive}
        ownerInfo={ownerInfo}
        setOwnerInfo={setOwnerInfo}
        searchInput={searchText}
        style={{
          // boxShadow: 'none'
        }}
      />

      {
        filtration && 
        mostProductExpensive?.specifications[0].price && 

        <FilterBar
          filtration={filtration}
          setFiltration={setFiltration}
          mostProductExpensive={mostProductExpensive.specifications[0].price}
          productsCount={productsCount}
          allCollections={allCollections}
          availableColors={availableColors}
          availableSizes={availableSizes}
          availableTypes={availableTypes}
          searchText={searchText?? ''}
        />

      }

        <div 
          className='w-full min-h-screen relative sm:px-24 flex flex-col justify-center- items-center'
          style={{
            // paddingTop: filterBarHeight + 'px'
          }}
        >


            <div className='w-full h-full flex flex-wrap justify-center gap-2 sm:gap-10 py-2 '>

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
                    isLoading={loading}
                /> 

        }

      {/* <div className='w-full min-h-screen'>
        {collectionId}
        <p>{searchText}</p>
      </div> */}

      <div className='h-10'></div>

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
