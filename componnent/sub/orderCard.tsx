import { useLanguage } from '@/contexts/languageContext'
import { useLoadingScreen } from '@/contexts/loadingScreen'
import { useOwner } from '@/contexts/ownerInfo'
import { useTheme } from '@/contexts/themeProvider'
import { calcTotalPrice, timeAgo } from '@/lib'
import { OrderType } from '@/types'
import React, { useEffect, useState } from 'react'
import PurshasesTable from './purshasesTable'
import MoreDetailsTable from './moreDetailsTable'

type Props = {
    order: OrderType;
    cardOpenedByDefault: boolean,
    // setCardOpenedByDefault: (value: boolean) => void
}

const OrderCart = ({ 
    order,
    cardOpenedByDefault,
    // setCardOpenedByDefault
}: Props) => {

    const { colors } = useTheme();
    const { setLoadingScreen } = useLoadingScreen();
    const { ownerInfo } = useOwner();
    const { activeLanguage } = useLanguage();
    const [ cardOpened, setCardOpened ] = useState<boolean>(false);
    // const [ cardOpenedHeight, setCardOpenedHeight ] = useState<number>(0);
    const [ cardClosedHeight, setCardClosedHeight ] = useState<number>(70);

    useEffect(() => {
        setCardOpened(cardOpenedByDefault)
    }, [cardOpenedByDefault])

    return (
        <div
            className='w-full flex flex-col justify-between items-center gap-5 rounded-lg p-3 cursor-pointer active:opacity-70 overflow-hidden transition-all duration-700 ease-in-out'
            style={{
                maxHeight: cardOpened ? '2000px' : cardClosedHeight + 'px',
                backgroundColor: colors.light[100],
                border: `0.2px solid ${colors.light[250]}`,
                boxShadow: `0 5px 15px ${colors.light[150]}`
            }}
            onClick={() => setCardOpened(!cardOpened)}
        >
            {/* Top Section */}
            <div className='w-full flex flex-row justify-between items-center'>
                <div className='flex flex-row items-center gap-2- w-fit h-10'>
                    {/* Overlapping Thumbnails */}
                    <div className='w-16 sm:w-20 h-full flex flex-row justify-start bg-red-500- items-center rounded-lg relative'>
                        {order.purchases?.slice(0, 3).map((purchase, i) => (
                            <img
                                key={purchase._id}
                                //@ts-ignore
                                src={purchase.product?.thumbNail ?? ""}
                                alt="product"
                                className='w-8 h-8 rounded-full border-2 border-white object-cover'
                                style={{ marginLeft: i > 0 ? '-20px' : '0' }}
                            />
                        ))}
                    </div>
                    
                    <div className='flex flex-row gap-1 w-fit'>
                        <span className='text-[12px] font-semibold'>{activeLanguage.orderNum + " : "}</span>
                        <span className='opacity-70 text-[12px] select-text'>{"#" + (order.orderNumber)}</span>
                    </div>
                </div>
                
                <span className='text-[10px] sm:text-[12px] opacity-80'>
                    {
                        //@ts-ignore
                        timeAgo(order.createdAt, activeLanguage.language)
                    }
                </span>
            </div>

            {/* Bottom Section */}
            {cardOpened &&
                <div
                    className='w-full flex flex-col gap-5'
                >
                    <PurshasesTable 
                        purchases={order.purchases ?? []}
                    />

                    <MoreDetailsTable
                        order={order}
                    />
                </div>
            }
        </div>
    )
}

export default OrderCart;