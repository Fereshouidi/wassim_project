import OrderCard from '@/componnent/sub/orderCard'
import { useScreen } from '@/contexts/screenProvider'
import { useTheme } from '@/contexts/themeProvider'
import { OrderType } from '@/types'
import React, { useEffect, useState } from 'react'

type props = {
  orders: OrderType[]
  activePage: "pending" | "failed" | "delivered"
  setActivePage: (value: "pending" | "failed" | "delivered") => void
}
const OrdersListSection = ({ 
  orders,
  activePage, 
  setActivePage
}: props) => {

  const { screenWidth } = useScreen();
  const [ cardsOpenedByDefault, setCardsOpenedByDefault ] = useState<boolean>(false);
  const { activeTheme, colors } = useTheme();
  // const [ activePage, setActivePage ] = useState<"pending" | "failed" | "delivered">("pending");


  useEffect(() => {
    setCardsOpenedByDefault(orders.length < 3);
  }, [orders.length])


  return (
    <div className='w-full h-full flex- flex-1-'>

      <div className='w-full- h-[80px] flex justify-between items-center px-4'>
        <h2
          className=' mx-4- mt-7- text-[12px] sm:text-[14px]'
          style={{
            // fontSize: screenWidth > 1000 ? "14px" : "14px"
          }}
        >
          {
            activePage == "pending" ? `Pending Orders : (${orders.length})`
            : activePage == "failed" ? `failed Orders : (${orders.length})`
            : activePage == "delivered" ? `delivered Orders : (${orders.length})`
            : null
          }
        </h2>


        <div className='flex flex-row gap-2'>

          <div 
            className='flex justify-center items-center text-[11px] sm:text-[13px] p-2 gap-1 duration-50'
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
            <h4>pending</h4>
          </div>
          
          <div 
            className='flex justify-center items-center text-[11px] sm:text-[13px] p-2 gap-1'
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
            <h4>failed</h4>
          </div>
    
          <div 
            className='flex justify-center items-center text-[11px] sm:text-[13px] p-2 gap-1'
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
            <h4>delivered</h4>
          </div>

        </div>
      </div>

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
