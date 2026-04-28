import { Metadata } from "next";
import Home from "./home/page";

export const metadata: Metadata = {
  title: {
    default: "Silver Way | Boutique en Ligne de Bijoux en Argent",
    template: "%s | Silver Way",
  },
  description: "Découvrez notre collection exclusive de bijoux en argent massif. Bagues, colliers, bracelets et plus encore. Qualité supérieure et designs élégants.",
  keywords: ["bijoux", "argent", "silver", "boutique", "tunisie", "bagues", "parures"],
  authors: [{ name: "Silver Way Team" }],
  creator: "Silver Way",
  publisher: "Silver Way",
  applicationName: "Silver Way",
  metadataBase: new URL("https://silverway.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Silver Way | Bijoux en Argent d'Exception",
    description: "Élevez votre style avec notre sélection de bijoux artisanaux en argent.",
    url: "https://silver-way.vercel.app",
    siteName: "Silver Way",
    images: [
      {
        url: "/og-image.jpg", // Make sure this exists or replace with actual URL
        width: 1200,
        height: 630,
        alt: "Silver Way Collection",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Silver Way | Bijoux en Argent",
    description: "Bijoux en argent massif de qualité.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function App() {


  return (
    <Home/>
  );
}
