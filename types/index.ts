import { CSSProperties } from "react"

export type ScreenContextType = {
    screenWidth: number
    setScreenWidth: (value: number) => void
}

export type SideBarProps = {
    isActive: boolean
    setIsActive: (value: boolean) => void
}

export type MenuIconProps = {
    isSideBarActive: boolean,
    setIsSideBarActive: (value: boolean) => void
}

export type HeaderProps = {
    isSideBarActive: boolean,
    setIsSideBarActive: (value: boolean) => void
}

export type SearchBarProps = {
    className?: string
    inputClassName?: string
    style?: CSSProperties ,
    inputStyle?: CSSProperties,
    searchIcon: string,
    searchIconClassName?: string,
    searchIconStyle?: CSSProperties,
}

export type Themes = "system" | "dark" | "light"

export type ThemeContextType = {
    activeTheme: Themes
    setActiveTheme: (value: "light" | "dark") => void
    colors: Colors
}

export type LanguageStracture = {
    label: "english" | "français",
    language: "en" | "fr",
    nav: {
        home: string,
        collection: string,
        contact: string,
    },
    sideMatter: {
        search: string,
        theme: {
            system: string,
            dark: string,
            light: string,
        }
    }
}

export type LanguageContextType = {
    activeLanguage: LanguageStracture
    setActiveLanguage: (value: LanguageStracture) => void
}



export type Colors = {
  light: Record<100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>;
  dark: Record<100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>;
};
