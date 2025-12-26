import { headerHeight } from '@/constent'
import { useScreen } from '@/contexts/screenProvider'
import { useTheme } from '@/contexts/themeProvider'
import { OrdersByStatusType, OrderType } from '@/types'
import React, { useState } from 'react'
import PendingOrder from './ordersListSection'
import OrdersListSection from './ordersListSection'

type props = {
  orders: OrdersByStatusType
}

const OrdersSection = ({ 
  orders 
}: props) => {

  const { screenWidth, screenHeight } = useScreen();
  const { colors } = useTheme();
  const [ activePage, setActivePage ] = useState<"pending" | "failed" | "delivered">("pending");


  return (
    <div 
      className='w-[85vw] flex flex-row justify-center bg-yellow-500- gap-2 py-5 px-10'
      style={{
        minHeight: screenHeight - (headerHeight * 1.7) + "px",
        backgroundColor: colors.light[100]
      }}
    >

      <div className='h-full bg-blue-500- flex flex-1 rounded-sm px-4 '
        style={{
          border: `0.2px solid ${colors.light[200]}`,
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
          activePage={activePage}
          setActivePage={setActivePage}
        />
      </div>

      {/* <div className='h-full bg-red-500- flex flex-1 rounded-sm p-4'
        style={{
          border: `0.2px solid ${colors.light[200]}`,
          boxShadow: `0 0px 10px rgba(13, 13, 13, 0.05)`
        }}
      >
        <FailedOrders
          orders={orders.failedOrders}
        />
      </div>

      <div className='h-full bg-green-500- flex flex-1 rounded-sm p-4'
        style={{
          border: `0.2px solid ${colors.light[200]}`,
          boxShadow: `0 0px 10px rgba(13, 13, 13, 0.05)`
        }}
      >
        <DeliveredOrders
          orders={orders.deliveredOrders}
        />  
      </div> */}

    </div>
  )
}

export default OrdersSection
