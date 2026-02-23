"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import { useClient } from '@/contexts/client';
import { useCartSide } from '@/contexts/cart';
import { useLoadingScreen } from '@/contexts/loadingScreen';
import { useRouter } from 'next/navigation';
import { useOwner } from '@/contexts/ownerInfo';
import PurchaseItem from '../sub/purchaseItem';
import InputForm from './inputForm';
import OrderData from './OrderData';
import { useRegisterSection } from '@/contexts/registerSec';
import { backEndUrl } from '@/api';
import axios from 'axios';

const CartSide = () => {
    const { isActive, setIsActive, purchases, setPurchases } = useCartSide();
    const { ownerInfo } = useOwner();
    const { activeLanguage } = useLanguage();
    const { client } = useClient();
    const { colors, activeTheme } = useTheme();
    const { setRegisterSectionExist } = useRegisterSection();
    const router = useRouter();
    const { setLoadingScreen } = useLoadingScreen();

    const [clientForm, setClientForm] = useState({ fullName: "", address: "", phone: "", note: "" });
    const [confirmBTNWorks, setConfirmBTNWorks] = useState(false);

    useEffect(() => {
        if(client) {
             setClientForm({
                fullName: client.fullName || "",
                address: client.address || "",
                phone: client.phone ? String(client.phone) : "",
                note: client.aiNote || ""
            });
        }
    }, [client]);

    useEffect(() => {
        setConfirmBTNWorks(
            !!(clientForm.fullName && clientForm.address && clientForm.phone && clientForm.phone.length >= 8 && purchases.length > 0)
        );
    }, [clientForm, purchases]);

    const handleConfirm = async () => {
        if (!confirmBTNWorks) return;
        if (!client?._id) return setRegisterSectionExist(true);

        setLoadingScreen(true);

        const purchasesId = purchases.map(p => p._id);
        
        // --- FIX APPLIED HERE ---
        const orderData = {
            clientId: client._id, // Keep this for backend logic if needed
            orderForm: { 
                ...clientForm, 
                client: client._id, // ADDED: This satisfies Mongoose's "client" required field
                shippingCost: ownerInfo?.shippingCost, // Spelled correctly as Cost
                clientNote: clientForm.note 
            }, 
            purchasesId 
        };

        try {
            const { data } = await axios.post(`${backEndUrl}/addOrder`, orderData);

            if (data.success) {
                setPurchases([]);
                setIsActive(false);
                router.push('/orders');
            }
        } catch (err: any) {
            console.error("Order Error:", err.response?.data?.message || "Error");
        } finally {
            setLoadingScreen(false);
        }
    };

    return (
        <div 
            className={`fixed inset-0 z-[100] transition-all duration-500 ease-in-out backdrop-blur-[2px] ${
                isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            onClick={() => setIsActive(false)}
        >
            <div 
                className={`
                    w-[90vw] sm:w-[450px] h-full absolute right-0 top-0 
                    flex flex-col shadow-2xl transition-transform duration-300
                    ${isActive ? "translate-x-0" : "translate-x-full"}
                `}
                style={{ backgroundColor: colors.light[100], color: colors.dark[200] }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* --- HEADER --- */}
                <div className='flex justify-between items-center px-6 py-5 border-b' style={{ borderColor: colors.light[300] }}>
                    <div className='flex gap-3 items-center'>
                        <img 
                            src={activeTheme === "dark" ? "/icons/shopping-bag-white.png" : "/icons/shopping-bag-black.png"} 
                            className='w-5 h-5 opacity-80' alt="cart" 
                        />
                        <h2 className='font-bold text-sm tracking-wide uppercase'>{activeLanguage.myCart}</h2>
                        <span className='px-2 py-0.5 rounded-xl text-[10px] font-bold opacity-60' style={{ backgroundColor: colors.light[300] }}>
                            {purchases.length}
                        </span>
                    </div>

                    <button onClick={() => setIsActive(false)} className='opacity-40 hover:opacity-100 transition-opacity p-2'>
                        <img src={`/icons/close-${activeTheme === "dark" ? "white" : "black"}.png`} className='w-3 h-3' alt="Close" />
                    </button>
                </div>

                {/* --- BODY --- */}
                <div className='flex-1 overflow-y-scroll px-2 sm:px-6 py-6 scrollbar-hidden'>
                    {purchases.length === 0 ? (
                        <div className='h-full flex flex-col justify-center items-center opacity-40 gap-4'>
                            <img src="/icons/shopping-bag-black.png" className="w-12 h-12 grayscale opacity-20" alt=""/>
                            <p className="text-sm font-medium uppercase tracking-widest">{activeLanguage.emptyCart}</p>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-8'>
                            <div className='flex flex-col gap-4'>
                                {purchases.map((purchase, index) => (
                                    <PurchaseItem key={purchase._id || index} purchase={purchase} setPurchases={setPurchases} />
                                ))}
                            </div>
                            
                            <div className='border-t border-dashed' style={{ borderColor: colors.light[300] }} />

                            <div className='space-y-6'>
                                <OrderData purchases={purchases} />
                                <div className='p-4 border rounded-xl' style={{ borderColor: colors.light[300], backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                                    <InputForm clientForm={clientForm} setClientForm={setClientForm} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- FOOTER --- */}
                <div className='p-5 border-t space-y-2 z-10' style={{ borderColor: colors.light[300], backgroundColor: colors.light[100] }}>
                    <button
                        className={`w-full h-12 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.99] flex items-center justify-center ${
                            confirmBTNWorks ? "hover:brightness-110" : "opacity-30 cursor-not-allowed grayscale"
                        }`}
                        style={{ backgroundColor: colors.dark[100], color: colors.light[100] }}
                        onClick={handleConfirm}
                    >
                        {activeLanguage.confirmOrder}
                    </button>
                    <button
                        className='w-full h-12 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all active:scale-[0.99]'
                        style={{ color: colors.dark[100], borderColor: colors.dark[100] }}
                        onClick={() => {router.push(`/orders`); setIsActive(false)}}
                    >
                        {activeLanguage.viewMyOrder}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartSide;