"use client";
import Footer from '@/componnent/main/footer';
import Header from '@/componnent/main/header';
import SideBar from '@/componnent/main/sideBar';
import AnnouncementBar from '@/componnent/sub/AnnouncementBar';
import LoadingScreen from '@/componnent/sub/loading/loadingScreen';
import { headerHeight } from '@/constent';
import { useLanguage } from '@/contexts/languageContext'
import { useLoadingScreen } from '@/contexts/loadingScreen';
import { useOwner } from '@/contexts/ownerInfo';
import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import React, { useState } from 'react'

const Page = () => {

    const { setLoadingScreen } = useLoadingScreen();
    const [sideBarActive, setSideBarActive] = useState<boolean>(false);
    const { colors } = useTheme();
    const { screenWidth } = useScreen();
    const { ownerInfo, setOwnerInfo } = useOwner();
    const { activeLanguage } = useLanguage();

    if (!ownerInfo) return <LoadingScreen/>

    return (
        <div className=''>

            <AnnouncementBar/>

            <Header
                isSideBarActive={sideBarActive}
                setIsSideBarActive={setSideBarActive}
                ownerInfo={ownerInfo}
                setOwnerInfo={setOwnerInfo}
            />

            <SideBar
                isActive={sideBarActive}
                setIsActive={setSideBarActive}
                ownerInfo={ownerInfo}
                setOwnerInfo={setOwnerInfo}
            />

            <div 
                className='w-full py-10 sm:pt-20 px-10- px-5 sm:px-52'
                style={{
                    // minHeight: `calc(100vh - ${headerHeight*1.5}px)`
                }}
            >

                <h2 
                    className='font-semibold text-2xl sm:text-2xl mb-7'
                    style={{
                        color: colors.dark[100]
                    }}
                >{activeLanguage.contact}</h2>

                <p className='font-semibold text-lg mt-5 mb-3'>Comment pouvons-nous vous aidez ?</p>

                <div>
                    <h4 className='font-semibold text-md my-2'>contacter-nous par e-mail:</h4>
                    <p className='font-medium text-[14px] my-2'>{ownerInfo.contact.email}</p>
                </div>

                <div>
                    <h4 className='font-semibold text-md my-2'>Par téléphone:</h4>
                    <p className='font-normal text-[14px] my-2'>{ownerInfo.contact.phone}</p>
                </div>

                <div>
                    {ownerInfo.socialMedia?.map( (media, index) => (
                        <div key={index}>
                            <h4 className='font-semibold text-md my-2'>{media.platform}</h4>
                            <p className='font-normal text-[14px] my-2'>{media.link}</p>
                        </div>
                    ))}
                </div>


            </div>

            <Footer />
            
        </div>
    )
}

export default Page
