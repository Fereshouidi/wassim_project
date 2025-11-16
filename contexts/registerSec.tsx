"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

type RegisterSectionContextType = {
  registerSectionExist: boolean;
  setRegisterSectionExist: (value: boolean) => void;
};

const RegisterSectionContext = createContext<RegisterSectionContextType | undefined>(undefined);

export const RegisterSectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [registerSectionExist, setRegisterSectionExist] = useState<boolean>(false);

  return (
    <RegisterSectionContext.Provider value={{ registerSectionExist, setRegisterSectionExist }}>
      {children}
    </RegisterSectionContext.Provider>
  );
};

export const useRegisterSection = (): RegisterSectionContextType => {
  const context = useContext(RegisterSectionContext);
  if (!context) {
    throw new Error("useRegisterSection must be used within a RegisterSectionProvider");
  }
  return context;
};
