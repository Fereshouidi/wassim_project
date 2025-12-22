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
import { OrderType, OwnerInfoType, ProductType } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const OrdersPage = () => {


    const { setLoadingScreen } = useLoadingScreen();
    const { activeLanguage } = useLanguage();

    const  [pendingOrdersCount, setPendingOrdeCount ] = useState<number>(0);
    const  [failedOrdersCount, setFailedgOrdeCount ] = useState<number>(0);
    const  [deliveredOrdersCount, setdeliveredOrdeCount ] = useState<number>(0);

                    
    const [ orders, setOrders ] = useState<{
            pendingOrders: OrderType[],
            failedOrders: OrderType[],
            deliveredOrders: OrderType[]
    }>({
        pendingOrders: [],
        failedOrders: [],
        deliveredOrders: []
    });

    const { client } = useClient();
    const { ownerInfo } = useOwner();
    const [sideBarActive, setSideBarActive] = useState(false);


    useEffect(() => {
        const fetchData = async () => {

            if (!client?._id) return;

            setLoadingScreen(true);

            await axios.get(backEndUrl + "/getInationalOrdeByClient", { params : {
                clientId: client?._id,
                limit: 10
            }})
            .then(({ data }) => {
                setOrders(data.orders)
                setPendingOrdeCount(data.pendingOrdersCount);
                setFailedgOrdeCount(data.failedOrdersCount);
                setdeliveredOrdeCount(data.deliveredOrdersCount);
            })
            .catch((err) => {
                throw err
            })

            setLoadingScreen(false);
        }
        fetchData();
    }, [client?._id])

    useEffect(() => {
        console.log({orders})
    }, [orders])
  
    if (!ownerInfo) return;

    return (
        <div
            className='page flex flex-col items-center'
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

          <div className='pageContent  min-h-[100vh]'>

          </div>
{/*             
            <h2 className='mt-10 text-2xl sm:text-3xl'>{`${activeLanguage.myOrders} (${products.length})`}</h2>

            <div className='w-full flex flex-wrap justify-center gap-5 py-10 sm:py-12 sm:p-10'>
                {products.map((product, index) => (
                    <ProductCard 
                        key={index}
                        product={product}
                        className={`w-[175px] sm:w-[250px]`}
                    />
                ))}
            </div> */}

            <Footer/>
            
        </div>
    )
}

export default OrdersPage
