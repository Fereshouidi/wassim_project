"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

type LoadingScreenType = {
  loadingScreen: boolean;
  setLoadingScreen: (value: boolean) => void;
};

const LoadingScreenContext = createContext<LoadingScreenType | undefined>(undefined);

export const LoadingScreenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loadingScreenExist, setLoadingScreenExist] = useState<boolean>(false);

  return (
    <LoadingScreenContext.Provider value={{ 
        loadingScreen: loadingScreenExist, 
        setLoadingScreen: setLoadingScreenExist 
    }}>
      {children}
    </LoadingScreenContext.Provider>
  );
};

export const useLoadingScreen = (): LoadingScreenType => {
  const context = useContext(LoadingScreenContext);
  if (!context) {
    throw new Error("useLoadingScreen must be used within a LoadingScreenProvider");
  }
  return context;
};
