"use client";

import { backEndUrl } from '@/api';
import { useClient } from '@/contexts/client';
// تم حذف استيراد useSocket
import { useTheme } from '@/contexts/themeProvider';
import { useCartSide } from '@/contexts/cart';
import axios from 'axios';
import React, { useEffect } from 'react';
import CartSide from '../main/cartSide';

const ShoppingCart = () => {
    const { activeTheme, colors } = useTheme();
    const { client } = useClient();
    const { setIsActive, purchases, setPurchases } = useCartSide();

    // جلب المشتريات الموجودة في السلة عند تحميل الصفحة لأول مرة
    const fetchPurchasesInCart = async () => {
        if (!client?._id) return;
        try {
            const { data } = await axios.get(`${backEndUrl}/getPurchasesInCartByClient`, {
                params: { clientId: client._id }
            });
            setPurchases(data.purchases || []); 
        } catch (err) {
            console.error("Error fetching cart items:", err);
        }
    }

    // يتم الجلب عند تغيير العميل (أو عند الدخول المباشر للرابط كما ناقشنا في البداية)
    useEffect(() => { 
        fetchPurchasesInCart(); 
    }, [client?._id]); 

    // تم حذف الـ useEffect الثاني الذي كان يحتوي على socket.on بالكامل

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
                
                {/* سيظل هذا الرقم محدثاً لأن setPurchases تُستدعى من المكونات الأخرى عبر الـ Context */}
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