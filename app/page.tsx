"use client";
import { backEndUrl } from "@/api";
import Header from "@/componnent/main/header";
import HomeCollections from "@/componnent/main/homeCollections";
import SideBar from "@/componnent/main/sideBar";
import AnnouncementBar from "@/componnent/sub/AnnouncementBar";
import { useScreen } from "@/contexts/screenProvider";
import { useTheme } from "@/contexts/themeProvider";
import { PubType } from "@/types";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  const [sideBarActive, setSideBarActive] = useState<boolean>(false);
  const { colors } = useTheme();
  const [pub, setPub] = useState<PubType | undefined>(undefined);
  const { screenWidth } = useScreen();
  
  // useEffect(() => {
  //   console.log(pub);
  // }, [pub])

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(backEndUrl + "/getPub")
      .then(({data}) => setPub(data.pub))
      .catch((err) => {
        console.log(err);
        
      })
    }
    fetchData();
  }, [])

  return (
    <div className="page h-auto">

      {pub?.topBar && <AnnouncementBar
        topBar={pub?.topBar}
      />}

      <Header
        isSideBarActive={sideBarActive}
        setIsSideBarActive={setSideBarActive}
      />

      <div 
        className="w-full  bg-gray-500"
      >
        <img 
          src={screenWidth < 1000 ? pub?.heroBanner?.sm : pub?.heroBanner?.md}
          className="w-full h-full object-cover max-h-[70vh]" 
        />
      </div>

      <HomeCollections/>

        {/* <div 
          className="h-[5000px]"
          style={{
            backgroundColor: colors.light[200]
          }}
        >
          hhhhhhh
        </div> */}
        
      <SideBar
        isActive={sideBarActive}
        setIsActive={setSideBarActive}
      />
    </div>
  );
}
