"use client";

import { PurchaseType } from "@/types"; // Ensure this path is correct
import React, { createContext, ReactNode, useContext, useState } from "react";

type CartSideContextType = {
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  purchases: PurchaseType[];
  // This type definition fixes the "Argument of type..." error
  setPurchases: React.Dispatch<React.SetStateAction<PurchaseType[]>>;
};

const CartSideContext = createContext<CartSideContextType | undefined>(undefined);

export const CartSideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [purchases, setPurchases] = useState<PurchaseType[]>([]);

  return (
    <CartSideContext.Provider value={{ isActive, setIsActive, purchases, setPurchases }}>
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