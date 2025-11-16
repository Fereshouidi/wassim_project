"use client";
import { backEndUrl } from "@/api";
import CollectionsSections from "@/componnent/main/collectionsSection";
import Footer from "@/componnent/main/footer";
import Header from "@/componnent/main/header";
import HomeCollections from "@/componnent/main/homeCollections";
import SideBar from "@/componnent/main/sideBar";
import AnnouncementBar from "@/componnent/sub/AnnouncementBar";
import SkeletonLoading from "@/componnent/sub/SkeletonLoading";
import { useLoadingScreen } from "@/contexts/loadingScreen";
import { useScreen } from "@/contexts/screenProvider";
import { useTheme } from "@/contexts/themeProvider";
import { OwnerInfoType, PubType } from "@/types";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  const [sideBarActive, setSideBarActive] = useState<boolean>(false);
  const { colors } = useTheme();
  // const [pub, setPub] = useState<PubType | undefined>(undefined);
  const { screenWidth } = useScreen();
  const { setLoadingScreen } = useLoadingScreen();
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfoType | undefined>(undefined);
  const [pub, setPub] = useState<PubType | undefined>(undefined);


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
    setLoadingScreen(false);
  }, [])


  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await axios.get(backEndUrl + "/getPub")
  //     .then(({data}) => setPub(data.pub))
  //     .catch((err) => {
  //       console.log(err);
        
  //     })
  //   }
  //   fetchData();
  // }, [])

  // if (!ownerInfo) return <div>loading</div>

  return (
    <div 
      className="page h-auto"
      style={{
        backgroundColor: colors.light[100]
      }}
    >

      <AnnouncementBar
      />

      <Header
        isSideBarActive={sideBarActive}
        setIsSideBarActive={setSideBarActive}
        ownerInfo={ownerInfo}
        setOwnerInfo={setOwnerInfo}
      />

      <div 
        className="w-full"
        style={{
          backgroundColor: colors.dark[800]
        }}
      >
        {pub?.heroBanner ?
          <img 
            src={screenWidth < 1000 ? pub?.heroBanner?.sm : pub?.heroBanner?.md}
            className="w-full h-full object-cover object-top max-h-[70vh]" 
            style={{
              backgroundColor: colors.dark[800]
            }}
          />
          : <div className="h-[250px]">
              <SkeletonLoading/>
          </div>
        }
      </div>


      <HomeCollections/>

      <CollectionsSections
        importedFrom="homePage"
      />

      <div 
        className="w-full my-10"
        style={{
          backgroundColor: colors.dark[800]
        }}
      >
        {pub?.bottomBanner ?
          <img 
            src={screenWidth < 1000 ? pub?.bottomBanner?.sm : pub?.bottomBanner?.md}
            className="w-full h-full object-cover object-top max-h-[60vh]" 
            style={{
              backgroundColor: colors.dark[800]
            }}
          />
          : <div className="h-[250px]">
              <SkeletonLoading/>
          </div>
        }
      </div>

      <Footer/>

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
        ownerInfo={ownerInfo}
        setOwnerInfo={setOwnerInfo}
      />
    </div>
  );
}
