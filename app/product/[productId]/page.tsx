"use client";

import { backEndUrl } from "@/api";
import Footer from "@/componnent/main/footer";
import Header from "@/componnent/main/header";
import ImagesSwitcher from "@/componnent/main/imagesSwitcher";
import ProductDetails from "@/componnent/main/productDetails";
import SideBar from "@/componnent/main/sideBar";
import AnnouncementBar from "@/componnent/sub/AnnouncementBar";
import { headerHeight } from "@/constent";
import { useScreen } from "@/contexts/screenProvider";
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


  useEffect(() => {
    const fetchData = async () => {
      await axios.get(backEndUrl + "/getOwnerInfo")
      .then(({ data }) => setOwnerInfo(data.ownerInfo))
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
    <div className="page">

      <AnnouncementBar/>
      <Header
        isSideBarActive={sideBarActive}
        setIsSideBarActive={setSideBarActive}
        ownerInfo={ownerInfo}
        setOwnerInfo={setOwnerInfo}
      />

      <div 
        className={`w-full min-h-screen flex ${screenWidth > 1000 ? 'flex-row justify-center' : 'flex-col items-center'} py-7`}
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
            style={{
                width: screenWidth > 1000 ? "40%" : "90%"
            }}
        />
      </div>

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
