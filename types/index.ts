import { CSSProperties } from "react"

type language = {
    fr: string | null,
    en: string | null
}

export type ScreenContextType = {
    screenWidth: number
    setScreenWidth: (value: number) => void
    screenHeight: number
    setScreenHeight: (value: number) => void
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
    searchInput?: string | null
}

export type SearchBarProps = {
    className?: string
    inputClassName?: string
    style?: CSSProperties ,
    inputStyle?: CSSProperties,
    searchIcon: string,
    searchIconClassName?: string,
    searchIconStyle?: CSSProperties,
    containerClassName?: string,
    resSectionStyle?: CSSProperties
    aiIconStyle?: CSSProperties,
    aiIconContentStyle?: CSSProperties
    searchInput?: string | null
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
        noRes: string,
        loading: string,
        colors: string,
        sizes: string,
        types: string,
        fillOutTheForm: string
        fullName: string
        adress: string
        phone: string
        note: string
        resultsFound: string
        price: string
        color: string
        name: string
        date: string
        Oldest: string
        newest: string
        cheapest: string
        mostExpensive: string
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
  name: {
    fr: string | null;
    en: string | null;
  };
  price: number | null;
  thumbNail: string | null;
  images: string[];
  description: {
    fr: string | null;
    en: string | null;
  };
  collections: string[];
  stock: number | null;
  specifications: ProductSpecification[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export type CollectionType = {
    _id?: string | null;
    name: language;
    thumbNail?: string | null;
    type: "private" | "public";
    display: "vertical" | "horizontal"
}

export type ProductSpecification = {
  color?: string | null;
  size?: string | null;
  type?: string | null;
  price?: number | null;
  quantity?: number | null;
}

export type ClientFormType = {
    fullName: string,
    adress: string,
    phone: number,
    note: string
}

export type FiltrationType = {
    price: {
        from: number
        to: number
    }
    collections: []
    colors: string[]
    types: string[]
    sizes: string[]

    Ranking: {
        price: "asc" | "desc"
        name: "asc" | "desc"
        date: "asc" | "desc"
    }

}