import { headerHeight } from '@/constent'
import { useScreen } from '@/contexts/screenProvider'
import { useTheme } from '@/contexts/themeProvider'
import { OrdersByStatusType, OrderType } from '@/types'
import React, { useState } from 'react'
import PendingOrder from './ordersListSection'
import OrdersListSection from './ordersListSection'

type props = {
  orders: OrdersByStatusType
  pendingOrdersCount: number
  failedOrdersCount: number
  deliveredOrdersCount: number
  pendingOrdersSkip: number
  failedOrdersSkip: number
  deliveredOrdersSkip: number
  limit: number
  getMorePendingOrder: () => void
  getMoreFailedOrder:  () => void
  getMoreDeliveredOrder:  () => void
  getLessPendingOrders:  () => void
  getLessFailedOrders:  () => void
  getLessDeliveredOrders:  () => void
}

const OrdersSection = ({ 
  orders,
  pendingOrdersCount,
  failedOrdersCount,
  deliveredOrdersCount,
  pendingOrdersSkip,
  failedOrdersSkip,
  deliveredOrdersSkip,
  limit,
  getLessDeliveredOrders,
  getLessFailedOrders,
  getLessPendingOrders,
  getMoreDeliveredOrder,
  getMoreFailedOrder,
  getMorePendingOrder
  
}: props) => {

  const { screenWidth, screenHeight } = useScreen();
  const { colors } = useTheme();
  const [ activePage, setActivePage ] = useState<"pending" | "failed" | "delivered">("pending");


  return (
    <div 
      className='w-[85vw] h-full bg-red-500- flex flex-row justify-center bg-yellow-500- gap-2 py-5 px-10'
      style={{
        minHeight: screenHeight - (headerHeight * 1.7) + "px",
        backgroundColor: colors.light[100]
      }}
    >

      <div className='h-full bg-blue-500- flex flex-1 rounded-xl px-4 '
        style={{
          border: `0.2px solid ${colors.light[200]}`,
          minHeight: screenHeight - (headerHeight * 2) + "px",
          // boxShadow: `0 0px 10px rgba(13, 13, 13, 0.05)`
        }}
      >
        <OrdersListSection
          orders={
            activePage == "pending" ? orders.pendingOrders
            : activePage == "failed" ? orders.failedOrders
            : activePage == "delivered" ? orders.deliveredOrders
            : []
          }
          totalOrdersCount={
              activePage == "pending" ? pendingOrdersCount
              : activePage == "failed" ? failedOrdersCount
              : activePage == "delivered" ? deliveredOrdersCount
              : 0
          }
          activePage={activePage}
          setActivePage={setActivePage}
          limit={limit}
          skip={
              activePage == "pending" ? pendingOrdersSkip
              : activePage == "failed" ? failedOrdersSkip
              : activePage == "delivered" ? deliveredOrdersSkip
              : 0
          }
          getMore={
              activePage == "pending" ? getMorePendingOrder
              : activePage == "failed" ? getMoreFailedOrder
              : activePage == "delivered" ? getMoreDeliveredOrder
              : () => {}
          }
          getLess={
              activePage == "pending" ? getLessPendingOrders
              : activePage == "failed" ? getLessFailedOrders
              : activePage == "delivered" ? getLessDeliveredOrders
              : () => {alert('hi')}
          }
        />
      </div>

    </div>
  )
}

export default OrdersSection
