"use client";

import { backEndUrl } from "@/api";
import CollectionsSections from "@/componnent/main/collectionsSection";
import Footer from "@/componnent/main/footer";
import Header from "@/componnent/main/header";
import HomeCollections from "@/componnent/main/homeCollections";
import SideBar from "@/componnent/main/sideBar";
import AnnouncementBar from "@/componnent/sub/AnnouncementBar";
import LoadingScreen from "@/componnent/sub/loading/loadingScreen";
import SkeletonLoading from "@/componnent/sub/SkeletonLoading";
import { useLoadingScreen } from "@/contexts/loadingScreen";
import { useOwner } from "@/contexts/ownerInfo";
import { useScreen } from "@/contexts/screenProvider";
import { useTheme } from "@/contexts/themeProvider";
import { PubType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export default function HomeContent() {
    const [sideBarActive, setSideBarActive] = useState<boolean>(false);
    const { colors } = useTheme();
    const { screenWidth } = useScreen();
    const { setLoadingScreen } = useLoadingScreen();
    const { ownerInfo, setOwnerInfo } = useOwner();
    const [pub, setPub] = useState<PubType | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(backEndUrl + "/getPub")
                .then(({ data }) => setPub(data.pub))
                .catch((err) => {
                    console.log(err);
                })
        }
        fetchData();
    }, [])

    useEffect(() => {
        setLoadingScreen(false);
    }, [])

    if (!ownerInfo) return <LoadingScreen />

    return (
        <div
            className="page h-auto"
            style={{
                backgroundColor: colors.light[100]
            }}
        >
            <AnnouncementBar />
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
                        className="w-full h-full object-cover object-top max-h-[65vh]"
                        style={{
                            backgroundColor: colors.dark[800]
                        }}
                        alt="Hero Banner"
                    />
                    : <div className="h-[250px]">
                        <SkeletonLoading />
                    </div>
                }
            </div>

            <HomeCollections />
            <CollectionsSections importedFrom="homePage" />

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
                        alt="Bottom Banner"
                    />
                    : <div className="h-[250px]">
                        <SkeletonLoading />
                    </div>
                }
            </div>

            <Footer />
            <SideBar
                isActive={sideBarActive}
                setIsActive={setSideBarActive}
                ownerInfo={ownerInfo}
                setOwnerInfo={setOwnerInfo}
            />
        </div>
    );
}
