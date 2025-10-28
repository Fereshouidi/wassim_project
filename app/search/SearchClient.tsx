"use client";
import { backEndUrl } from '@/api';
import FilterBar from '@/componnent/main/filterBar';
import Footer from '@/componnent/main/footer';
import Header from '@/componnent/main/header';
import SideBar from '@/componnent/main/sideBar';
import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { FiltrationType, OwnerInfoType, PubType } from '@/types';
import axios from 'axios';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {

  const params = useSearchParams();
  const collectionId = params.get('collectionId');
  const searchInput = params.get('searchInput');
  const [sideBarActive, setSideBarActive] = useState<boolean>(false);
  const { colors } = useTheme();
  const [pub, setPub] = useState<PubType | undefined>(undefined);
  const { screenWidth } = useScreen();
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfoType | undefined>(undefined);
  // const [filtration, setFiltration] = useState<FiltrationType>({
  //     price: {
  //         from: 0,
  //         to: 999999999999
  //     }
  //     collections: []
  //     colors: string[]
  //     types: string[]
  //     sizes: string[]

  //     Ranking: {
  //         price: "asc" | "desc"
  //         name: "asc" | "desc"
  //         date: "asc" | "desc"
  //     }

  // });

  useEffect(() => {
    const fetchDefaultFiltration = async () => {
      await axios.get(backEndUrl + '/getMostProductExpensive')
      .then(({ data }) => {console.log({product: data.product})})
      .catch( (err) => {throw err})
    }
    fetchDefaultFiltration();
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

  }, [searchInput, ])

    useEffect(() => {
    console.log({ownerInfo});
    
  }, [ownerInfo])

  return (
    <div>
      <Header
        isSideBarActive={sideBarActive}
        setIsSideBarActive={setSideBarActive}
        ownerInfo={ownerInfo}
        setOwnerInfo={setOwnerInfo}
        searchInput={searchInput}
      />

      <FilterBar/>

      <div className='w-full min-h-screen'>
        {collectionId}
        <p>{searchInput}</p>
      </div>

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

export default Page
