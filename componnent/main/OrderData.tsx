import { useLanguage } from '@/contexts/languageContext'
import { useOwner } from '@/contexts/ownerInfo'
import { useTheme } from '@/contexts/themeProvider'
import { PurchaseType } from '@/types'
import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

type Props = { purchases?: PurchaseType[] }

const OrderData = ({ purchases }: Props) => {
    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const { ownerInfo } = useOwner();

    const subTotal = useMemo(() => {
        return purchases?.reduce((acc, purchase) => {
            // @ts-ignore
            const price = purchase.specification?.price || 0;
            return acc + (price * (purchase.quantity || 1));
        }, 0) || 0;
    }, [purchases]);

    if (!ownerInfo) return <div className="h-20 animate-pulse bg-gray-100 rounded-2xl" />;

    const finalTotal = subTotal + (ownerInfo?.shippingCost || 0);

    return (
        <div
            className='flex flex-col gap-4 w-full p-5 rounded-2xl border'
            style={{
                backgroundColor: colors.light[100],
                borderColor: colors.light[250],
                boxShadow: activeTheme === 'dark' ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.02)'
            }}
        >
            <div className='flex items-center gap-2 mb-1'>
                <div className='w-1 h-3 rounded-full' style={{ backgroundColor: colors.dark[300] }} />
                <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">{activeLanguage.orderSummary}</h4>
            </div>

            <div className='flex flex-col gap-3'>
                <div className="flex justify-between items-center text-xs">
                    <span className="opacity-60 font-medium">{activeLanguage.totalPrice}</span>
                    <span className="font-bold">{subTotal.toFixed(2)} <span className="text-[10px] opacity-50">D.T</span></span>
                </div>

                <div className="flex justify-between items-center text-xs">
                    <span className="opacity-60 font-medium">{activeLanguage.shippingCoast}</span>
                    <span className="font-bold">{(ownerInfo.shippingCost || 0).toFixed(2)} <span className="text-[10px] opacity-50">D.T</span></span>
                </div>
            </div>

            <div className="h-[1px] border-t border-dashed" style={{ borderColor: colors.light[350] }} />

            <div
                className="flex justify-between items-center p-4 rounded-xl shadow-inner"
                style={{ backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
            >
                <div className='flex flex-col'>
                    <span className="text-[10px] uppercase font-bold tracking-tight opacity-50">{activeLanguage.totalAmmount}</span>
                    <span className='text-[9px] opacity-30'>Tax included</span>
                </div>
                <div className='text-right'>
                    <span className="text-xl font-black tracking-tight" style={{ color: colors.dark[100] }}>
                        {finalTotal.toFixed(2)}
                    </span>
                    <span className="text-[10px] ml-1 font-bold opacity-60">D.T</span>
                </div>
            </div>
        </div>
    );
}

export default OrderData;
