"use client";

import { backEndUrl } from "@/api";
import Footer from "@/componnent/main/footer";
import Header from "@/componnent/main/header";
import ImagesSwitcher from "@/componnent/main/imagesSwitcher";
import OtherSimilarChose from "@/componnent/main/otherSimilarChose";
import ProductDetails from "@/componnent/main/productDetails";
import SideBar from "@/componnent/main/sideBar";
import AnnouncementBar from "@/componnent/sub/AnnouncementBar";
import { headerHeight } from "@/constent";
import { fakeProducts } from "@/constent/data";
import { useScreen } from "@/contexts/screenProvider";
import { useTheme } from "@/contexts/themeProvider";
import { OwnerInfoType, ProductType } from "@/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductPage() {

  const params = useParams();
  const productId = params.productId;
  const [sideBarActive, setSideBarActive] = useState<boolean>(false);
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfoType | undefined>(undefined);
  const { screenWidth, screenHeight } = useScreen();
  const [product, setProduct] = useState<ProductType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const { colors } = useTheme();


  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        await axios.get(backEndUrl + "/getOwnerInfo")
        .then(({ data }) => {
            setOwnerInfo(data.ownerInfo);
            setLoading(false)
        })
        .catch((err) => {
            throw err
        })
    }
    fetchData();
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      await axios.get(backEndUrl + "/getProductById", { params: { productId } })
      .then(({ data }) => setProduct(data.product))
      .catch((err) => {
        console.log(err);
        })  
    }
    fetchProduct(); 
  }, [productId])

  return (
    <div 
        className="page bg-transparent"
        style={{
            backgroundColor: colors.light[150],
            color: colors.dark[150]
        }}
    >

      <AnnouncementBar/>
      <Header
        isSideBarActive={sideBarActive}
        setIsSideBarActive={setSideBarActive}
        ownerInfo={ownerInfo}
        setOwnerInfo={setOwnerInfo}
      />

      <div 
        className={`w-full min-h-screen sm:h-[90vh] relative flex ${screenWidth > 1000 ? 'flex-row justify-center' : 'flex-col items-center'} py-7`}
        style={{
            minHeight: screenHeight - (headerHeight * 1.5) 
        }}
    >
        <ImagesSwitcher
            images={product?.images || []}
            className=""
            style={{
                width: screenWidth > 1000 ? "40%" : "90%"
            }}
        />

        <ProductDetails
            product={product?? fakeProducts[0]}
            loadingGettingProduct={loading}
            style={{
                width: screenWidth > 1000 ? "40%" : "90%"
            }}
        />
      </div>

      {product?._id && <OtherSimilarChose
        product={product}
      />}

      <Footer/>

      <SideBar
        isActive={sideBarActive}
        setIsActive={setSideBarActive}
        ownerInfo={ownerInfo}
        setOwnerInfo={setOwnerInfo}
      />

    </div>
  );
}
