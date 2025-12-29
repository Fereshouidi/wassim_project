import { useLanguage } from '@/contexts/languageContext'
import { useLoadingScreen } from '@/contexts/loadingScreen'
import { useSocket } from '@/contexts/soket'
import { useTheme } from '@/contexts/themeProvider'
import { PurchaseType } from '@/types'
import { a } from 'framer-motion/client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {
    purchase: PurchaseType
    setPurchases: (purchases: PurchaseType[]) => void   
}
const PurchaseItem = ({ 
    purchase, 
    setPurchases
}: Props) => {

    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const [purchase_, setPurchase_] = useState<PurchaseType | null>(null);
    const socket = useSocket();
    const { loadingScreen, setLoadingScreen } = useLoadingScreen();
    const router = useRouter();

    useEffect(() => {
        setPurchase_(purchase);
    }, [purchase])

    const updatePurchase = (updatedData: PurchaseType) => {
        if (!updatedData) return;
        socket.emit("update_purchase", updatedData);

        if (!updatedData.cart) {
            // @ts-ignore
            setPurchases((prev: PurchaseType[]) => { return [...prev.filter(purchase => purchase._id != updatedData._id)]})
        }
        // setLoadingScreen(true);
    }

    if (!purchase_ || !purchase) return;
    
    return (
        <div 
            className='m-2- rounded-sm p-2 w-full h-32- cursor-pointer'
            style={{
                backgroundColor: colors.light[100],
                color: colors.dark[200],
                // boxShadow: activeTheme === "dark" ? `0 0 10px 0 ${colors.light[250]}` : `0 0 10px 0 ${colors.light[250]}`, 
                border: `0.2px solid ${colors.light[200]}`
            }}
            onClick={() => {
                localStorage.setItem('purchaseId', purchase._id?? "")
                // @ts-ignore
                router.push(`/product/${purchase.product?._id}`)
            }}
        >

            <div className='w-[75%]- flex flex-row gap-4 items-start'>
                <img 
                    // @ts-ignore
                    src={purchase.product?.thumbNail} 
                    className='w-20 h-fit rounded-sm bg-blue-500-'
                    alt="" 
                />
                
                <div className='flex flex-col'>
                    <p className='text-md'>{
                        // @ts-ignore
                        purchase.product?.name[activeLanguage.language].length > 25 ?
                        // @ts-ignore
                        purchase.product?.name[activeLanguage.language].substring(0, 25) + "..." :
                        // @ts-ignore
                        purchase.product?.name[activeLanguage.language]
                    }</p>
                    <p className='font-bold'>{
                        // @ts-ignore
                        purchase.specification?.price + " T.D"
                    }</p>
            
                    <div 
                        className='flex flex-col gap-2- text-[12px] '
                        style={{
                            color: colors.dark[500]
                        }}
                    >
                        {
                            // @ts-ignore
                            purchase?.specification?.color && <div className='flex flex-row gap-2'>
                                <h4>{activeLanguage.sideMatter.color + " : "}</h4>
                                <span>{// @ts-ignore
                                    purchase.specification.color
                                }</span>
                            </div>
                        }
                        {
                            // @ts-ignore
                            purchase?.specification?.size && <div className='flex flex-row gap-2'>
                                <h4>{activeLanguage.sideMatter.size + " : "}</h4>
                                <span>{// @ts-ignore
                                    purchase.specification.size
                                }</span>
                            </div>
                        }
                        {
                            // @ts-ignore
                            purchase?.specification?.type && <div className='flex flex-row gap-2'>
                                <h4>{activeLanguage.sideMatter.type + " : "}</h4>
                                <span>{// @ts-ignore
                                    purchase.specification.type
                                }</span>
                            </div>
                        }

                    </div>

                </div>


            </div>

            <div className='w-[25%]- flex flex-1 justify-between items-end h-full- bg-blue-500-'>

                <div 
                    className='flex flex-row bg-blue-500- justify-center items-center gap-1 cursor-pointer'
                    onClick={(e) => {
                        e.stopPropagation();
                        updatePurchase({...purchase, cart: null, status: "viewed"});
                    }}
                >
                    <img 
                        src="/icons/trash.png" 
                        alt="" 
                        // className='w-4 h-4 '
                        style={{
                            width: '15px',
                            height: '15px'
                        }}
                    />
                    <h4 className='text-red-500 text-sm'>{activeLanguage.cancel}</h4>
                </div>

                <div className='flex flex-row justify-center items-center gap-3 w-fit mt-2'>
                    <img 
                        src={activeTheme == "dark" ? "/icons/minus-light.png" : "/icons/minus-dark.png" } 
                        alt="" 
                        className='w-6 h-6 rounded-sm p-1'
                        style={{
                            backgroundColor: colors.light[300],
                            padding: '6px'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if ( (purchase.quantity || 0) <= 1 ) return;
                            purchase.quantity && updatePurchase({...purchase, quantity: purchase.quantity - 1});
                        }}
                    />
                    <span>{purchase.quantity}</span>
                    <img 
                        src={activeTheme == "dark" ? "/icons/add-white.png" : "/icons/add-black.png" } 
                        alt="" 
                        className='w-6 h-6 rounded-sm p-1'
                        style={{
                            backgroundColor: colors.light[300],
                            padding: '6px'
                        }}
                        onClick={(e) => {
                            if (
                                //@ts-ignore
                                (purchase.quantity || 0) >= (purchase?.specification?.quantity)
                            ) return;
                            e.stopPropagation();
                            purchase.quantity && updatePurchase({...purchase, quantity: purchase.quantity + 1});
                        }}
                    />
                </div>


            </div>
            
        </div>
    )
}

export default PurchaseItem
