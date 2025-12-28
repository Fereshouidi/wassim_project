import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { OrdersByStatusType, OrderType } from '@/types';
import React, { useState } from 'react'
import LoadingHomePage from '../main/loading/loadingHomePage';
import { LoaderIcon } from 'lucide-react';
import LoadingIcon from './loading/loadingIcon';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useLanguage } from '@/contexts/languageContext';

type props = {
    orders: OrderType[]
    activePage: "pending" | "failed" | "delivered"
    setActivePage: (value: "pending" | "failed" | "delivered") => void
    ordersCount: number
    totalOrdersCount: number
    limit: number,
    skip: number
    getMore: () => void
    getLess: () => void    
}
const OrdersSectionHeader = ({
    orders,
    activePage,
    setActivePage,
    ordersCount,
    totalOrdersCount,
    limit,
    skip,
    getMore,
    getLess
}: props) => {

    const { screenWidth } = useScreen();
    const [ cardsOpenedByDefault, setCardsOpenedByDefault ] = useState<boolean>(false);
    const { activeTheme, colors } = useTheme();
    const { activeLanguage } = useLanguage();

    const currentPage = Math.floor(skip / limit);
    const totalPages = Math.ceil(totalOrdersCount / limit) || 1;

    const [loadingLeftArrow, setLoadingLeftArrow] = useState<boolean>(false);
    const [loadingRightArrow, setLoadingRightArrow] = useState<boolean>(false);

    const handleLeftArrowClick = async () => {
        if (loadingLeftArrow) return;
        if (currentPage < 1) return
        await getLess()
    }

    const handleRigthArrowClick = async () => {
        if (loadingRightArrow) return;
        if (currentPage == totalPages) return;
        setLoadingRightArrow(true);
        await getMore()
        setLoadingRightArrow(false);
    }

    if (screenWidth < 1000) {
        return (
            <div className='w-full- h-[80px]- px-4 flex flex-col justify-between py-2 items-center gap-2 bg-red-500-'>

                <div className='flex gap-2'>

                    <div 
                        className='flex justify-center items-center text-[11px] sm:text-[13px] p-2 gap-2 duration-150'
                        onClick={() => setActivePage("pending")}
                        style={{
                        border: `0.5px solid ${colors.light[200]}`,
                        borderRadius: "10px 0px 10px 0px",
                        transform: activePage == "pending" ? 'scale(100%)' : 'scale(105%)',
                        boxShadow: activePage == "pending" ? "" : `2px 2px 5px ${colors.dark[900]}`,
                        backgroundColor: activePage == "pending" ? colors.dark[200] : colors.light[100],
                        color: activePage == "pending" ? colors.light[200] : colors.dark[100],
                        }}
                    >
                        <img 
                        src={activeTheme == "dark" || activePage == "pending" ? "/icons/pendingWhite.png": "/icons/pendingBlack.png"} 
                        className='w-3 h-3 sm:w-3 sm:h-3'
                        alt="" 
                        />
                        <h4>{activeLanguage.pending}</h4>
                    </div>
                    
                    <div 
                        className='flex justify-center items-center text-[11px] sm:text-[13px] p-2 gap-2 duration-150'
                        onClick={() => setActivePage("failed")}
                        style={{
                        border: `0.5px solid ${colors.light[200]}`,
                        borderRadius: "10px 0px 10px 0px",
                        transform: activePage == "failed" ? 'scale(100%)' : 'scale(105%)',
                        boxShadow: activePage == "failed" ? "" : `2px 2px 5px ${colors.dark[900]}`,
                        backgroundColor: activePage == "failed" ? colors.dark[200] : colors.light[100],
                        color: activePage == "failed" ? colors.light[200] : colors.dark[100],
                        }}
                    >
                        <img 
                        src={activeTheme == "dark" || activePage == "failed" ? "/icons/closeWhite.png" : "/icons/closeBlack.png"} 
                        className='w-2 h-2 sm:w-2 sm:h-2'
                        alt="" 
                        />
                        <h4>{activeLanguage.failed}</h4>
                    </div>
                
                    <div 
                        className='flex justify-center items-center text-[11px] sm:text-[13px] p-2 gap-2 duration-150'
                        onClick={() => setActivePage("delivered")}
                        style={{
                        border: `0.5px solid ${colors.light[200]}`,
                        borderRadius: "10px 0px 10px 0px",
                        transform: activePage == "delivered" ? 'scale(100%)' : 'scale(105%)',
                        boxShadow: activePage == "delivered" ? "" : `2px 2px 5px ${colors.dark[900]}`,
                        backgroundColor: activePage == "delivered" ? colors.dark[200] : colors.light[100],
                        color: activePage == "delivered" ? colors.light[200] : colors.dark[100],
                        }}
                    >
                        <img 
                        src={activeTheme == "dark" || activePage == "delivered" ? "/icons/checkWhite.png" : "/icons/checkBlack.png"} 
                        className='w-2 h-2 sm:w-2 sm:h-2'
                        alt="" 
                        />
                        <h4>{activeLanguage.delivered}</h4>
                    </div>

                </div>

                <div
                    className='w-full flex justify-between items-center my-2 mx-4- mt-7- text-[12px] sm:text-[14px]'
                    style={{
                        // fontSize: screenWidth > 1000 ? "14px" : "14px"
                    }}
                >
                    <h2>{
                        activePage == "pending" ? `${activeLanguage.pendingOrders} : (${totalOrdersCount})`
                        : activePage == "failed" ? `${activeLanguage.failedgOrders} : (${totalOrdersCount})`
                        : activePage == "delivered" ? `${activeLanguage.delivered} : (${totalOrdersCount})`
                        : null
                    }</h2>
                    <div className='pl-5 flex fkex-row justify-center items-center gap-4'>

                        <img 
                            src={
                                currentPage == 1 ? 
                                    "/icons/left-arrow-gary.png"
                                :
                                    activeTheme == "dark" ? "/icons/left-arrow-white.png" : "/icons/left-arrow-black.png"
                            }
                            className='w-3 h-3'
                            onClick={handleLeftArrowClick}
                        />       

                        <h4>{`${currentPage}/${totalPages}`}</h4>

                        <div className='w-3 h-3'>
                            {
                               loadingRightArrow ? 
                                <DotLottieReact
                                    src="/icons/LoadingDotsBlack.json"
                                    className='w-full h-full scale-[200%]'
                                    loop
                                    autoplay
                                /> 
                               :
                                <img 
                                    src={
                                        currentPage == totalPages ? 
                                            "/icons/right-arrow-gray.png"
                                        :
                                            activeTheme == "dark" ? "/icons/right-arrow-white.png" : "/icons/right-arrow-black.png"
                                    }
                                    className='w-full h-full'
                                    onClick={handleRigthArrowClick}
                                /> 
                            }
                        </div>
  

                    </div>

                </div>

            </div>

        )
    }

    return (
        <div className='w-full- h-[80px] flex justify-between items-center px-4'>
            <h2
                className=' mx-4- mt-7- text-[12px] sm:text-[14px]'
                style={{
                    // fontSize: screenWidth > 1000 ? "14px" : "14px"
                }}
            >
                {
                    activePage == "pending" ? `${activeLanguage.pendingOrders} : (${totalOrdersCount})`
                    : activePage == "failed" ? `${activeLanguage.failedgOrders} : (${totalOrdersCount})`
                    : activePage == "delivered" ? `${activeLanguage.deliveredOrders} : (${totalOrdersCount})`
                    : null
                }
            </h2>

            <div className='flex gap-5'>
                <div className='pl-5 flex fkex-row justify-center items-center gap-4'>

                    <img 
                        src={
                            currentPage == 1 ? 
                                "/icons/left-arrow-gary.png"
                            :
                                activeTheme == "dark" ? "/icons/left-arrow-white.png" : "/icons/left-arrow-black.png"
                        }
                        className='w-3 h-3 cursor-pointer'
                        onClick={handleLeftArrowClick}
                    />       

                    <h4>{`${currentPage}/${totalPages}`}</h4>

                    <div className='w-3 h-3 cursor-pointer'>
                        {
                            loadingRightArrow ? 
                            <DotLottieReact
                                src="/icons/LoadingDotsBlack.json"
                                className='w-full h-full scale-[200%]'
                                loop
                                autoplay
                            /> 
                            :
                            <img 
                                src={
                                    currentPage == totalPages ? 
                                        "/icons/right-arrow-gray.png"
                                    :
                                        activeTheme == "dark" ? "/icons/right-arrow-white.png" : "/icons/right-arrow-black.png"
                                }
                                className='w-full h-full'
                                onClick={handleRigthArrowClick}
                            /> 
                        }
                    </div> 

                </div>

                <div className='flex flex-row gap-2'>

                    <div 
                        className='flex justify-center items-center text-[11px] sm:text-[13px] p-2 gap-2 duration-150'
                        onClick={() => setActivePage("pending")}
                        style={{
                        border: `0.5px solid ${colors.light[200]}`,
                        borderRadius: "10px 0px 10px 0px",
                        transform: activePage == "pending" ? 'scale(100%)' : 'scale(105%)',
                        boxShadow: activePage == "pending" ? "" : `2px 2px 5px ${colors.dark[900]}`,
                        backgroundColor: activePage == "pending" ? colors.dark[200] : colors.light[100],
                        color: activePage == "pending" ? colors.light[200] : colors.dark[100],
                        }}
                    >
                        <img 
                            src={activeTheme == "dark" || activePage == "pending" ? "/icons/pendingWhite.png": "/icons/pendingBlack.png"} 
                            className='w-3 h-3 sm:w-3 sm:h-3'
                            alt="" 
                        />
                        <h4>{activeLanguage.pending}</h4>
                    </div>
                    
                    <div 
                        className='flex justify-center items-center text-[11px] sm:text-[13px] p-2 gap-2 duration-150'
                        onClick={() => setActivePage("failed")}
                        style={{
                        border: `0.5px solid ${colors.light[200]}`,
                        borderRadius: "10px 0px 10px 0px",
                        transform: activePage == "failed" ? 'scale(100%)' : 'scale(105%)',
                        boxShadow: activePage == "failed" ? "" : `2px 2px 5px ${colors.dark[900]}`,
                        backgroundColor: activePage == "failed" ? colors.dark[200] : colors.light[100],
                        color: activePage == "failed" ? colors.light[200] : colors.dark[100],
                        }}
                    >
                        <img 
                        src={activeTheme == "dark" || activePage == "failed" ? "/icons/closeWhite.png" : "/icons/closeBlack.png"} 
                        className='w-2 h-2 sm:w-2 sm:h-2'
                        alt="" 
                        />
                        <h4>{activeLanguage.failed}</h4>
                    </div>
                
                    <div 
                        className='flex justify-center items-center text-[11px] sm:text-[13px] p-2 gap-2 duration-150'
                        onClick={() => setActivePage("delivered")}
                        style={{
                        border: `0.5px solid ${colors.light[200]}`,
                        borderRadius: "10px 0px 10px 0px",
                        transform: activePage == "delivered" ? 'scale(100%)' : 'scale(105%)',
                        boxShadow: activePage == "delivered" ? "" : `2px 2px 5px ${colors.dark[900]}`,
                        backgroundColor: activePage == "delivered" ? colors.dark[200] : colors.light[100],
                        color: activePage == "delivered" ? colors.light[200] : colors.dark[100],
                        }}
                    >
                        <img 
                        src={activeTheme == "dark" || activePage == "delivered" ? "/icons/checkWhite.png" : "/icons/checkBlack.png"} 
                        className='w-2 h-2 sm:w-2 sm:h-2'
                        alt="" 
                        />
                        <h4>{activeLanguage.delivered}</h4>
                    </div>

                </div>
            </div>

        </div>

    )
}

export default OrdersSectionHeader
