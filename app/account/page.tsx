"use client";
import { backEndUrl } from '@/api';
import Footer from '@/componnent/main/footer';
import Header from '@/componnent/main/header';
import SideBar from '@/componnent/main/sideBar';
import AnnouncementBar from '@/componnent/sub/AnnouncementBar';
import { ErrorBanner } from '@/componnent/sub/banners/errorBanner';
import VerificationAccountBanner from '@/componnent/sub/banners/verificationAccountBanner';
import CustomInputText from '@/componnent/sub/customInputText';
import LoadingScreen from '@/componnent/sub/loading/loadingScreen';
import { headerHeight } from '@/constent';
import { useClient } from '@/contexts/client';
import { useLanguage } from '@/contexts/languageContext';
import { useLoadingScreen } from '@/contexts/loadingScreen';
import { useOwner } from '@/contexts/ownerInfo';
import { useScreen } from '@/contexts/screenProvider';
import { useStatusBanner } from '@/contexts/StatusBanner';
import { useTheme } from '@/contexts/themeProvider';
import { isValidEmail, isValidPhone } from '@/lib';
import { ClientType } from '@/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const AccountPage = () => {

    const route = useRouter();
    const { client, setClient } = useClient();
    const { setLoadingScreen } = useLoadingScreen();
    const [sideBarActive, setSideBarActive] = useState<boolean>(false);
    const { colors, activeTheme } = useTheme(); // Added activeTheme
    const { ownerInfo, setOwnerInfo } = useOwner();
    const [ updatedClient, setUpdatedClient ] = useState<ClientType | undefined>(undefined);
    const { setStatusBanner } = useStatusBanner();
    const [ verificationAccountBannerVisible, setVerificationAccountBannerVisible ] = useState<boolean>(false);
    const { activeLanguage } = useLanguage();
    const { screenWidth } = useScreen();

    // Determine if we are in Dark Mode for styling
    const isDark = activeTheme === 'dark';

    useEffect(() => {
        if (!client) return;
        setUpdatedClient(client as unknown as ClientType);
    }, [client])

    useEffect(() => {
        setLoadingScreen(false);
    }, [])

    const handleSubmit = async () => {
        // 1. Validation check
        if (!isValidEmail(updatedClient?.email?? "")) {
            setStatusBanner(true, null, <ErrorBanner show={true} message="Please enter a valid email address" />);
            setTimeout(() => setStatusBanner(false), 3500);
            return; 
        }

        if (!isValidPhone(updatedClient?.phone?? "" )) {
            setStatusBanner(true, null, <ErrorBanner show={true} message="Phone number must be exactly 8 digits" />);
            setTimeout(() => setStatusBanner(false), 3500);
            return; 
        }

        // 2. Contact Backend
        setLoadingScreen(true);
        try {
            const response = await axios.put(backEndUrl + "/updateClient", {
                updatedClientData: updatedClient
            });

            setLoadingScreen(false);
            const isVerificationNeeded = response.data.message && response.data.message.includes("check your new email");

            if (isVerificationNeeded) {
                setVerificationAccountBannerVisible(true);
            } else {
                setStatusBanner(
                    true,
                    "Your information has been updated successfully!",
                    null,
                    "p-7 text-green-500",
                    { backgroundColor: colors.light[100] }
                );
                setTimeout(() => setStatusBanner(false), 3500);
            }
        } catch (err: any) {
            setLoadingScreen(false);
            const errorMessage = err.response?.data?.message || err.message || "Failed to update client";
            setStatusBanner(true, null, <ErrorBanner show={true} message={errorMessage} />);
            setTimeout(() => setStatusBanner(false), 3500);
        }
    }

    if (!ownerInfo || !updatedClient) return <LoadingScreen/>

    return (
        <div
            className='w-full min-h-screen flex flex-col'
            style={{
                backgroundColor: colors.light[100], // Or a neutral background like #f8fafc
                color: colors.dark[200]
            }}
        >
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
                setOwnerInfo={() => {}}
            />

            {/* --- Main Content Area --- */}
            <div 
                className='flex-grow flex justify-center py-12 px-4 ms:px-8'
                style={{ paddingTop: screenWidth > 1000 ? headerHeight : 10 }}
            >
                <div
                    className='w-full max-w-5xl flex flex-col rounded-sm overflow-hidden transition-all duration-300'
                    style={{
                        backgroundColor: isDark ? 'rgba(30,30,30,0.6)' : 'white',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                        boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.05)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {/* --- Card Header --- */}
                    <div className="px-8 py-8 border-b border-gray-100 dark:border-gray-800">
                        <h2 className='text-3xl font-bold tracking-tight'>
                            {activeLanguage.yourInfomations}
                        </h2>
                        <p className="mt-2 text-sm opacity-60">
                            Update your personal details and manage your account settings.
                        </p>
                    </div>

                    {/* --- Card Body (Form) --- */}
                    <div className='p-4 sm:p-10'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 w-full'>
                            
                            <CustomInputText
                                label={activeLanguage.sideMatter.fullName}
                                type='text'
                                className="w-full"
                                labelClassName='font-semibold mb-2 block text-sm'
                                placeholder={activeLanguage.inputYourName + "..."}
                                inputClassName='w-full px-4 py-3 rounded-sm border  rounded transition-all  bg-transparent'
                                defaultValue={updatedClient?.fullName}
                                onChange={(e) => setUpdatedClient({ ...updatedClient, fullName: e.target.value })}
                                maxLength={25}
                            />
                            
                            <CustomInputText
                                label={activeLanguage.sideMatter.phone}
                                type='tel'
                                className="w-full"
                                labelClassName='font-semibold mb-2 block text-sm'
                                placeholder={activeLanguage.inputYourPhone + "..."}
                                inputClassName='w-full px-4 py-3 rounded-sm border  rounded transition-all  bg-transparent'
                                defaultValue={updatedClient?.phone?.toString()}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val.length <= 8) setUpdatedClient({ ...updatedClient, phone: Number(val) });
                                }}
                                maxLength={8}
                            />
                            
                            <CustomInputText
                                label={activeLanguage.sideMatter.email}
                                type='text'
                                className="w-full"
                                labelClassName='font-semibold mb-2 block text-sm'
                                placeholder={activeLanguage.inputYourEmail + "..."}
                                inputClassName='w-full px-4 py-3 rounded-sm  rounded transition-all  bg-transparent'
                                defaultValue={updatedClient?.email}
                                onChange={(e) => setUpdatedClient({ ...updatedClient, email: e.target.value })}
                                maxLength={50}
                            />
                            
                            <CustomInputText
                                label={activeLanguage.sideMatter.address}
                                type='text'
                                className="w-full"
                                labelClassName='font-semibold mb-2 block text-sm'
                                placeholder={activeLanguage.sideMatter.address}
                                inputClassName='w-full px-4 py-3 rounded-sm border border-gray-200   rounded transition-all  bg-transparent'
                                defaultValue={updatedClient?.address}
                                onChange={(e) => setUpdatedClient({ ...updatedClient, address: e.target.value })}
                                maxLength={100}
                            />
                            
                            <CustomInputText
                                label={activeLanguage.sideMatter.password}
                                type='text' // Consider changing to 'password' for security
                                className="w-full"
                                labelClassName='font-semibold mb-2 block text-sm'
                                placeholder={activeLanguage.inputYourPassword + "..."}
                                inputClassName='w-full px-4 py-3 rounded-sm border  rounded transition-all  bg-transparent'
                                defaultValue={updatedClient?.password}
                                onChange={(e) => setUpdatedClient({ ...updatedClient, password: e.target.value })}
                            />
                    
                            <CustomInputText
                                label={activeLanguage.dateOfBirth}
                                type="date"
                                className="w-full"
                                labelClassName='font-semibold mb-2 block text-sm'
                                placeholder={activeLanguage.inputYourDateOfBirth} 
                                inputClassName='w-full px-4 py-3 rounded-sm border  rounded transition-all  bg-transparent'
                                //@ts-ignore
                                defaultValue={updatedClient?.dateOfBirth ? new Date(updatedClient.dateOfBirth).toISOString().slice(0, 10) : ''}
                                onChange={(e) => setUpdatedClient({ ...updatedClient, //@ts-ignore
                                    dateOfBirth: new Date(e.target.value) })}
                            />
                        </div>

                        {/* --- Action Buttons --- */}
                        <div className='w-full mt-12 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100 dark:border-gray-800'>

                            {/* Logout Button (Ghost Style for Secondary/Destructive) */}
                            <button
                                className='group flex items-center justify-center gap-2 px-6 py-3 rounded-sm text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full sm:w-auto'
                                onClick={() => {
                                    setLoadingScreen(true);
                                    localStorage.removeItem('clientToken');
                                    setClient(null);
                                    route.push('/');
                                    setLoadingScreen(false);
                                }}
                            >
                                <img
                                    src="/icons/logout-red.png" // Ensure this icon works on light bg, or use CSS filter
                                    className='w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity invert dark:invert-0' // Invert colors for light mode if icon is white
                                    alt="Logout"
                                />
                                <span>{activeLanguage.logOut}</span>
                            </button>

                            {/* Submit Button (Solid Primary) */}
                            <button
                                className='w-full sm:w-auto min-w-[150px] flex justify-center items-center py-3 px-8 rounded-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200'
                                style={{
                                    backgroundColor: colors.dark[100], // Primary brand color
                                }}
                                onClick={handleSubmit}
                            >
                                {activeLanguage.submit}
                            </button>

                        </div>
                    </div>               
                </div>
            </div>

            {/* --- Modals/Overlays --- */}
            {verificationAccountBannerVisible && 
                <div className='fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200'>
                    <div 
                        className="w-full max-w-md relative bg-white rounded-sm shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <VerificationAccountBanner 
                            verificationAccountBannerVisible={verificationAccountBannerVisible}
                            setVerificationAccountBannerVisible={setVerificationAccountBannerVisible}
                            clientFound={updatedClient}
                            setClientFound={setUpdatedClient}
                        />
                    </div>
                </div>
            }

            <Footer/>
        </div>
    )
}

export default AccountPage