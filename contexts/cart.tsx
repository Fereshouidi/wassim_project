"use client";

import { backEndUrl } from "@/api";
import { CartType, PurchaseType } from "@/types"; // Ensure this path is correct
import axios from "axios";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useClient } from "./client";

type CartSideContextType = {
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  purchases: PurchaseType[];
  setPurchases: React.Dispatch<React.SetStateAction<PurchaseType[]>>;
  cart?: CartType;
  setCart?: (value: CartType) => void;
  fetchPurchasesInCart: () => Promise<void>;
};

const CartSideContext = createContext<CartSideContextType | undefined>(undefined);

export const CartSideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [purchases, setPurchases] = useState<PurchaseType[]>([]);
  const [cart, setCart] = useState<CartType | undefined>(undefined);
  const { client } = useClient();

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
  };

  useEffect(() => {
    const fetchCart = async () => {
      axios.get(`${backEndUrl}/getCartByClient`, { params: { clientId: client?._id } })
        .then(({ data }) => setCart(data.cart))
        .catch((err) => console.log({ err }));
    };
    fetchCart();
    fetchPurchasesInCart();
  }, [client]);

  return (
    <CartSideContext.Provider value={{ isActive, setIsActive, purchases, setPurchases, cart, setCart, fetchPurchasesInCart }}>
      {children}
    </CartSideContext.Provider>
  );
};

export const useCartSide = (): CartSideContextType => {
  const context = useContext(CartSideContext);
  if (!context) {
    throw new Error("useCartSide must be used within a CartSideProvider");
  }
  return context;
};