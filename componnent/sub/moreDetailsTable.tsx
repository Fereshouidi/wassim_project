"use client";

import { backEndUrl } from '@/api';
import { useClient } from '@/contexts/client';
import { useLanguage } from '@/contexts/languageContext';
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

    // تم استبدال الإيموجي بنقاط ملونة أو تركها فارغة لتعزيز الطابع الرسمي
    const details = [
        { label: activeLanguage.receiver, value: client?.fullName, color: colors.dark[100] },
        { label: activeLanguage.sideMatter.address, value: order?.address, color: colors.dark[100] },
        { label: activeLanguage.deliveryPhone, value: deliveryWorker?.phone ? `+216 ${deliveryWorker.phone}` : "...", color: colors.dark[100] },
        { label: activeLanguage.orderedAt, value: order.createdAt ? showTimeWithTranslate(order.createdAt, activeLanguage.language) : "...", color: colors.dark[100] },
    ];

    return (
        <div
            className='w-full cursor-auto rounded-xl overflow-hidden border transition-all duration-300'
            style={{
                backgroundColor: colors.light[100],
                borderColor: colors.light[250],
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className='p-5 border-b flex items-center justify-between' style={{ borderColor: colors.light[250] }}>
                <h2 className='font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3' style={{ color: colors.dark[100] }}>
                    <div className='w-1.5 h-1.5 rounded-full' style={{ backgroundColor: colors.dark[100] }} />
                    {activeLanguage.moreDetails}
                </h2>
                <span className='text-[9px] font-bold opacity-20 tracking-tighter'>ORDER_LOG_DATA</span>
            </div>

            {/* Content Grid */}
            <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4'>
                {details.map((detail, idx) => (
                    <div 
                        key={idx} 
                        className={`p-5 flex flex-col gap-2 transition-colors border-b lg:border-b-0 lg:border-r last:border-0`}
                        style={{ 
                            borderColor: colors.light[250],
                            backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.01)' : 'transparent' 
                        }}
                    >
                        <span className='text-[9px] uppercase font-black tracking-widest opacity-30'>
                            {detail.label}
                        </span>
                        
                        <span className='text-[12px] font-bold leading-tight line-clamp-2' style={{ color: colors.dark[100] }}>
                            {detail.value || "---"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MoreDetailsTable