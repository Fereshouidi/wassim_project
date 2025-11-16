"use client";

import { LanguageContextType, LanguageStracture } from "@/types";
import React, { createContext, ReactNode, useContext, useState, useMemo } from "react";
import { english, frensh } from "@/constent/language";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeLanguage, setActiveLanguage] = useState<LanguageStracture>(frensh);

  return (
    <LanguageContext.Provider value={{ activeLanguage, setActiveLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
