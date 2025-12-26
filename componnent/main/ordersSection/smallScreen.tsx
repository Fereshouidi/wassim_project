import { OrdersByStatusType, OrderType } from '@/types'
import React, { useState } from 'react'
import OrdersListSection from './ordersListSection'
import { useTheme } from '@/contexts/themeProvider'
import { headerHeight } from '@/constent'
import { useScreen } from '@/contexts/screenProvider'

type props = {
  orders: OrdersByStatusType
}

const OrdersSection = ({
    orders
}: props) => {

    const { colors } = useTheme();
    const { screenWidth, screenHeight } = useScreen();
    const [ activePage, setActivePage ] = useState<"pending" | "failed" | "delivered">("pending");

    return (
        <div>
            <div className='w-[100vw] h-full bg-blue-500- flex flex-1 rounded-sm p-4-'
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
                    activePage={activePage}
                    setActivePage={setActivePage}
                />
            </div>
        </div>
    )
}

export default OrdersSection
