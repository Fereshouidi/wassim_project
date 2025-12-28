"use client";
import { backEndUrl } from '@/api';
import Footer from '@/componnent/main/footer';
import Header from '@/componnent/main/header';
import SideBar from '@/componnent/main/sideBar';
import AnnouncementBar from '@/componnent/sub/AnnouncementBar';
import ProductCard from '@/componnent/sub/productCard';
import { useClient } from '@/contexts/client';
import { useLanguage } from '@/contexts/languageContext';
import { useLoadingScreen } from '@/contexts/loadingScreen';
import { useOwner } from '@/contexts/ownerInfo';
import { OwnerInfoType, ProductType } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const FavoritePage = () => {


    const { setLoadingScreen } = useLoadingScreen();
    const { activeLanguage } = useLanguage();
    const [products, setProducts] = useState<ProductType[]>([]);
    const { client } = useClient();
    const { ownerInfo } = useOwner();
    const [sideBarActive, setSideBarActive] = useState(false);


    useEffect(() => {
        const fetchData = async () => {

            if (!client?._id) return;

            setLoadingScreen(true);

            await axios.get(backEndUrl + "/getFavoriteProductsByClient", { params : {
                clientId: client?._id
            }})
            .then(({ data }) => setProducts(data.products))
            .catch((err) => {
                throw err
            })

            setLoadingScreen(false);
        }
        fetchData();
    }, [client?._id])

    useEffect(() => {
        // setLoadingScreen(false);
    }, [])
  
    if (!ownerInfo) return;

    return (
        <div
            className='page'
        >

          <AnnouncementBar/>
          <Header
            isSideBarActive={sideBarActive}
            setIsSideBarActive={setSideBarActive}
            ownerInfo={ownerInfo}
            setOwnerInfo={() => {}}
          />
          <SideBar
            isActive={sideBarActive}
            setIsActive={setSideBarActive}
            ownerInfo={ownerInfo}
            setOwnerInfo={() => {}}
          />
            

          <div className='pageContent min-h-[100vh] flex flex-col items-center'>
          
                <h2 className='mt-10 text-xl sm:text-2xl'>{`${activeLanguage.myFavorites} (${products.length})`}</h2>

                <div className='w-full flex flex-wrap justify-center gap-5 py-10 sm:py-12 sm:p-10'>
                    {products.map((product, index) => (
                        <ProductCard 
                            key={index}
                            product={product}
                            className={`w-[175px] sm:w-[250px]`}
                        />
                    ))}
                </div>
          </div>


            <Footer/>
            
        </div>
    )
}

export default FavoritePage
