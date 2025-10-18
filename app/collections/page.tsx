"use client";
import { backEndUrl } from '@/api';
import CollectionsSections from '@/componnent/main/collectionsSection';
import Footer from '@/componnent/main/footer';
import Header from '@/componnent/main/header';
import SideBar from '@/componnent/main/sideBar';
import { useTheme } from '@/contexts/themeProvider'
import { OwnerInfoType } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Page = () => {

    const { colors } = useTheme();
    const [sideBarActive, setSideBarActive] = useState<boolean>(false);
    const [ownerInfo, setOwnerInfo] = useState<OwnerInfoType | undefined>(undefined);

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
        <div
            className="page h-auto"
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

            <Footer/>
        
            <SideBar
                isActive={sideBarActive}
                setIsActive={setSideBarActive}
                ownerInfo={ownerInfo}
                setOwnerInfo={setOwnerInfo}
            />

        </div>
    )
}

export default Page;
