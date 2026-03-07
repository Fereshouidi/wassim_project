import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

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
  metadataBase: new URL("https://silver-way.vercel.app"),
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

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
