"use client";

import { colorsInsLightMode, colorsInsDarkMode } from "@/constent";
import { ThemeContextType, Themes } from "@/types";
import React, { createContext, ReactNode, useContext, useState, useMemo } from "react";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState<"light" | "dark">("light");

  const colors = useMemo(() => {
    return activeTheme === "dark" ? colorsInsDarkMode : colorsInsLightMode;
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
