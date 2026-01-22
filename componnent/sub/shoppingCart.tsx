"use client";

import { backEndUrl } from '@/api';
import { useClient } from '@/contexts/client';
import { useSocket } from "@/contexts/soket";
import { useTheme } from '@/contexts/themeProvider';
import { useCartSide } from '@/contexts/cart';
import axios from 'axios';
import React, { useEffect } from 'react';
import CartSide from '../main/cartSide';

const ShoppingCart = () => {
    const { activeTheme, colors } = useTheme();
    const { client } = useClient();
    const socket = useSocket();
    const { setIsActive, purchases, setPurchases } = useCartSide();

    const fetchPurchasesInCart = async () => {
        if (!client?._id) return;
        try {
            const { data } = await axios.get(`${backEndUrl}/getPurchasesInCartByClient`, {
                params: { clientId: client._id }
            });
            setPurchases(data.purchases || []); 
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => { fetchPurchasesInCart(); }, [client]);

    useEffect(() => {
        if (!socket || !client) return;
        socket.on("receive_update_purchase_result", (data: any) => {
            setPurchases((prev) => {
                const exists = prev.some((p) => p._id === data.purchase?._id);
                if (exists) {
                    if (!data.purchase.cart) return prev.filter((p) => p._id !== data.purchase._id);
                    return prev.map((p) => p._id === data.purchase._id ? data.purchase : p);
                } else {
                    if (!data.purchase?.cart) return prev;
                    return [...prev, data.purchase];
                }
            });
        });
        return () => { socket.off("receive_update_purchase_result"); };
    }, [socket, client]);

    return (
        <>
            <div
                className='w-6 h-6 sm:w-7 sm:h-7 relative cursor-pointer active:scale-90 transition-transform'
                onClick={() => setIsActive(true)}
            >
                <img  
                    src={activeTheme === "dark" ? "/icons/shopping-bag-white.png" : "/icons/shopping-bag-black.png" }
                    alt="Cart" 
                    className="w-full h-full object-contain"
                />
                {purchases.length > 0 && (
                    <span 
                        className='absolute -top-2 -right-2 w-5 h-5 flex justify-center items-center text-[11px] font-bold rounded-full'
                        style={{ backgroundColor: colors.dark[100], color: colors.light[100] }}
                    >
                        {purchases.length}
                    </span>
                )}
            </div>
            <CartSide />
        </>
    );
}

export default ShoppingCart;