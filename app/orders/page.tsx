"use client";
import { backEndUrl } from '@/api';
import Footer from '@/componnent/main/footer';
import Header from '@/componnent/main/header';
import OrdersSectionForLargeScreens from '@/componnent/main/ordersSection/largeScreens';
import OrdersSectionForSmallScreens from '@/componnent/main/ordersSection/smallScreen';
import SideBar from '@/componnent/main/sideBar';
import AnnouncementBar from '@/componnent/sub/AnnouncementBar';
import ProductCard from '@/componnent/sub/productCard';
import { headerHeight } from '@/constent';
import { useClient } from '@/contexts/client';
import { useLanguage } from '@/contexts/languageContext';
import { useLoadingScreen } from '@/contexts/loadingScreen';
import { useOwner } from '@/contexts/ownerInfo';
import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { OrdersByStatusType, OrderType, OwnerInfoType, ProductType } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const OrdersPage = () => {


    const { setLoadingScreen } = useLoadingScreen();
    const { activeLanguage } = useLanguage();
    const { screenWidth, screenHeight } = useScreen();
    const { colors } = useTheme();


    const  [pendingOrdersCount, setPendingOrdeCount ] = useState<number>(0);
    const  [failedOrdersCount, setFailedgOrdeCount ] = useState<number>(0);
    const  [deliveredOrdersCount, setdeliveredOrdeCount ] = useState<number>(0);

                    
    const [ orders, setOrders ] = useState<OrdersByStatusType>({
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
            className='page min-h-screen'
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

          <div 
            className='pageContent w-full min-h-[100vh]- flex flex-col justify-center- items-center'
            style={{
                // maxHeight: screenHeight - headerHeight + "px",
                backgroundColor: colors.light[100],
                color: colors.dark[200]
            }}>
                {
                    screenWidth > 1200 ?
                        <OrdersSectionForLargeScreens
                            orders={orders}
                        />
                    :   <OrdersSectionForSmallScreens
                            orders={orders}
                        />
                }
          </div>

            <Footer/>
            
        </div>
    )
}

export default OrdersPage
