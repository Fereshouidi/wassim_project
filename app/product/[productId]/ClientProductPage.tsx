"use client";

import { useState } from "react";
import { ProductType, OwnerInfoType, ProductSpecification } from "@/types";
import ImagesSwitcher from "@/componnent/main/imagesSwitcher";
import ProductDetails from "@/componnent/main/productDetails";
import OtherSimilarChose from "@/componnent/main/otherSimilarChose";
import SideBar from "@/componnent/main/sideBar";
import Footer from "@/componnent/main/footer";
import Header from "@/componnent/main/header";
import AnnouncementBar from "@/componnent/sub/AnnouncementBar";
import ProductActionPanel from "@/componnent/sub/ProductActionPanel";
import { useScreen } from "@/contexts/screenProvider";
import { useTheme } from "@/contexts/themeProvider";
import { handleShareOnFacebook } from "@/lib";

interface Props {
  product: ProductType;
  ownerInfo: OwnerInfoType;
}

export default function ClientProductPage({ product, ownerInfo }: Props) {
  const { screenWidth, screenHeight } = useScreen();
  const { colors } = useTheme();

  const [quantity, setQuantity] = useState(1);
  const [activeSpecifications, setActiveSpecifications] = useState<ProductSpecification | null>(null);
  const [sideBarActive, setSideBarActive] = useState(false);

  return (
    <div
      className="page bg-transparent pb-16"
      style={{ backgroundColor: colors.light[100], color: colors.dark[150] }}
    >
      <AnnouncementBar />
      <Header
        isSideBarActive={sideBarActive}
        setIsSideBarActive={setSideBarActive}
        ownerInfo={ownerInfo}
        setOwnerInfo={() => {}}
      />

      {/* Product section */}
      <div
        className={`w-full relative flex ${
          screenWidth > 1000 ? "h-[90vh] flex-row justify-center" : "flex-col items-center"
        } pt-5`}
        style={{ minHeight: screenHeight - 120 }}
      >
        <div
          className={`${
            screenWidth > 1000
              ? "w-24 h-[90%] flex flex-col gap-2 justify-center items-end"
              : "w-full flex flex-row gap-2 justify-center items-end"
          }`}
        >
          {ownerInfo.socialMedia?.map((media) => (
            <img
              key={media.platform}
              src={media.icon}
              onClick={() => media.platform === "Facebook" && handleShareOnFacebook(window.location.href)}
              className="w-10 h-10 cursor-pointer"
            />
          ))}
        </div>

        <div className={`flex flex-1 ${screenWidth > 1000 ? "h-[90vh] flex-row justify-center" : "flex-col items-center"}`}>
          {product.images?.length ? <ImagesSwitcher images={product.images} /> : <div>Loading images...</div>}
          <ProductDetails
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            activeSpecifications={activeSpecifications}
            setActiveSpecifications={setActiveSpecifications}
          />
        </div>
      </div>

      {product._id && <OtherSimilarChose product={product} />}
      <ProductActionPanel quantity={quantity} setQuantity={setQuantity} activeSpecifications={activeSpecifications} />
      <Footer />
      <SideBar isActive={sideBarActive} setIsActive={setSideBarActive} ownerInfo={ownerInfo} setOwnerInfo={() => {}} />
    </div>
  );
}
