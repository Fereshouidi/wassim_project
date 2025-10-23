import { LanguageStracture } from "@/types";

export const english = {
    label: "english",
    language: "en",
    nav: {
        home: "Home",
        collection: "Collection",
        collections: "Collections",
        contact: "Contact Us"
    },
    sideMatter: {
        search: "Search",
        theme: {
            system: "System",
            dark: "Dark",
            light: "Light"
        },
        more: "get more",
        allCollections: "All of collections",
        noRes: "No result!",
        loading: "loading",
        aiMode: "ai mode"

    }
} as LanguageStracture;

export const frensh = {
    label: "français",
    language: "fr",
    nav: {
        home: "Accueil",
        collections: "Collections",
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
        more: "charger plus",
        allCollections: "Toutes les collections",
        noRes: "Aucun résultat!",
        loading: "chargement",
        aiMode: "mode IA"

    },

} as LanguageStracture;

export const languagesDispo = [frensh, english]

export const activeLanguage = frensh;