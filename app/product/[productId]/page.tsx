"use client";

import { backEndUrl } from "@/api";
import Footer from "@/componnent/main/footer";
import Header from "@/componnent/main/header";
import ImagesSwitcher from "@/componnent/main/imagesSwitcher";
import SideBar from "@/componnent/main/sideBar";
import AnnouncementBar from "@/componnent/sub/AnnouncementBar";
import { headerHeight } from "@/constent";
import { useScreen } from "@/contexts/screenProvider";
import { OwnerInfoType } from "@/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductPage() {

  const params = useParams();
  const productId = params.productId;
  const [sideBarActive, setSideBarActive] = useState<boolean>(false);
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfoType | undefined>(undefined);
  const { screenHeight } = useScreen();


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
        className="w-full min-h-screen"
        style={{
            minHeight: screenHeight - (headerHeight * 1.5) 
        }}
    >
        <ImagesSwitcher/>
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
