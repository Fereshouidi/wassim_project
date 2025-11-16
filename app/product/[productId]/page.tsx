// app/product/[productId]/page.tsx
import ClientProductPage from "./ClientProductPage";
import { Metadata } from "next";
import axios from "axios";
import { backEndUrl } from "@/api";
import { ProductType, OwnerInfoType } from "@/types";

// ------------------------
// Metadata ديناميكية
// ------------------------
export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
  const productId = params.productId;

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

// ------------------------
// الصفحة الرئيسية
// ------------------------
export default async function ProductPage({ params }: { params: { productId: string } }) {
  const productId = params.productId;

  try {
    // جلب بيانات المنتج
    const { data } = await axios.get<{ product: ProductType }>(`${backEndUrl}/getProductById`, {
      params: { productId },
    });
    const product = data.product;

    // جلب بيانات صاحب المنتج
    const ownerRes = await axios.get<{ ownerInfo: OwnerInfoType }>(`${backEndUrl}/getOwnerInfo`, {
      params: { productId }, // إذا تحتاج تحديد المنتج
    });
    const ownerInfo = ownerRes.data.ownerInfo;

    if (!product) return <div>Product not found</div>;

    // تمرير البيانات إلى Client Component للتفاعل
    return <ClientProductPage product={product} ownerInfo={ownerInfo} />;
  } catch (err) {
    console.error(err);
    return <div>Failed to load product.</div>;
  }
}
