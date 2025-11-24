import { useClient } from '@/contexts/client'
import { useLanguage } from '@/contexts/languageContext'
import { useOwner } from '@/contexts/ownerInfo'
import { useTheme } from '@/contexts/themeProvider'
import { OwnerInfoType, PurchaseType } from '@/types'
import React, { useEffect } from 'react'
import LoadingScreen from '../sub/loading/loadingScreen'
import SkeletonLoading from '../sub/SkeletonLoading'
import { number } from 'framer-motion'

type Props = {
    purchases?: PurchaseType[]
}
const OrderData = ({ 
    purchases
}: Props) => {

    const { activeLanguage } = useLanguage();
    const { client } = useClient();
    const { colors, activeTheme } = useTheme();
    const [pricesList, setPricesList] = React.useState<number>(0);
    const [totalPrice, setTotalPrice] = React.useState<number>(0);
    const { ownerInfo } = useOwner();

    useEffect(() => {
        let total = 0;
        purchases?.map((purchase) =>{
            // @ts-ignore
            purchase.specification?.price || 0
            // @ts-ignore
            total += purchase.specification?.price || 0;
        })
        setPricesList(Number(total.toFixed(2)));
    }, [purchases]);

    if (!ownerInfo) return <SkeletonLoading/>
    
    return (
        <div 
            className='bord w-full- p-4- pb-5 bg-red-500- flex flex-col my-10 pl-5- text-sm ml-[50%]-  px-5 translate-x-[-50%]-  gap-2'
            style={{
                // borderTop: `0.5px solid ${colors.light[300]}`,
                // borderBottom: `0.5px solid ${colors.light[300]}`
            }}
        >
            <div className={`flex justify-between border-b-[0.5px] border-[${colors.light[800]}] p-2 gap-2`}>
                <h4>{"List de prix : "}</h4>
                <p>{pricesList + " D.T"}</p>
            </div>
            <div className={`flex justify-between border-b-[0.5px] border-[${colors.light[800]}] p-2 gap-2`}>
                <h4>{"shipping cost : "}</h4>
                <p>{ownerInfo?.shippingCost + " D.T"}</p>
            </div>
            <div className={`flex justify-between border-b-[0.5px] border-[${colors.light[800]}] p-2 gap-2`}>
                <h4>{"total prix : "}</h4>
                <p>{ Number(pricesList)  + Number(ownerInfo?.shippingCost || 0) + " D.T"}</p>
            </div>

            
        </div>
  )
}

export default OrderData
