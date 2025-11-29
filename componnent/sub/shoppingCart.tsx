// import { colors } from '@/contexts/themeProvider'
import { backEndUrl } from '@/api';
import { useClient } from '@/contexts/client';
import { useSocket } from "@/contexts/soket";
import { useTheme } from '@/contexts/themeProvider'
import { PurchaseType } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CartSide from '../main/cartSide';
import { useScreen } from '@/contexts/screenProvider';

const ShoppingCart = () => {

    const { activeTheme, colors } = useTheme();
    const { screenWidth } = useScreen();
    const { client } = useClient();
    const socket = useSocket();
    const [purchases, setPurchases] = useState<PurchaseType[]>([]);
    const [ cartSideIsActive, setCartSideIsActive ] = useState<boolean>(false);

  
    const fetchPurchasesInCart = async () => {
        await axios.get( backEndUrl + "/getPurchasesInCartByClient", {
            params: {clientId: client?._id}
        })
        .then(({ data }) => {
            setPurchases(data.purchases);
            console.log(data);
        })
        .catch(( err ) => {
            console.log(err);
        })
    }

    useEffect(() => {
        fetchPurchasesInCart();
    }, [client])

    useEffect(() => {
        if (!socket || !client) return;

        socket.on("receive_update_purchase_result", async (data: any) => {
            fetchPurchasesInCart();            
        });

        // Clean up
        return () => {
            socket.off("receive_update_purchase_result");
        };
    }, [socket, client]);


  return (
    <div
        className='w-6 h-6 sm:w-7 sm:h-7 relative no-sellect cursor-pointer'
        onClick={() => {
            setCartSideIsActive(!cartSideIsActive);
        }}
    >

        <img  
            src={activeTheme == "dark" ? "/icons/shopping-bag-white.png" : "/icons/shopping-bag-black.png" }
            alt="" 
        />

        <span 
            className='absolute top-[-7px] rounded-full right-[-7px] bg-black text-white w-5 h-5 flex justify-center items-center sm:p-2 text-[10px] sm:text-sm'
            style={{
                backgroundColor: colors.dark[100],
                color: colors.light[100],
                borderRadius: "50%"
            }}
        >{purchases.length}</span>

        
        <CartSide
            isActive={cartSideIsActive}
            setIsActive={setCartSideIsActive}
            purchases={purchases}
            setPurchases={setPurchases}
        />

    </div>
  )
}

export default ShoppingCart
