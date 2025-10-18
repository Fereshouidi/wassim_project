import { CSSProperties } from "react"

type language = {
    fr: string | null,
    en: string | null
}

export type ScreenContextType = {
    screenWidth: number
    setScreenWidth: (value: number) => void
}

export type SideBarProps = {
    isActive: boolean
    setIsActive: (value: boolean) => void
    ownerInfo?: OwnerInfoType 
    setOwnerInfo: (value: OwnerInfoType) => void
}

export type MenuIconProps = {
    isSideBarActive: boolean,
    setIsSideBarActive: (value: boolean) => void
}

export type HeaderProps = {
    isSideBarActive: boolean,
    setIsSideBarActive: (value: boolean) => void
    ownerInfo?: OwnerInfoType 
    setOwnerInfo: (value: OwnerInfoType) => void
}

export type SearchBarProps = {
    className?: string
    inputClassName?: string
    style?: CSSProperties ,
    inputStyle?: CSSProperties,
    searchIcon: string,
    searchIconClassName?: string,
    searchIconStyle?: CSSProperties,
    containerClassName?: string
}

export type Themes = "system" | "dark" | "light"

export type ThemeProps = {
  label: string
  theme: Themes
  icon: {
    dark: string,
    light: string
  }
}

export type ThemeContextType = {
    themeDispo: ThemeProps[]
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
        collections: string,
        contact: string,
    },
    sideMatter: {
        search: string,
        theme: {
            system: string,
            dark: string,
            light: string,
        },
        more: string,
        allCollections: string,
        noRes: string
    }
}

export type LanguageContextType = {
    activeLanguage: LanguageStracture
    setActiveLanguage: (value: LanguageStracture) => void
}



export type Colors = {
  light: Record<
    100 | 150 | 200 | 250 | 300 | 350 | 400 | 450 | 500 | 550 | 600 | 650 | 700 | 750 | 800 | 850 | 900,
    string
  >;
  dark: Record<
    100 | 150 | 200 | 250 | 300 | 350 | 400 | 450 | 500 | 550 | 600 | 650 | 700 | 750 | 800 | 850 | 900,
    string
  >;
};


export type PubType = {
    topBar?: {
        fr: string;
        en: string;
    };
    heroBanner?: {
        sm: string;
        md: string;
    };
    bottomBanner?: {
        sm: string;
        md: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export type OwnerInfoType = {
    _id?: string;
    name?: string;
    logo?: {
        dark?: string;
        light?: string;
    };
    socialMedia?: {
        facebook?: string;
        instagram?: string;
        gmail?: string;
    };
    homeCollections?: CollectionType[]
    createdAt?: Date;
    updatedAt?: Date;
}

export type ProductType = {
    _id?: string | null;
    name: language;
    price: number | null;
    thumbNail: string | null;
    images?: string[] | null;
    description?: string | null;
    collection: string | null;
    stock?: number | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export type CollectionType = {
    _id?: string | null;
    name: language;
    thumbNail?: string | null;
    type: "private" | "public";
    display: "vertical" | "horizontal"
}
