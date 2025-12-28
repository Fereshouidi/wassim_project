import { backEndUrl } from '@/api';
import { useClient } from '@/contexts/client';
import { useLanguage } from '@/contexts/languageContext';
import { useOwner } from '@/contexts/ownerInfo';
import { useTheme } from '@/contexts/themeProvider';
import { showTimeWithTranslate } from '@/lib';
import { DeliveryWorkerType, OrderType } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

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
    const [ deliveryWorker, setDeliveryWorker ] = useState<DeliveryWorkerType | undefined>(undefined);

    

    useEffect(() => {
        const fetchDeliveryWorker = async () => {
            await axios.get( backEndUrl + "/getDeliveryWorker" )
            .then(({ data }) => {
                setDeliveryWorker(data.deliveryWorker)
            })
            .catch(( err ) => {
                console.error({ err });
            })
        }
        fetchDeliveryWorker();
    }, [order])

    return (
        <div 
            className='w-full cursor-auto'
            onClick={(e) => e.stopPropagation()}
        >
            <h2 className='font-bold text-[12px] m-2'>{activeLanguage.moreDetails + " : "}</h2>

            <table className='w-full bord-collapse'>
                <thead>
                    <tr>
                        <th 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[250]}` }}
                        >{activeLanguage.receiver}</th>
                        <th 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[250]}` }}
                        >{activeLanguage.sideMatter.adress}</th>
                        <th 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[250]}` }}
                        >{activeLanguage.deliveryPhone}</th>
                        <th 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[250]}` }}
                        >{activeLanguage.orderedAt}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[250]}` }}
                        >{client?.fullName}</td>
                        <td 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[250]}` }}
                        >{order?.address}</td>
                        <td 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[250]}` }}
                        >{ "+216" + deliveryWorker?.phone}</td>
                        <td 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[250]}` }}
                        >{order.createdAt && showTimeWithTranslate(order.createdAt, activeLanguage.language)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default MoreDetailsTable
