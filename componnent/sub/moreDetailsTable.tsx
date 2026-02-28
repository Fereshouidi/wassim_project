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
    const { colors, activeTheme } = useTheme();
    const [deliveryWorker, setDeliveryWorker] = useState<DeliveryWorkerType | undefined>(undefined);

    useEffect(() => {
        const fetchDeliveryWorker = async () => {
            try {
                const { data } = await axios.get(backEndUrl + "/getDeliveryWorker");
                setDeliveryWorker(data.deliveryWorker);
            } catch (err) {
                console.error({ err });
            }
        }
        fetchDeliveryWorker();
    }, [order])

    const details = [
        { label: activeLanguage.receiver, value: client?.fullName, icon: "👤" },
        { label: activeLanguage.sideMatter.address, value: order?.address, icon: "📍" },
        { label: activeLanguage.deliveryPhone, value: deliveryWorker?.phone ? `+216 ${deliveryWorker.phone}` : "...", icon: "📞" },
        { label: activeLanguage.orderedAt, value: order.createdAt ? showTimeWithTranslate(order.createdAt, activeLanguage.language) : "...", icon: "🕒" },
    ];

    return (
        <div
            className='w-full cursor-auto rounded-2xl overflow-hidden'
            style={{
                backgroundColor: colors.light[100],
                border: `1px solid ${colors.light[250]}`,
                boxShadow: activeTheme === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.05)'
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className='p-4 border-b' style={{ borderColor: colors.light[250] }}>
                <h2 className='font-bold text-sm flex items-center gap-2' style={{ color: colors.dark[100] }}>
                    <span className='w-1 h-4 rounded-full' style={{ backgroundColor: colors.dark[200] }} />
                    {activeLanguage.moreDetails}
                </h2>
            </div>

            <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 divide-x divide-y' style={{ borderColor: colors.light[200] }}>
                {details.map((detail, idx) => (
                    <div key={idx} className='p-3 sm:p-4 flex flex-col gap-1 hover:bg-opacity-50 transition-colors'
                        style={{ backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                        <div className='flex items-center gap-1.5 opacity-60'>
                            <span className='text-xs'>{detail.icon}</span>
                            <span className='text-[9px] sm:text-[10px] uppercase font-bold tracking-wider'>{detail.label}</span>
                        </div>
                        <span className='text-[11px] sm:text-xs font-medium line-clamp-2' style={{ color: colors.dark[200] }}>
                            {detail.value || "..."}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MoreDetailsTable
