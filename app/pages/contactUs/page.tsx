"use client";
import Footer from '@/componnent/main/footer';
import Header from '@/componnent/main/header';
import SideBar from '@/componnent/main/sideBar';
import AnnouncementBar from '@/componnent/sub/AnnouncementBar';
import LoadingScreen from '@/componnent/sub/loading/loadingScreen';
import { useLanguage } from '@/contexts/languageContext'
import { useOwner } from '@/contexts/ownerInfo';
import { useTheme } from '@/contexts/themeProvider';
import React, { useState } from 'react'

const ContactPage = () => {
    const [sideBarActive, setSideBarActive] = useState<boolean>(false);
    const { colors } = useTheme();
    const { ownerInfo, setOwnerInfo } = useOwner();
    const { activeLanguage } = useLanguage();

    if (!ownerInfo) return <LoadingScreen />

    return (
        <div className='min-h-screen flex flex-col' style={{ backgroundColor: colors.light[100] }}>
            <AnnouncementBar />

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

            <main className='flex-1 w-full flex flex-col justify-center py-20'>
                <div className='max-w-[1400px] mx-auto w-full px-6 sm:px-12'>
                    
                    {/* Header Section */}
                    <div className='mb-24 space-y-4'>
                        <h1 
                            className='text-5xl md:text-8xl font-black uppercase tracking-tighter'
                            style={{ color: colors.dark[100] }}
                        >
                            {activeLanguage.contact}.
                        </h1>
                        <div className='h-[1px] w-full opacity-20' style={{ backgroundColor: colors.dark[100] }} />
                    </div>

                    {/* Content Grid */}
                    <div className='grid grid-cols-1 lg:grid-cols-12 gap-16'>
                        
                        {/* Section 01: Support Details */}
                        <div className='lg:col-span-4 space-y-12'>
                            <div className='space-y-6'>
                                <p className='text-[10px] font-bold uppercase tracking-[0.4em] opacity-40' style={{ color: colors.dark[100] }}>
                                    01 / {activeLanguage.sideMatter?.contact || "Support"}
                                </p>
                                <div className='flex flex-col gap-8'>
                                    <div className='flex flex-col gap-2'>
                                        <span className='text-[10px] font-bold uppercase opacity-30'>Email</span>
                                        <a href={`mailto:${ownerInfo.contact.email}`} className='text-xl md:text-2xl font-bold hover:opacity-50 transition-opacity break-all underline underline-offset-8 decoration-1'>
                                            {ownerInfo.contact.email}
                                        </a>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <span className='text-[10px] font-bold uppercase opacity-30'>Phone</span>
                                        <a href={`tel:${ownerInfo.contact.phone}`} className='text-xl md:text-2xl font-bold hover:opacity-50 transition-opacity underline underline-offset-8 decoration-1'>
                                            {ownerInfo.contact.phone}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 02: Full Social Directory */}
                        <div className='lg:col-span-8 space-y-6'>
                            <p className='text-[10px] font-bold uppercase tracking-[0.4em] opacity-40' style={{ color: colors.dark[100] }}>
                                02 / {activeLanguage.sideMatter?.socialMedia || "Digital Directory"}
                            </p>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 pt-4'>
                                {ownerInfo.socialMedia?.map((media, index) => (
                                    <div key={index} className='group border-l-2 pl-6 py-2 transition-all' style={{ borderColor: `${colors.dark[100]}10` }}>
                                        <span className='text-[10px] font-black uppercase block mb-3 opacity-50 tracking-widest'>{media.platform}</span>
                                        <a 
                                            href={media.link} 
                                            target="_blank" 
                                            className='text-xs md:text-sm font-medium opacity-60 hover:opacity-100 break-all leading-relaxed transition-all block underline underline-offset-4 decoration-transparent hover:decoration-current'
                                            style={{ color: colors.dark[100] }}
                                        >
                                            {media.link}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default ContactPage;