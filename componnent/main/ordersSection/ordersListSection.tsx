import OrderCard from '@/componnent/sub/orderCard'
import OrdersSectionHeader from '@/componnent/sub/ordersSectionHeader'
import { headerHeight } from '@/constent'
import { useLanguage } from '@/contexts/languageContext'
import { useScreen } from '@/contexts/screenProvider'
import { useTheme } from '@/contexts/themeProvider'
import { OrdersByStatusType, OrderType } from '@/types'
import { div } from 'framer-motion/client'
import React, { useEffect, useState } from 'react'

type props = {
  orders: OrderType[]
  totalOrdersCount: number
  activePage: "pending" | "failed" | "delivered"
  setActivePage: (value: "pending" | "failed" | "delivered") => void
  getMorePendingOrder?: () => void
  getMoreFailedOrder?: () => void
  getMoreDeliveredOrder?: () => void
  limit: number
  skip: number
  getMore: () => void
  getLess: () => void 
}
const OrdersListSection = ({ 
  orders,
  totalOrdersCount,
  activePage, 
  setActivePage,
  getMorePendingOrder,
  getMoreFailedOrder,
  getMoreDeliveredOrder,
  limit,
  skip,
  getMore,
  getLess
}: props) => {

  const { screenWidth, screenHeight } = useScreen();
  const [ cardsOpenedByDefault, setCardsOpenedByDefault ] = useState<boolean>(false);
  const { activeTheme, colors } = useTheme();
  const { activeLanguage } = useLanguage();
  // const [ activePage, setActivePage ] = useState<"pending" | "failed" | "delivered">("pending");


  useEffect(() => {
    setCardsOpenedByDefault(orders.length < 3);    
  }, [orders.length])


  return (
    <div 
      className='w-full h-full flex- flex-1-'
      style={{
        // backgroundColor: colors.light[150]
      }}
    >

      <OrdersSectionHeader
        orders={orders}
        activePage={activePage}
        setActivePage={setActivePage}
        ordersCount={orders.length}
        totalOrdersCount={totalOrdersCount}
        limit={limit}
        skip={skip}
        getMore={getMore}
        getLess={getLess}
      />

      <div 
        className='w-full h-full flex flex-col gap-2 overflow-y-scroll- scrollbar-hidden pb-5 px-2'
        style={{
          height: screenWidth > 1000 ? `calc(100% - 80px)` : "calc(100% - 100px)",
        }}
      >
        {
          orders.length == 0 ?
            
            <div 
              className='w-full h-full bg-red-500- flex flex-col justify-center items-center pt-16'
              style={{
                // minHeight: screenHeight - (headerHeight * 3.5) + "px",
              }}
            >
                <img 
                  src={activeTheme == "dark" ? "/icons/open-box-white.png" : "/icons/open-box-black.png"} 
                  className='w-h-40 h-40 sm:w-52 sm:h-52  opacity-20'
                  alt="" 
                />
                <p className='m-5 opacity-50 text-sm sm:text-[17px]'>{activeLanguage.noOrders}</p>
            </div>

          :
        
          orders.map((order, index) => (
            <OrderCard 
              key={index} 
              order={order} 
              cardOpenedByDefault={cardsOpenedByDefault}
            />
          ))
        }
      </div>

    </div>
  )
}

export default OrdersListSection
