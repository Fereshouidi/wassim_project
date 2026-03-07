import ClientProductPage from "./ClientProductPage";
import { Metadata } from "next";
import axios from "axios";
import { backEndUrl } from "@/api";
import { ProductType } from "@/types";
import ProductNotFound from "@/app/pages/productNotFound";

export async function generateMetadata({
  params
}: {
  params: Promise<{ productId: string }>
}): Promise<Metadata> {
  const { productId } = await params;

  try {
    const { data } = await axios.get<{ product: ProductType }>(`${backEndUrl}/getProductById`, {
      params: { productId },
    });
    const product = data.product;

    if (!product) return { title: "Produit non trouvé" };

    const title = product.name.fr || product.name.en || "Bijou en Argent";
    const description = product.description.fr || product.description.en || "Découvrez notre superbe bijou en argent massif.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [product.thumbNail ?? ""],
        url: `https://silver-way.vercel.app/product/${productId}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [product.thumbNail ?? ""],
      },
    };
  } catch (err) {
    return { title: "Boutique Silver Way" };
  }
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params;

  try {
    const { data } = await axios.get<{ product: ProductType }>(`${backEndUrl}/getProductById`, {
      params: { productId },
    });
    const product = data.product;

    if (!product) return <ProductNotFound />;

    // Create JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name.fr || product.name.en,
      "image": product.thumbNail,
      "description": product.description.fr || product.description.en,
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "TND",
        "availability": product.stock && product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "url": `https://silver-way.vercel.app/product/${productId}`
      }
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ClientProductPage product={product} />
      </>
    );
  } catch (err) {
    return <ProductNotFound />;
  }
}