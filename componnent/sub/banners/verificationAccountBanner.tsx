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
    const [inputToken, setInputToken] = useState<number | null>(null);
    const { setStatusBanner } = useStatusBanner();
    const { setRegisterSectionExist } = useRegisterSection();
    const { setClient } = useClient();
    const { activeLanguage } = useLanguage();

    // When component mounts with a known client (e.g. from account page after email change),
    // automatically send the verification code to that client's email.
    useEffect(() => {
        if (!client?._id) return;
        handleSendVerificationCode(client._id);
    }, [client])

    // When clientFound is set (after email lookup in "forgot password" flow),
    // automatically send the verification code to that client's email.
    useEffect(() => {
        if (!clientFound?._id) return;
        // Only auto-send if no explicit 'client' prop was passed (forgot-password flow)
        if (client?._id) return;
        handleSendVerificationCode(clientFound._id as string);
    }, [clientFound])

    const handleSendVerificationCode = async (clientId: string) => {
        try {
            await axios.post(backEndUrl + "/verificateClient", {
                clientId,
                lang: activeLanguage.language
            });
        } catch (err) {
            setStatusBanner(
                true,
                null,
                <FailSendToEmail />
            );
        }
    }

    const getClientByEmail = async () => {
        if (!emailInput) return;

        try {
            const { data } = await axios.get(backEndUrl + "/getClientByEmail", {
                params: { email: emailInput }
            });
            if (data.client) {
                setClientFound(data.client as ClientType);
            }
        } catch (err) {
            setStatusBanner(
                true,
                null,
                <FailSendToEmail />
            );
        }
    }

    const handleVerification = async () => {
        if (!inputToken) return;

        try {
            const { data } = await axios.post(backEndUrl + "/validateClient", {
                token: inputToken
            });

            setStatusBanner(
                true,
                null,
                <SuccessVerification />
            );

            if (data.client?.token) {
                localStorage.setItem("clientToken", data.client.token.toString());
            }
            setClient(data.client);
            setVerificationAccountBannerVisible(false);
            setRegisterSectionExist(false);

        } catch (err) {
            setStatusBanner(
                true,
                null,
                <FailVerification />
            );
        }
    }

    // Step 1: No clientFound yet — show email lookup form (forgot password flow)
    if (!clientFound) return (
        <div
            className='w-full h-full flex flex-col justify-center items-center rounded-xl'
        >
            <img
                src={activeTheme == "dark" ? "/icons/close-white.png" : "/icons/close-black.png"}
                className='w-10 h-10 p-3 absolute top-1 right-1 cursor-pointer'
                onClick={() => setVerificationAccountBannerVisible(false)}
            />

            <div
                className='w-full h-full flex flex-col justify-center items-center rounded-xl p-5'
            >
                <h2 className='font-bold text-lg m-8'>{activeLanguage.GetBackMyAccount}</h2>

                <p className='text-center text-sm px-5'>{activeLanguage.GetBackMyAccountParagraph}</p>

                <div className='w-[300px] my-5 flex flex-col justify-center items-center'>
                    <CustomInputText
                        label='type your email here'
                        placeholder='email...'
                        className=''
                        type={'email'}
                        onChange={(e) => setEmailInput(e.target.value)}
                    />
                    <CustomBotton
                        label={'send'}
                        className='my-2 px-3 py-2'
                        onclick={getClientByEmail}
                    />
                </div>
            </div>
        </div>
    )

    // Step 2: clientFound is set — show token input form
    return (
        <div
            className='w-full h-full flex flex-col justify-center items-center rounded-xl'
        >
            <img
                src={activeTheme == "dark" ? "/icons/close-white.png" : "/icons/close-black.png"}
                className='w-10 h-10 p-3 absolute top-1 right-1 cursor-pointer'
                onClick={() => setVerificationAccountBannerVisible(false)}
            />

            <div
                className='w-full h-full flex flex-col justify-center items-center rounded-xl p-5'
            >
                <h2 className='font-bold text-lg m-8'>{activeLanguage.GetBackMyAccount}</h2>

                <p className='text-center text-sm'>{activeLanguage.sendingEmailParagraph + " " + clientFound.email}</p>

                <div className='w-[250px] my-5 flex flex-col justify-center items-center'>
                    <CustomInputText
                        label='type the code here'
                        placeholder='Code...'
                        className=''
                        type={'number'}
                        onChange={(e) => setInputToken(Number(e.target.value))}
                    />
                    <CustomBotton
                        label={'submit'}
                        className='my-2 px-3 py-2'
                        onclick={handleVerification}
                    />
                    <h6
                        className='w-fit cursor-pointer underline text-sm opacity-70'
                        onClick={() => clientFound._id && handleSendVerificationCode(clientFound._id as string)}
                    >
                        {activeLanguage.resend}
                    </h6>
                </div>

            </div>
        </div>
    )
}

export default VerificationAccountBanner
