import { useClient } from '@/contexts/client';
import { useTheme } from '@/contexts/themeProvider'
import { ClientType } from '@/types';
import React, { useEffect, useState } from 'react'
import CustomInputText from '../customInputText';
import CustomBotton from '../customBotton';
import axios from 'axios';
import { backEndUrl } from '@/api';
import { useStatusBanner } from '@/contexts/StatusBanner';
import SuccessVerification from './SuccessVerification';
import FailVerification from './failVerification';
import FailSendToEmail from './failSendToEmail';
import { useLanguage } from '@/contexts/languageContext';
import { useRegisterSection } from '@/contexts/registerSec';

type props = {
    client?: ClientType,
    verificationAccountBannerVisible: boolean, 
    setVerificationAccountBannerVisible: (value: boolean) => void
    clientFound: ClientType | undefined, 
    setClientFound: (value: ClientType) => void
}

const VerificationAccountBanner = ({
    client,
    verificationAccountBannerVisible, 
    setVerificationAccountBannerVisible,
    clientFound,
    setClientFound
}: props) => {

    const { colors, activeTheme } = useTheme();
    const [emailInput, setEmailInput] = useState<string>("");
    const [clientVerified, setClientVerified] = useState<boolean>(false);
    const [inputToken, setInputToken] = useState<number | null>(null);
    const { setStatusBanner } = useStatusBanner();
    const { setRegisterSectionExist } = useRegisterSection();
    const { setClient } = useClient();
    const { activeLanguage } = useLanguage();

    useEffect(() => {
        if (!client?._id) return;
        handleSendVerificationCode();
    }, [client])

    const handleSendVerificationCode = async () => {
        await axios.post( backEndUrl + "/verificateClient", {
            clientId: client?._id
        })
        .then(({ data }) => {

        })
        .catch(( err ) => {
            setStatusBanner(
                true,
                null,
                <FailSendToEmail/>
            )           
        })
    }

    const getClientByEmail = async () => {

        if (!emailInput) return;

        await axios.get( backEndUrl + "/getClientByEmail", {
            params: {
                email: emailInput
            }
        })
        .then(({ data }) => {
            console.log({client: data.client});
            
            data.client && setClientFound(data.client as unknown as ClientType)
        })
        .catch(( err ) => {
            console.log(err);
            setStatusBanner(
                true,
                null,
                <FailSendToEmail/>
            )        
        })
    }

    useEffect(() => {
        console.log({clientFound});
            // setStatusBanner(
            //     true,
            //     null,
            //     <FailSendToEmail/>
            // )
    }, [clientFound])

    const handleVerification = async () => {

        await axios.post( backEndUrl + "/validateClient", {
            token: inputToken
        })
        .then(({ data }) => {
            // alert("your account has been verified ")
            setStatusBanner(
                true,
                null,
                <SuccessVerification/>
            )
            if (data.client.token) {
                localStorage.setItem("clientToken", data.client.token.toString());
            }
            setClient(data.client);
            setRegisterSectionExist(false);
        })
        .catch(( err ) => {
            setStatusBanner(
                true,
                null,
                <FailVerification/>
            )
        })
    }

    
    if (!clientFound) return (
        <div 
            className='w-full h-full flex flex-col justify-center items-center absolute- top-0 left-0 z-[999] backdrop-blur-2xl over rounded-sm'
            style={{
                // boxShadow: `0 5px 15px ${colors.dark[550]}`
            }}
        >
        
                <img 
                    src={activeTheme == "dark" ? "/icons/close-white.png" : "/icons/close-black.png"} 
                    className='w-10 h-10 p-3 absolute top-1 right-1 cursor-pointer bg-red-500-'
                    onClick={() => setVerificationAccountBannerVisible(false)}
                />
        
            <div 
                className='w-full h-full flex flex-col justify-center items-center rounded-sm p-5'
                style={{
                    // backgroundColor: colors.light[100],
                    // border: `3px solid ${colors.dark[100]}`

                }}
            >

                <h2 className='font-bold text-lg m-8'>{activeLanguage.GetBackMyAccount}</h2>

                <p className='text-center text-sm px-5'>{activeLanguage.GetBackMyAccountParagraph}</p>

                <div className='w-[300px] h- my-5 flex flex-col justify-center items-center'>
                    <CustomInputText
                        label='type your email here'
                        placeholder='email...'
                        className='' 
                        type={'email'}   
                        // value={inputToken?? ""}
                        onChange={(e) => setEmailInput(e.target.value)}             
                    />
                    <CustomBotton 
                        label={'send'}
                        className='my-2'  
                        onclick={getClientByEmail}              
                    />
                    {/* <h6 className='w-fit bg-red-500-'>resend again</h6> */}
                </div>
            
            </div>
        </div>    
    )


  return (
    <div 
        className='w-full h-full flex flex-col justify-center items-center absolute- top-0 left-0 z-[999] backdrop-blur-2xl over rounded-sm'
        style={{
            // boxShadow: `0 5px 15px ${colors.dark[550]}`
        }}
    >

        <img 
            src={activeTheme == "dark" ? "/icons/close-white.png" : "/icons/close-black.png"} 
            className='w-10 h-10 p-3 absolute top-1 right-1 cursor-pointer bg-red-500-'
            onClick={() => setVerificationAccountBannerVisible(false)}
        />
      
        <div 
            className='w-full h-full flex flex-col justify-center items-center rounded-sm p-5'
            style={{
                // backgroundColor: colors.light[200],
                // border: `3px solid ${colors.dark[100]}`

            }}
        >

            <h2 className='font-bold text-lg m-8'>{activeLanguage.GetBackMyAccount}</h2>

            <p className='text-center text-sm'>{activeLanguage.sendingEmailParagraph + " " + clientFound.email}</p>

            <div className='w-[250px] h- my-5 flex flex-col justify-center items-center'>
                <CustomInputText
                    label='type the code here'
                    placeholder='Code...'
                    className='' 
                    type={'number'}     
                    // value={inputToken?? ""}
                    onChange={(e) => setInputToken(Number(e.target.value))}           
                />
                <CustomBotton 
                    label={'submit'}
                    className='my-2'    
                    onclick={handleVerification}            
                />
                <h6 className='w-fit bg-red-500-'>{activeLanguage.resend}</h6>
            </div>
        
        </div>
    </div>
  )
}

export default VerificationAccountBanner
