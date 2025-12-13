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
            total += ( purchase.specification?.price * purchase.quantity ) || 0;
        })
        setPricesList(Number(total.toFixed(2)));
    }, [purchases]);

    if (!ownerInfo) return <SkeletonLoading/>
    
    return (
        <div 
            className='bord pt-2 flex flex-col my-10 text-sm rounded-sm px-2 gap-2'
            style={{
                // borderTop: `0.5px solid ${colors.light[300]}`,
                border: `0.5px solid ${colors.light[300]}`,
                backgroundColor: colors.light[100],
                boxShadow: `0 0 15px ${colors.light[150]}`
            }}
        >
            <div 
                className={`flex justify-between border-b-[0.2px] border-[${colors.light[200]}]- p-2 gap-2`}
                style={{
                    borderBottom: `0.2px solid ${colors.light[200]}`
                }}
            >
                <h4>{activeLanguage.totalPrice +  " : "}</h4>
                <p>{pricesList + " D.T"}</p>
            </div>

            <div 
                className={`flex justify-between border-b-[0.2px] border-[${colors.light[200]}]- p-2 gap-2`}
                style={{
                    borderBottom: `0.2px solid ${colors.light[200]}`
                }}
            >                
                <h4>{activeLanguage.shippingCoast + " : "}</h4>
                <p>{ownerInfo?.shippingCost + " D.T"}</p>
            </div>

            <div 
                className={`flex justify-between border-b-[0.2px] border-[${colors.light[200]}]- p-2 gap-2`}
                style={{
                    borderBottom: `0.2px solid ${colors.light[200]}`
                }}
            >                
                <h4>{activeLanguage.totalAmmount + " : "}</h4>
                <p>{ Number(pricesList)  + Number(ownerInfo?.shippingCost || 0) + " D.T"}</p>
            </div>

            
        </div>
  )
}

export default OrderData
