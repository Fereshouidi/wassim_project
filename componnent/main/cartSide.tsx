"use client"

import { headerHeight } from '@/constent'
import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { ClientFormType, PurchaseType } from '@/types'
import React, { useEffect, useState } from 'react'
import PurchaseItem from '../sub/purchaseItem'
import InputForm from './inputForm'
import { useClient } from '@/contexts/client'
import OrderData from './OrderData'
import { span } from 'framer-motion/m'
import { useSocket } from '@/contexts/soket'
import { useLoadingScreen } from '@/contexts/loadingScreen'

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

    const { activeLanguage } = useLanguage();
    const { client } = useClient();
    const { colors, activeTheme } = useTheme();
    const socket = useSocket();
    const { setLoadingScreen } = useLoadingScreen();
    const [clientForm, setClientForm] = useState<ClientFormType>({
        fullName: "",
        adress: "",
        phone: "",
        note: ""
    });
    const [confirmBTNWorks, setConfirmBTNWorks] = useState<boolean>(false);

    useEffect(() => {
        setClientForm({
        fullName: client?.fullName || "",
        adress: client?.adress || "",
        phone: client?.phone ? String(client.phone) : "",
        note: client?.aiNote || ""
        })
    }, [client])

    useEffect(() => {
        console.log("clientForm :", clientForm);
    }, [clientForm])

    useEffect(() => {
        if (clientForm.fullName && clientForm.adress && clientForm.phone && clientForm.phone.length == 8) {
            setConfirmBTNWorks(true);
        } else {
            setConfirmBTNWorks(false);
        }
    }, [clientForm])

    useEffect(() => {
        if (!socket) return;
        
        socket.on('receive_update_purchase_result', async () => {
            // setPurchases()
            // setLoadingScreen(false);
        })
    }, [socket])

  return (
    <div 
        className={`fixed left-0 w-full h-full z-50 ${isActive ? "" : "invisible"} no-sellect`}
        style={{
            top: '0',
            // bottom: 0,
            backgroundColor: "rgba(74, 74, 74, 0.677)"
        }}
    >

        <div 
            className={`w-[90vw] sm:w-[400px] h-full absolute ${isActive ? "right-0" : "right-[-400px]"} top-0 duration-300 transition-[left, right] overflow-y-scroll scrollbar-hidden cursor-auto flex flex-col items-center p-5`}
            style={{
                backgroundColor: colors.light[100],
            }}
            onClick={(e) => e.stopPropagation()}
        >

            <div 
                className='w-full bg-red-500- flex flex-row items-center justify-center pb-5 mb-6 relative'
                style={{
                    borderBottom: `0.2px solid ${colors.light[200]}`
                }}
            >

                <div className='flex gap-2 justify-center items-center '>
                    <img 
                        src={activeTheme == "dark" ? "/icons/shopping-bag-white.png" : "/icons/shopping-bag-black.png" } 
                        className='w-5 h-5'
                        alt="" 
                    />
                    <h2 className='font-bold text-md'>
                        {activeLanguage.myCart}
                    </h2>
                    <h4>{`(${purchases.length})`}</h4>
                </div>

                <img 
                    src={`/icons/close-${activeTheme === "dark" ? "white" : "black"}.png`} 
                    alt="" 
                    className='w-4 h-4 absolute right-5 top-5- cursor-pointer'
                    onClick={() => setIsActive(false)}
                />
            </div>

            {
                purchases.length === 0 ? 

                <div 
                    className='w-full h-full flex flex-col justify-center items-center text-md'
                    style={{
                        color: colors.dark[500]
                    }}
                >
                    <p className='mr-1'>{activeLanguage.emptyCart + ","}</p>
                    <p>{activeLanguage.filYourCart} 
                        <a href="/" className='mx-2 text-[15px]- underline' style={{ color: colors.dark[100] }}>{activeLanguage.here}</a>
                    </p>
                </div>

                :

                <div>

                    <div className='w-full flex flex-col items-center gap-4 mb-2'>
                        {purchases.map((purchase) => (
                            <PurchaseItem
                                key={purchase._id}
                                purchase={purchase}
                                setPurchases={setPurchases}
                            />
                        ))}
                    </div>

                    <OrderData
                        // ownerInfo={}
                        purchases={purchases}
                    />

                    <InputForm
                        clientForm={clientForm}
                        setClientForm={setClientForm}
                    />

                    <button
                        className={`w-full py-3 mt-5 text-white font-medium text-md rounded-md ${confirmBTNWorks ? "cursor-pointer" : "cursor-not-allowed"}`}
                        style={{
                            backgroundColor: confirmBTNWorks ? colors.dark[100] : colors.dark[500]
                        }}
                    >
                        {activeLanguage.confirmOrder}
                    </button>
                </div>
            }

        </div>
    </div>
  )
}

export default CartSide
