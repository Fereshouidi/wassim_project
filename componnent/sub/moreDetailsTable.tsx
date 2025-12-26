import { useClient } from '@/contexts/client';
import { useLanguage } from '@/contexts/languageContext';
import { useOwner } from '@/contexts/ownerInfo';
import { useTheme } from '@/contexts/themeProvider';
import { showTimeWithTranslate } from '@/lib';
import { OrderType } from '@/types';
import React from 'react'

type props = {
    order: OrderType
}

const MoreDetailsTable = ({
    order
}: props) => {

    const { client } = useClient();
    const { activeLanguage } = useLanguage();
    const { colors } = useTheme();
    const { ownerInfo } = useOwner();

    return (
        <div 
            className='w-full cursor-auto'
            onClick={(e) => e.stopPropagation()}
        >
            <h2 className='font-bold text-[12px] m-2'>{"More details : "}</h2>

            <table className='w-full bord-collapse'>
                <thead>
                    <tr>
                        <th 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[300]}` }}
                        >{"Delivered to"}</th>
                        <th 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[300]}` }}
                        >{activeLanguage.sideMatter.adress}</th>
                        <th 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[300]}` }}
                        >{"Driver's Phone"}</th>
                        <th 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[300]}` }}
                        >{"Ordered At"}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[300]}` }}
                        >{client?.fullName}</td>
                        <td 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[300]}` }}
                        >{order?.address}</td>
                        <td 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[300]}` }}
                        >{ "+216" + ownerInfo?.contact.phone}</td>
                        <td 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[300]}` }}
                        >{order.createdAt && showTimeWithTranslate(order.createdAt, activeLanguage.language)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default MoreDetailsTable
