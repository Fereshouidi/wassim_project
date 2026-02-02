import { OrdersByStatusType, OrderType } from '@/types'
import React, { useState } from 'react'
import OrdersListSection from './ordersListSection'
import { useTheme } from '@/contexts/themeProvider'
import { headerHeight } from '@/constent'
import { useScreen } from '@/contexts/screenProvider'

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

    const { colors } = useTheme();
    const { screenWidth, screenHeight } = useScreen();
    const [ activePage, setActivePage ] = useState<"pending" | "failed" | "delivered">("pending");

    return (
        <div>
            <div className='w-[100vw] h-full bg-blue-500- flex flex-1 rounded-xl p-4-'
                style={{
                    minHeight: screenHeight - headerHeight + "px",
                    border: `0.2px solid ${colors.light[200]}`,
                    boxShadow: `0 0px 10px rgba(13, 13, 13, 0.05)`
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
                        : () => {}
                    }
                />
            </div>
        </div>
    )
}

export default OrdersSection
