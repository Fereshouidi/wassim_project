import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";



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
