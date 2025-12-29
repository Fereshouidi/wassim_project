"use client";
import { backEndUrl } from '@/api';
import FilterBar from '@/componnent/main/filterBar';
import Footer from '@/componnent/main/footer';
import Header from '@/componnent/main/header';
import SideBar from '@/componnent/main/sideBar';
import LoadingScreen from '@/componnent/sub/loading/loadingScreen';
import MoreBotton from '@/componnent/sub/moreBotton';
import ProductCard from '@/componnent/sub/productCard';
import { filterBarHeight } from '@/constent';
import { useLanguage } from '@/contexts/languageContext';
import { useLoadingScreen } from '@/contexts/loadingScreen';
import { useOwner } from '@/contexts/ownerInfo';
import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { CollectionType, FiltrationType, OwnerInfoType, ProductSpecification, ProductType, PubType } from '@/types';
import axios from 'axios';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {

  const params = useSearchParams();
  const filter = params.get('filter');
  const searchText = params.get('searchInput');
  const [sideBarActive, setSideBarActive] = useState<boolean>(false);
  const { colors, activeTheme } = useTheme();
  const {activeLanguage } = useLanguage();
  const [pub, setPub] = useState<PubType | undefined>(undefined);
  const { screenWidth } = useScreen();
  // const [ownerInfo, setOwnerInfo] = useState<OwnerInfoType | undefined>(undefined);
  const { ownerInfo, setOwnerInfo } = useOwner();

  const [mostProductExpensive, setMostProductExpensive] = useState<ProductType | undefined>(undefined);
  const [availableColors, setAvailableColors] = useState<string[]>(["all"]);
  const [availableSizes, setAvailableSizes] = useState<string[]>(["all"]);
  const [availableTypes, setAvailableTypes] = useState<string[]>(["all"]);
  const [allCollections, setAllCollections] = useState<CollectionType[]>([]);

  const [productsFound, setProductsFound] = useState<ProductType[]>([]);
  const [productsCount, setProductsCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(8);
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [storedSearchText, setStoredSearchText] = useState<string>('');
  const [firstRender, setFirstRender] = useState<boolean>(true);
  const { setLoadingScreen } = useLoadingScreen();

  


  const [filtration, setFiltration] = useState<FiltrationType | undefined>(undefined);
  // const [filtrationCopy, setFiltrationCopy] = useState<FiltrationType>(filtration);

  const [filteBarActive, setFilterBarActive] = useState<boolean>(false);


  useEffect(() => {

    console.log({searchText});
    
    if (!filtration) return;
    
    const fetchProductsBySearch = async () => {
      setLoadingScreen(true);
      await axios.post( backEndUrl + "/getProductsBySearch", {
        searchText: searchText?? '',
        limit,
        skip: 0,
        filtration
      })
      .then(({ data }) => {

        // if (firstRender && filter) return setFirstRender(false);

        console.log(data.availableColors);
        

        setProductsFound(data.products);
        setProductsCount(data.productsCount);
        setAvailableColors(data.availableColors);
        setAvailableSizes(data.availableSizes);
        setAvailableTypes(data.availableTypes);
        setSkip(0);
        setLoadingScreen(false);

      })
      .catch(( err ) => {
        setLoadingScreen(false);
        throw err;
      })
    }

    fetchProductsBySearch();
    // localStorage.setItem('searchFilter', JSON.stringify(filtration));
    // localStorage.setItem('searchText', searchText);
    
  }, [filtration, searchText])

  // useEffect(() => {console.log("Component rendered 2");

  //   if (!filtration || skip < limit ) return;
    
  //   const fetchProductBySearch = async () => {
  //     setLoading(true);
  //     await axios.post( backEndUrl + "/getProductsBySearch", {
  //       searchText,
  //       limit,
  //       skip,
  //       filtration
  //     })
  //     .then(({ data }) => {
  //       setProductsFound([...productsFound, ...data.products]);
  //       setProductsCount(data.productsCount);
  //       setAvailableColors(data.availableColors);
  //       setAvailableSizes(data.availableSizes);
  //       setAvailableTypes(data.availableTypes);
  //       setLoading(false);
  //     })
  //     .catch(( err ) => {
  //       setLoading(false);
  //       throw err;
  //     })
  //   }
  //   fetchProductBySearch();
    
  // }, [skip])

  const getMore = async () => {

    if (!filtration || skip < limit ) return;
    
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
    
  }

  useEffect(() => {console.log("Component rendered");

    const fetchDefaultFiltration = async () => {

      await axios.get(backEndUrl + '/getMostProductExpensive')
      .then(({ data }) => {
        setMostProductExpensive(data.product)
      })
      .catch( (err) => {throw err})

      await axios.get(backEndUrl + '/getAllCollections')
      .then(({ data }) => {
        setAllCollections(data.allCollections.filter( (col: CollectionType) => col.type == "public"));
      })
      .catch( (err) => {throw err})

    }
    
    fetchDefaultFiltration();


  }, [])

  useEffect(() => {
    
    if (filter) {
      setFiltration(JSON.parse(decodeURIComponent(filter)))
    } else {

      alert('hhhh')
      setFiltration({
          price: {
              from: 0,
              to: mostProductExpensive?.specifications[0].price ?? 100
          },
          collections: allCollections.map(collection => (collection._id?? '')),
          colors: availableColors,
          types: availableTypes,
          sizes: availableTypes,

          sortBy: "date",
          sortDirection: "asc",
          activeLanguage: activeLanguage.language
      
      })

    }

  }, [mostProductExpensive, allCollections])

  useEffect(() => {
    setLoadingScreen(false);
  }, [])

  if (!ownerInfo) return <LoadingScreen/>

  return (
    <div 
      className='page flex flex-col items-center '
      style={{
        backgroundColor: colors.light[100]
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
        mostProductExpensive?.price && 

        <FilterBar
          filtration={filtration}
          setFiltration={setFiltration}
          mostProductExpensive={mostProductExpensive.price}
          productsCount={productsCount}
          allCollections={allCollections}
          availableColors={availableColors}
          availableSizes={availableSizes}
          availableTypes={availableTypes}
          searchText={searchText?? ''}
          importedFrom='searchPage'
          filteBarActive={filteBarActive}
          setFilterBarActive={setFilterBarActive}
        />

      }

        <div 
          className='w-full min-h-screen relative sm:px-24 flex flex-col justify-center- items-center'
          style={{
            backgroundColor: colors.light[100]
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
                    getMore={getMore}
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
