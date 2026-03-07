import HomeContent from "./HomeContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bienvenue sur Silver Way - Boutique de Bijoux Argent Tunisie",
  description: "Découvrez notre large gamme de bagues, colliers, et parures en argent massif. Livraison rapide en Tunisie. Qualité garantie.",
  openGraph: {
    title: "Silver Way | Bijoux en Argent d'Exception",
    description: "Parcourez notre collection et trouvez le bijou parfait pour chaque occasion.",
    url: "https://silver-way.vercel.app/home",
    type: "website",
  },
};

export default function Page() {
  return <HomeContent />;
}
