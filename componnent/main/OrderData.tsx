import { useClient } from '@/contexts/client'
import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { OwnerInfoType, PurchaseType } from '@/types'
import React, { useEffect } from 'react'

type Props = {
    ownerInfo: OwnerInfoType
    purchases?: PurchaseType[]
}
const OrderData = ({ 
    ownerInfo,
    purchases
}: Props) => {

    const { activeLanguage } = useLanguage();
    const { client } = useClient();
    const { colors, activeTheme } = useTheme();
    const [pricesList, setPricesList] = React.useState<number>();
    const [totalPrice, setTotalPrice] = React.useState<number>(0);

    // useEffect(() => {
    //     purchases?.map((purchase) =>{
    //         purchase.product?.price || 0
    //         setTotalPrice((prev) => prev + (purchase.product?.price || 0))
    //     })
    // }, [purchases]);
    
    return (
        <div 
            className='bord'
            style={{
                borderTop: `0.5px solid ${colors.light[300]}`,
                borderBottom: `0.5px solid ${colors.light[300]}`
            }}
        >
            <div>
                <h4>List de prix : </h4>
                <p>{pricesList}</p>

            </div>
            
        </div>
  )
}

export default OrderData
