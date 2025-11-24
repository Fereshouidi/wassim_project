import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { PurchaseType } from '@/types'
import { a } from 'framer-motion/client'
import React from 'react'

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
    
    return (
        <div 
            className='m-2- rounded-sm p-2 w-full h-32-'
            style={{
                backgroundColor: colors.light[100],
                color: colors.dark[200],
                // boxShadow: activeTheme === "dark" ? "0 0 10px 0 rgba(0,0,0,0.01)" : "0 0 10px 0 rgba(0,0,0,0.1)", 
                border: `0.2px solid ${colors.light[300]}`
            }}
        >

            <div className='w-[75%]- flex flex-row gap-4 items-center'>
                <img 
                    // @ts-ignore
                    src={purchase.product?.thumbNail} 
                    className='w-20 rounded-sm bg-blue-500'
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
                </div>

            </div>

            <div className='w-[25%]- flex flex-1 justify-between items-end h-full- bg-blue-500-'>

                <div className='flex flex-row bg-blue-500- justify-center items-center gap-1 cursor-pointer'>
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
                    />
                </div>


            </div>
            
        </div>
    )
}

export default PurchaseItem
