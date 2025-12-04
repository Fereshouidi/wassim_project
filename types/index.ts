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
    className?: string
    style?: CSSProperties
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
    searchIconClicked?: Function
    importedFrom?: 'header' | 'sidBar' | 'phoneHeader'
    containerStyle?: CSSProperties
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
        favorite: string,
        askAi: string,
        order: string
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
        password: string
        rePassword: string
        note: string
        resultsFound: string
        price: string
        color: string
        size: string
        type: string
        name: string
        date: string
        Oldest: string
        newest: string
        cheapest: string
        mostExpensive: string,
        max: string,
        min: string,
        priceZone: string
        all: string,
        filter: string,
        SortBy: string,
        confirm: string
    },
    register: string
    signIn: string
    signUp: string
    inputYourName: string
    inputYourPhone: string
    inputYourPassword: string
    inputYourPasswordAgain: string
    AlreadyHaveAnAccount: string
    DontHaveAnAccount: string
    connection: string
    welcomeMr: string
    welcomeBackMr: string
    thanksForJoining: string
    thanksForComingBack: string
    somethingWentWrongWhileSignUp: string
    AccountWithTheseNameAndPasswordNotFound: string
    allFildAreRequired: string
    addToCart: string
    inCart: string
    askAi: string
    contact: string
    aboutUs: string
    myCart: string
    cancel: string
    confirmOrder: string
    totalPrice: string
    shippingCoast: string
    totalAmmount: string
    emptyCart: string
    filYourCart: string
    here: string
    recommended: string
    forgotPassword: string

    // fullName: string
    // adress: string,
    // phone: number,
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

export interface OwnerInfoType {
  _id?: string ;
  name?: string;
  logo?: {
    dark?: string;
    light?: string;
  };
  socialMedia?: {
    platform?: string;
    icon?: string;
    link?: string;
  }[];
  contact: {
    email: string,
    phone: number
  },
  homeCollections?: CollectionType[];
  topCollections?: CollectionType[];
  shippingCost?: number;
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

export interface PurchaseType {
  _id?: string;
  client?: ProductType | string | null;
  product?: string | null;
  evaluation?: string | null;
  specification?: ProductSpecification | string | null;
  like?: boolean | null;
  quantity?: number | null;
  cart?: string | null;
  status?: "viewed" | "inCart" | "ordered" | 'delivered'
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface CartType {
  _id?: string;
  client?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export type CollectionWithProductsType = {
    _id?: string | null;
    name: language;
    thumbNail?: string | null;
    type: "private" | "public";
    display: "vertical" | "horizontal";
    products: ProductType[]
}

export type ProductSpecification = {
  _id?: string | null;
  color?: string | null;
  size?: string | null;
  type?: string | null;
  price?: number | null;
  quantity?: number | null;
}

export type ClientFormType = {
    fullName: string,
    adress: string,
    phone: string,
    note: string
}

export type ClientType = {
  _id?: string | null;
  fullName?: string;
  email?: string;
  token: number;
  phone?: number;
  password?: string;
  adress?: string;
  aiNote?: string;
};

export type FiltrationType = {
    price: {
        from: number
        to: number
    }
    collections: string[]
    colors: string[]
    types: string[]
    sizes: string[]

    sortBy: 'price' | 'name' | 'date'
    sortDirection: 'asc' | 'desc'

}

export type CustomSelectType = {
    options: OptionType[]
    currentOption: OptionType
    setCurrentOption: (value: OptionType) => void
    className?: string
    style?: CSSProperties
}

export type CustomSelectManyType = {
    label: string
    options: OptionType[]
    currentOptions: OptionType[]
    setCurrentOptions: (value: OptionType[]) => void
    className?: string
    style?: CSSProperties


}

export type OptionType = {
    value: string,
    label: string
}


export type SignUpForm = {
  fullName: string
  phone: string
  password: string
  retypePassword: string
}

export type SignInForm = {
  fullName: string
  password: string
}

export type LikeType = {
  _id?: string
  client: string;
  product: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
