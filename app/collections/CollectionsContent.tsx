"use client";

import { useOwner } from '@/contexts/ownerInfo';
import { useTheme } from '@/contexts/themeProvider';
import { useLoadingScreen } from '@/contexts/loadingScreen';
import Header from '@/componnent/main/header';
import CollectionsSections from '@/componnent/main/collectionsSection';
import Footer from '@/componnent/main/footer';
import SideBar from '@/componnent/main/sideBar';
import LoadingScreen from '@/componnent/sub/loading/loadingScreen';
import React, { useEffect, useState } from 'react';

export default function CollectionsContent() {
    const { colors } = useTheme();
    const [sideBarActive, setSideBarActive] = useState<boolean>(false);
    const { ownerInfo, setOwnerInfo } = useOwner();
    const { setLoadingScreen } = useLoadingScreen();

    useEffect(() => {
        setLoadingScreen(false);
    }, [setLoadingScreen])

    if (!ownerInfo) return <LoadingScreen />

    return (
        <div
            className="page min-h-screen"
            style={{
                backgroundColor: colors.light[150]
            }}
        >
            <Header
                isSideBarActive={sideBarActive}
                setIsSideBarActive={setSideBarActive}
                ownerInfo={ownerInfo}
                setOwnerInfo={setOwnerInfo}
            />

            <CollectionsSections
                importedFrom="collectionsPage"
            />

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
