"use client";

import { colorsInsLightMode, colorsInsDarkMode } from "@/constent";
import { ThemeContextType, ThemeProps, Themes } from "@/types";
import React, { createContext, ReactNode, useContext, useState, useMemo } from "react";
import { useLanguage } from "./languageContext";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const { activeLanguage } = useLanguage();

  const [activeTheme, setActiveTheme] = useState<"light" | "dark">("light");
  const themeDispo = [
    {
      label: activeLanguage.sideMatter.theme.system,
      theme: "system",
      icon: {
        light: "/icons/settings-black.png",
        dark: "/icons/settings-white.png"
      }
    },
    {
      label: activeLanguage.sideMatter.theme.dark,
      theme: "dark",
      icon: {
        light: "/icons/night-mode-black.png",
        dark: "/icons/night-mode-white.png"
      }
    },
    {
      label: activeLanguage.sideMatter.theme.light,
      theme: "light",
      icon: {
        light: "/icons/sun-black.png",
        dark: "/icons/sun-white.png"
      }
    }

  ] as ThemeProps[]


  const colors = useMemo(() => {
    return activeTheme === "dark" ? colorsInsDarkMode : colorsInsLightMode;
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ themeDispo, activeTheme, setActiveTheme, colors }}>
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
