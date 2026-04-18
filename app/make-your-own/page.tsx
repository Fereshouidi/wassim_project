"use client";

import React, { useEffect } from 'react';
import Header from "@/componnent/main/header";
import AnnouncementBar from "@/componnent/sub/AnnouncementBar";
import LoadingScreen from "@/componnent/sub/loading/loadingScreen";
import { useLoadingScreen } from "@/contexts/loadingScreen";
import { useOwner } from "@/contexts/ownerInfo";
import { useTheme } from "@/contexts/themeProvider";
import Customizer from "@/componnent/main/Customizer";
import Footer from '@/componnent/main/footer';
import { headerHeight, headerHeightForPhones } from '@/constent';
import { useScreen } from '@/contexts/screenProvider';

export default function MakeYourOwnPage() {
    const { colors } = useTheme();
    const { setLoadingScreen } = useLoadingScreen();
    const { ownerInfo, setOwnerInfo } = useOwner();
    const { screenWidth } = useScreen();


    if (!ownerInfo) return <LoadingScreen />;

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                backgroundColor: colors.light[100]
            }}
        >
            <AnnouncementBar />
            <Header
                ownerInfo={ownerInfo}
                setOwnerInfo={setOwnerInfo}
            />
            
            <main 
                className="flex-1 mb-5"
                style={{
                    minHeight: screenWidth > 1000 ? `calc(100vh - ${headerHeight}px)` : `calc(100vh - ${headerHeightForPhones}px)`
                }}
            >
                <Customizer />
            </main>

            <Footer/>
        </div>
    );
}
