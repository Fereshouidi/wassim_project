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
        aiMode: "ai mode",
        colors: "Colors",
        sizes: "Sizes",
        types: "Types",
        fillOutTheForm: "Fill out this form",
        fullName: "FULL Name",
        adress: "City ​​and address",
        phone: "Phone Number",
        note: "Note"


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
        aiMode: "mode IA",
        colors: "Couleurs",
        sizes: "Tailles",
        types: "Types",
        fillOutTheForm: "Remplissez ce formulaire",
        fullName: "Nom & Prénom",
        adress: "ville & adresse",
        phone: "Numéro de Téléphone",
        note: "Note"
    },

} as LanguageStracture;

export const languagesDispo = [frensh, english]

export const activeLanguage = frensh;