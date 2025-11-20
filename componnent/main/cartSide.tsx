"use client"

import { headerHeight } from '@/constent'
import { useLanguage } from '@/contexts/languageContext'
import { PurchaseType } from '@/types'
import React from 'react'

type Props = {
    isActive: boolean
    setIsActive: (value: boolean) => void
    purchases: PurchaseType[]
    setPurchases: (purchases: PurchaseType[]) => void
}

const CartSide = ({
    isActive,
    setIsActive,
    purchases,
    setPurchases
}: Props) => {

    const { activeLanguage } = useLanguage()

  return (
    <div 
        className={`fixed left-0 w-full h-full z-10 ${isActive ? "" : "invisible"} no-sellect`}
        style={{
            top: headerHeight * 1.6 + 'px',
            backgroundColor: "rgba(74, 74, 74, 0.677)"
        }}
    >

        <div 
            className={`w-[400px] h-full absolute ${isActive ? "right-0" : "right-[-400px]"} top-0 duration-300 transition-[left, right] flex flex-col p-5`}
            style={{
                backgroundColor: 'white'
            }}
        >
            {purchases.map((purchase) => (
                <div
                    key={purchase._id}
                >
                    {
                    // @ts-ignore 
                        purchase.product?.name[activeLanguage.language]
                    }

                </div>
            ))}
        </div>
    </div>
  )
}

export default CartSide
