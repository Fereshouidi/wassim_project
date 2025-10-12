import { LanguageStracture } from "@/types";

export const english = {
    label: "english",
    language: "en",
    nav: {
        home: "Home",
        collection: "Collection",
        contact: "Contact Us"
    },
    sideMatter: {
        search: "Search",
        theme: {
            system: "System",
            dark: "Dark",
            light: "Light"
        },
        more: "get more"
    }
} as LanguageStracture;

export const frensh = {
    label: "français",
    language: "fr",
    nav: {
        home: "Accueil",
        collection: "Collection",
        contact: "Contactez Nous"
    },
    sideMatter: {
        search: "Recherche",
        theme: {
            system: "Système",
            dark: "Sombre",
            light: "Clair"
        },
        more: "charger plus"
    },

} as LanguageStracture;

export const languagesDispo = [frensh, english]

export const activeLanguage = frensh;