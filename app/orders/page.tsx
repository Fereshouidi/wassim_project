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
import { skip } from 'node:test';
import React, { useEffect, useState } from 'react'

const OrdersPage = () => {


    const { setLoadingScreen } = useLoadingScreen();
    const { activeLanguage } = useLanguage();
    const { screenWidth, screenHeight } = useScreen();
    const { colors } = useTheme();


    const  [pendingOrdersCount, setPendingOrdeCount ] = useState<number>(0);
    const  [failedOrdersCount, setFailedgOrdeCount ] = useState<number>(0);
    const  [deliveredOrdersCount, setdeliveredOrdeCount ] = useState<number>(0);

    const [limit, setLimit] = useState<number>(10);

    const [pendingSkip, setPendingSkip] = useState<number>(limit);
    const [failedSkip, setFailedSkip] = useState<number>(limit);
    const [deliveredSkip, setDeliveredSkip] = useState<number>(limit);

                    
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
                limit
            }})
            .then(({ data }) => {
                console.log({data});
                
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

    const getMorePendingOrder = async () => {

        setLoadingScreen(true);

        await axios.get( backEndUrl + "/getOrdersByClientAndStatus", {
            params: {
                clientId: client?._id,
                status: "pending",
                limit,
                skip: pendingSkip
            }
        })
        .then(({ data }) => {
            setOrders({
                ...orders,
                pendingOrders: [
                    ...data.orders
                ]
            })
            setPendingSkip(pendingSkip + limit);
        })
        .catch(( err ) => {
            console.log({err});
        })
        setLoadingScreen(false);
    }

    const getMoreFailedOrder = async () => {

        setLoadingScreen(true);

        await axios.get( backEndUrl + "/getOrdersByClientAndStatus", {
            params: {
                clientId: client?._id,
                status: "failed",
                limit,
                skip: failedSkip
            }
        })
        .then(({ data }) => {
            setOrders({
                ...orders,
                failedOrders: [
                    // ...orders.failedOrders,
                    ...data.orders
                ]
            })
            setFailedSkip(failedSkip + limit);
        })
        .catch(( err ) => {
            console.log({err});
        })

        setLoadingScreen(false);
    }

    const getMoreDeliveredOrder = async () => {

        setLoadingScreen(true);

        await axios.get( backEndUrl + "/getOrdersByClientAndStatus", {
            params: {
                clientId: client?._id,
                status: "delivered",
                limit,
                skip: deliveredSkip
            }
        })
        .then(({ data }) => {
            setOrders({
                ...orders,
                deliveredOrders: [
                    // ...orders.deliveredOrders,
                    ...data.orders
                ]
            })
            setDeliveredSkip(deliveredSkip + limit);
        })
        .catch(( err ) => {
            console.log({err});
        })

        setLoadingScreen(false);
    }


    const getLessPendingOrders = async () => {

        if (pendingSkip <= limit) return;

        const newSkip = pendingSkip - limit;

        setLoadingScreen(true);
        try {
            const { data } = await axios.get(backEndUrl + "/getOrdersByClientAndStatus", {
                params: {
                    clientId: client?._id,
                    status: "pending",
                    limit,
                    skip: newSkip - limit
                }
            });

            setOrders({
                ...orders,
                pendingOrders: data.orders
            });
            setPendingSkip(newSkip);
        } catch (err) {
            console.log({ err });
        } finally {
            setLoadingScreen(false);
        }
    };

    const getLessFailedOrders = async () => {

        if (failedSkip <= limit) return;

        const newSkip = failedSkip - limit;

        setLoadingScreen(true);
        try {
            const { data } = await axios.get(backEndUrl + "/getOrdersByClientAndStatus", {
                params: {
                    clientId: client?._id,
                    status: "failed",
                    limit,
                    skip: newSkip - limit
                }
            });

            setOrders({
                ...orders,
                failedOrders: data.orders
            });
            setFailedSkip(newSkip);
        } catch (err) {
            console.log({ err });
        } finally {
            setLoadingScreen(false);
        }
    };

    const getLessDeliveredOrders = async () => {

        if (deliveredSkip <= limit) return;

        const newSkip = deliveredSkip - limit;

        setLoadingScreen(true);
        try {
            const { data } = await axios.get(backEndUrl + "/getOrdersByClientAndStatus", {
                params: {
                    clientId: client?._id,
                    status: "delivered",
                    limit,
                    skip: newSkip - limit
                }
            });

            setOrders({
                ...orders,
                deliveredOrders: data.orders
            });
            setDeliveredSkip(newSkip);
        } catch (err) {
            console.log({ err });
        } finally {
            setLoadingScreen(false);
        }
    };
  
    if (!ownerInfo) return;

    return (
        <div
            className='page min-h-screen-'
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
            className='pageContent w-full h-full min-h-[100vh]- flex flex-col justify-center- items-center'
            style={{
                // maxHeight: screenHeight - headerHeight + "px",
                backgroundColor: colors.light[100],
                color: colors.dark[200]
            }}>
                {
                    screenWidth > 1200 ?
                        <OrdersSectionForLargeScreens
                            orders={orders}
                            pendingOrdersCount={pendingOrdersCount}
                            failedOrdersCount={failedOrdersCount}
                            deliveredOrdersCount={deliveredOrdersCount}
                            limit={limit}
                            pendingOrdersSkip={pendingSkip}
                            failedOrdersSkip={failedSkip}
                            deliveredOrdersSkip={deliveredSkip}
                            getMorePendingOrder={getMorePendingOrder}
                            getMoreFailedOrder={getMoreFailedOrder}
                            getMoreDeliveredOrder={getMoreDeliveredOrder}
                            getLessPendingOrders={getLessPendingOrders}
                            getLessFailedOrders={getLessFailedOrders}
                            getLessDeliveredOrders={getLessDeliveredOrders}
                        />
                    :   <OrdersSectionForSmallScreens
                            orders={orders}
                            pendingOrdersCount={pendingOrdersCount}
                            failedOrdersCount={failedOrdersCount}
                            deliveredOrdersCount={deliveredOrdersCount}
                            limit={limit}
                            pendingOrdersSkip={pendingSkip}
                            failedOrdersSkip={failedSkip}
                            deliveredOrdersSkip={deliveredSkip}
                            getMorePendingOrder={getMorePendingOrder}
                            getMoreFailedOrder={getMoreFailedOrder}
                            getMoreDeliveredOrder={getMoreDeliveredOrder}
                            getLessPendingOrders={getLessPendingOrders}
                            getLessFailedOrders={getLessFailedOrders}
                            getLessDeliveredOrders={getLessDeliveredOrders}
                        />
                }
          </div>

            <Footer/>
            
        </div>
    )
}

export default OrdersPage
