import ClientProductPage from "./ClientProductPage";
import { Metadata } from "next";
import axios from "axios";
import { backEndUrl } from "@/api";
import { ProductType, OwnerInfoType, PurchaseType } from "@/types";

// Metadata ديناميكية
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ productId: string }> 
}): Promise<Metadata> {
  const { productId } = await params;

  console.log({productId});
  

  try {
    const { data } = await axios.get<{ product: ProductType }>(`${backEndUrl}/getProductById`, {
      params: { productId },
    });
    const product = data.product;

    if (!product) return { title: "Product not found" };

    return {
      title: product.name.en,
      description: product.description.en,
      openGraph: {
        title: product.name.en ?? "",
        description: product.description.en ?? "",
        images: [product.thumbNail ?? ""],
        url: `https://silver-way.vercel.app/product/${product._id}`,
        type: "website",
      },
    };
  } catch (err) {
    console.error(err);
    return { title: "Product not found" };
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

    // console.log({product: data.product});
    
    const product = data.product;


    // const ownerRes = await axios.get<{ ownerInfo: OwnerInfoType }>(`${backEndUrl}/getOwnerInfo`);
    // const ownerInfo = ownerRes.data.ownerInfo;

    if (!product) return <div>Product not found</div>;

    return <ClientProductPage product={product}  />;
  } catch (err) {
    console.error(err);
    return <div>Failed to load product.</div>;
  }
}