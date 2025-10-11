"use client";
import { ScreenContextType } from "@/types";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

export const ScreenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <ScreenContext.Provider value={{ screenWidth, setScreenWidth }}>
      {children}
    </ScreenContext.Provider>
  );
};

export const useScreen = (): ScreenContextType => {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error("useScreen must be used within a ScreenProvider");
  }
  return context;
};
