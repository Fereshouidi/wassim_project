import { LanguageStracture } from "@/types";

export const english = {
    label: "english",
    language: "en",
    nav: {
        home: "Home",
        collection: "Collection",
        collections: "Collections",
        contact: "Contact Us",
        askAi: "AskAi",
        favorite: "Favorite"
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
        note: "Note",
        resultsFound: "Results found",
        color: "color",
        price: "price",
        name: "name",
        date: "date",
        Oldest: "Oldest",
        newest: "newest",
        cheapest: "cheapest",
        mostExpensive: "most expensive",
        max: "Max",
        min: "Min",
        priceZone: "Price zone",
        all: "all",
        filter: "filter",
        SortBy: "Sort by",
        confirm: "confirm"

    }
} as LanguageStracture;

export const frensh = {
    label: "français",
    language: "fr",
    nav: {
        home: "Accueil",
        collections: "Collections",
        collection: "Collection",
        contact: "Contactez Nous",
        askAi: "Demande IA",
        favorite: "Favori"
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
        note: "Note",
        resultsFound: "Résultats trouvés",
        color: "couleur",
        price: "prix",
        name: "nom",
        date: "date",
        Oldest: "plus ancien",
        newest: "Plus récent",
        cheapest: "moins cher",
        mostExpensive: "plus cher",
        max: "Max",
        min: "Min",
        priceZone: "Zone de prix",
        all: "tout les",
        filter: "filter",
        SortBy: "Trier par",
        confirm: "confirmer"

    },

} as LanguageStracture;

export const languagesDispo = [frensh, english]

export const activeLanguage = frensh;