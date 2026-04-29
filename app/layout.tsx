import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Silver Way",
    template: "%s | Silver Way",
  },
  description: "Bienvenue chez Silver Way✨\nChaque bijou raconte votre histoire.Découvrez l'élégance de notre collection de colliers,bracelets et bagues personnalisés.",
  keywords: ["bijoux", "argent", "silver", "silverway", "silver way", "boutique", "tunisie", "bagues", "parures"],
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
    url: "https://silverway.vercel.app",
    siteName: "Silver Way",
    images: [
      {
        url: "/og-image.jpg",
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
  verification: {
    google: "google-site-verification=suwjDEfgjXDVkX8898eCQZV0Vat9F77UQwd4eXTVdk0",
  },
};

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Silver Way",
      "url": "https://silverway.vercel.app"
    }),
  }}
/>

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
