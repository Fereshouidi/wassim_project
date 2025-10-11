"use client";
import Header from "@/componnent/main/header";
import SideBar from "@/componnent/main/sideBar";
import AnnouncementBar from "@/componnent/sub/AnnouncementBar";
import { useTheme } from "@/contexts/themeProvider";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  const [sideBarActive, setSideBarActive] = useState<boolean>(false);
  const { colors } = useTheme();

  return (
    <div className="page">
      <AnnouncementBar/>
      <Header
        isSideBarActive={sideBarActive}
        setIsSideBarActive={setSideBarActive}
      />

        <div 
          className="h-[5000px]"
          style={{
            backgroundColor: colors.light[200]
          }}
        >
          hhhhhhh
        </div>
        
      <SideBar
        isActive={sideBarActive}
        setIsActive={setSideBarActive}
      />
    </div>
  );
}
