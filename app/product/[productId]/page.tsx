import ClientProductPage from "./ClientProductPage";
import { Metadata } from "next";
import axios from "axios";
import { backEndUrl } from "@/api";
import { ProductType, OwnerInfoType } from "@/types";

interface Params {
  productId: string;
}

// Metadata function
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const productId = params.productId;

  try {
    const { data } = await axios.get<{ product: ProductType }>(backEndUrl + "/getProductById", {
      params: { productId },
    });

    const product = data.product;

    if (!product) return { title: "Product not found" };

    return {
      title: product.name.en,
      description: product.description.en,
      openGraph: {
        title: product.name.en,
        description: product.description.en,
        images: [product.thumbNail],
        url: `https://silver-way.vercel.app/product/${product._id}`,
        type: "website", // valid OpenGraph type
      },
    };
  } catch (err) {
    console.error(err);
    return { title: "Product not found" };
  }
}

// Server page
export default async function ProductPage({ params }: { params: Params }) {
  const productId = params.productId;

  try {
    const { data } = await axios.get<{ product: ProductType }>(backEndUrl + "/getProductById", {
      params: { productId },
    });
    const product = data.product;

    const ownerRes = await axios.get<{ ownerInfo: OwnerInfoType }>(backEndUrl + "/getOwnerInfo");
    const ownerInfo = ownerRes.data.ownerInfo;

    if (!product) return <div>Product not found</div>;

    // **Pass data directly to client component**
    return <ClientProductPage product={product} ownerInfo={ownerInfo} />;
  } catch (err) {
    console.error(err);
    return <div>Failed to load product.</div>;
  }
}
