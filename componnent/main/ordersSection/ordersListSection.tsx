import OrderCard from '@/componnent/sub/orderCard'
import OrdersSectionHeader from '@/componnent/sub/ordersSectionHeader'
import { useScreen } from '@/contexts/screenProvider'
import { useTheme } from '@/contexts/themeProvider'
import { OrdersByStatusType, OrderType } from '@/types'
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

  const { screenWidth } = useScreen();
  const [ cardsOpenedByDefault, setCardsOpenedByDefault ] = useState<boolean>(false);
  const { activeTheme, colors } = useTheme();
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
        className='w-full h-full- flex flex-col gap-2 overflow-y-scroll- scrollbar-hidden pb-5 px-2'
        style={{
          height: screenWidth > 1000 ? `calc(100% - 80px)` : "calc(100% - 100px)",
        }}
      >
        {orders.map((order, index) => (
          <OrderCard 
            key={index} 
            order={order} 
            cardOpenedByDefault={cardsOpenedByDefault}
          />
        ))}
      </div>

    </div>
  )
}

export default OrdersListSection
