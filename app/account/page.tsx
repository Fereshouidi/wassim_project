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
    const { colors } = useTheme();
    const { screenWidth } = useScreen();
    const { ownerInfo, setOwnerInfo } = useOwner();
    const [ updatedClient, setUpdatedClient ] = useState<ClientType | undefined>(undefined);
    const { setStatusBanner } = useStatusBanner();
    const [ verificationAccountBannerVisible, setVerificationAccountBannerVisible ] = useState<boolean>(false);
    const { activeLanguage } = useLanguage();

    useEffect(() => {
        if (!client) return;
        setUpdatedClient(client as unknown as ClientType);
    }, [client])

    useEffect(() => {
        setLoadingScreen(false);
    }, [])

    useEffect(() => {
        console.log({updatedClient});
        
    }, [updatedClient])

const handleSubmit = async () => {
    // 1. Validation check before contacting backend
    if (!isValidEmail(updatedClient?.email?? "")) {
        setStatusBanner(
            true,
            null,
            <ErrorBanner show={true} message="Please enter a valid email address" />
        );
        setTimeout(() => setStatusBanner(false), 3500);
        return; // Stop here
    }

    if (!isValidPhone(updatedClient?.phone?? "" )) {
        setStatusBanner(
            true,
            null,
            <ErrorBanner show={true} message="Phone number must be exactly 8 digits" />
        );
        setTimeout(() => setStatusBanner(false), 3500);
        return; // Stop here
    }

    // 2. Only if validation passes, start loading and contact backend
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
                {
                    backgroundColor: colors.light[100]
                }
            );

            setTimeout(() => {
                setStatusBanner(false);
            }, 3500);
        }

    } catch (err: any) {
        setLoadingScreen(false);

        const errorMessage = err.response?.data?.message || err.message || "Failed to update client";

        setStatusBanner(
            true,
            null,
            <ErrorBanner 
                show={true} 
                message={errorMessage} 
            />
        );

        setTimeout(() => {
            setStatusBanner(false);
        }, 3500);

        console.error('Error updating client:', err);
    }
}

    if (!ownerInfo || !updatedClient) return <LoadingScreen/>

    return (
        <div
            className='w-full h-full bg-red-500-'
            style={{
                backgroundColor: colors.light[100],
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

            <div 
                className='w-full bg-red-500- min-h-screen- flex justify-center items-center- py-10'
                style={{
                    // height: screenWidth > 1000 ? `calc(100dvh - ${headerHeight * 1.5}px)` : '',
                    minHeight: screenWidth > 1000 ? "" : `calc(100dvh - ${headerHeight * 1.5}px)`
                }}
            >
                <div
                    className='h-full bg-blue-500- rounded-sm p-5 sm:px-10 flex flex-col items-center justify-between'
                    style={{
                        border: `1px solid ${colors.light[300]}`,
                        width: screenWidth < 1000 ? "90%" : "1000px",
                        boxShadow: `0 0 15px ${colors.light[200]}`
                    }}
                >

                    <h2
                        className='m-5 sm:m-10 text-lg font-bold'
                    >{activeLanguage.yourInfomations}</h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
                        <CustomInputText
                            label={activeLanguage.sideMatter.fullName}
                            type='text'
                            className={`${screenWidth > 700 ? 'px-10-' : ''} w-[300px]`}
                            labelClassName='font-bold'
                            placeholder={activeLanguage.inputYourName + "..."}
                            inputClassName='py-2'
                            defaultValue={updatedClient?.fullName}
                            onChange={(e) => setUpdatedClient({
                                ...updatedClient,
                                fullName: e.target.value
                            })}
                            maxLength={25}
                        />                    
                        
                        <CustomInputText
                            label={activeLanguage.sideMatter.phone}
                            type='tel'
                            className={`${screenWidth > 700 ? 'px-10-' : ''} w-[300px]`}
                            labelClassName='font-bold'
                            placeholder={activeLanguage.inputYourPhone + "..."}
                            inputClassName='py-2'
                            defaultValue={updatedClient?.phone?.toString()}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.length <= 8) {
                                    setUpdatedClient({
                                        ...updatedClient,
                                        phone: Number(val)
                                    });
                                }
                            }}
                            maxLength={8}
                        />            
                        
                        <CustomInputText
                            label={activeLanguage.sideMatter.email}
                            type='text'
                            className={`${screenWidth > 700 ? 'px-10-' : ''} w-[300px]`}
                            labelClassName='font-bold'
                            placeholder={activeLanguage.inputYourEmail + "..."}
                            inputClassName='py-2'
                            defaultValue={updatedClient?.email}
                            onChange={(e) => setUpdatedClient({
                                ...updatedClient,
                                email: e.target.value
                            })}
                            maxLength={50}
                        />                    
                        
                        <CustomInputText
                            label={activeLanguage.sideMatter.address}
                            type='text'
                            className={`${screenWidth > 700 ? 'px-10-' : ''} w-[300px]`}
                            labelClassName='font-bold'
                            placeholder={activeLanguage.sideMatter.address}
                            inputClassName='py-2'
                            defaultValue={updatedClient?.address}
                            onChange={(e) => setUpdatedClient({
                                ...updatedClient,
                                address: e.target.value
                            })}
                            maxLength={100}
                        />                    
                        
                        <CustomInputText
                            label={activeLanguage.sideMatter.password}
                            type='text'
                            className={`${screenWidth > 700 ? 'px-10-' : ''} w-[300px]`}
                            labelClassName='font-bold'
                            placeholder={activeLanguage.inputYourPassword + "..."}
                            inputClassName='py-2'
                            defaultValue={updatedClient?.password}
                            onChange={(e) => setUpdatedClient({
                                ...updatedClient,
                                password: e.target.value
                            })}
                        />
                
                        <CustomInputText
                            label={activeLanguage.dateOfBirth}
                            type="date"
                            className={`${screenWidth > 700 ? 'px-10-' : ''} w-[300px]`}
                            labelClassName='font-bold'
                            placeholder={activeLanguage.inputYourDateOfBirth} 
                            inputClassName='py-2'
                            //@ts-ignore
                            defaultValue={updatedClient?.dateOfBirth ? new Date(updatedClient.dateOfBirth).toISOString().slice(0, 10) : ''}
                            onChange={(e) => setUpdatedClient({
                                ...updatedClient,
                                //@ts-ignore
                                dateOfBirth: new Date(e.target.value)
                            })}
                        />
                    </div>

                    <div className={`bg-red-500- w-full mt-7 flex justify-between sm:justify-end- gap-2`}>

                        <div
                            className='min-w-24 bg-red-500 flex justify-center items-center gap-2 text-white py-2 px-3 rounded-sm text-sm sm:text-md cursor-pointer'
                            style={{
                                boxShadow: `0 5px 15px ${colors.light[300]}`
                            }}
                            onClick={() => {
                                setLoadingScreen(true);
                                localStorage.removeItem('clientToken');
                                setClient(null);
                                route.push('/');
                                setLoadingScreen(false);
                            }}
                        >
                            <img
                                src="/icons/logout-white.png"
                                className='w-3 h-3'
                            />
                            <p>{activeLanguage.logOut}</p>
                            
                        </div>

                        <div
                            className='min-w-24 flex justify-center items-center py-2 px-3 rounded-sm text-sm sm:text-md cursor-pointer'
                            style={{
                                backgroundColor: colors.dark[100],
                                color: colors.light[200],
                                boxShadow: `0 5px 15px ${colors.light[300]}`
                            }}
                            onClick={handleSubmit}
                        >{activeLanguage.submit}</div>

                    </div>

                                 
                </div>
                
            </div>


            {verificationAccountBannerVisible && 
                <div className='w-full h-full bg-transparent- backdrop:blur-2xl fixed top-0 left-0 flex justify-center items-center overflow-y-scroll- z-50'>
                    <div 
                        className={`${screenWidth > 1000 ? "w-[450px]" : "w-[350px]"} h-[450px]- max-h-[80%]  relative`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: colors.light[100],
                            boxShadow: `0 0 15px ${colors.light[300]}`,
                            marginTop: headerHeight * 1.5
                        }}
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
