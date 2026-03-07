import CollectionsContent from "./CollectionsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nos Collections de Bijoux en Argent | Silver Way",
    description: "Explorez nos collections exclusives : Bagues, Colliers, Bracelets et plus encore. Chaque pièce est conçue pour sublimer votre élégance.",
    openGraph: {
        title: "Toutes les Collections Silver Way",
        description: "Trouvez le bijou en argent massif qui vous ressemble parmi nos collections.",
        url: "https://silver-way.vercel.app/collections",
        type: "website",
    },
};

export default function Page() {
    return <CollectionsContent />;
}
