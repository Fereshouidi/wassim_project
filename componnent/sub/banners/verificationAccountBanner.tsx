import { useClient } from '@/contexts/client';
import { useTheme } from '@/contexts/themeProvider'
import { ClientType } from '@/types';
import React, { useEffect, useState } from 'react'
import { Search, Mail, X } from 'lucide-react';

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
        <div className='w-full h-full flex flex-col justify-center items-center rounded-3xl p-8 transition-all duration-300' style={{ backgroundColor: colors.light[100] }}>
            <X
                className='w-5 h-5 absolute top-4 right-4 cursor-pointer hover:rotate-90 transition-transform duration-300 opacity-40 hover:opacity-100'
                onClick={() => setVerificationAccountBannerVisible(false)}
            />


            <div className='w-full flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500'>
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100/50">
                    <Search className="w-8 h-8 opacity-80" style={{ color: colors.dark[100] }} />
                </div>


                <h2 className='font-black text-2xl tracking-tight mb-3 text-center'>{activeLanguage.GetBackMyAccount}</h2>
                <p className='text-center text-sm font-medium opacity-60 px-4 leading-relaxed mb-8'>
                    {activeLanguage.GetBackMyAccountParagraph}
                </p>

                <div className='w-full max-w-[320px] flex flex-col gap-5'>
                    <CustomInputText
                        label='Email Address'
                        placeholder='name@example.com'
                        type='email'
                        onChange={(e) => setEmailInput(e.target.value)}
                    />
                    <CustomBotton
                        label='Find Account'
                        className='w-full h-12 shadow-lg'
                        onclick={getClientByEmail}
                    />
                </div>
            </div>
        </div>
    )

    // Step 2: clientFound is set — show token input form
    return (
        <div className='w-full h-full flex flex-col justify-center items-center rounded-3xl p-8 transition-all duration-300' style={{ backgroundColor: colors.light[100] }}>
            <X
                className='w-5 h-5 absolute top-4 right-4 cursor-pointer hover:rotate-90 transition-transform duration-300 opacity-40 hover:opacity-100'
                onClick={() => setVerificationAccountBannerVisible(false)}
            />


            <div className='w-full flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500'>
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-green-100/50">
                    <Mail className="w-8 h-8 opacity-80" style={{ color: colors.dark[100] }} />
                </div>


                <h2 className='font-black text-2xl tracking-tight mb-3 text-center'>Verify Identity</h2>
                <p className='text-center text-sm font-medium opacity-60 px-4 leading-relaxed mb-2'>
                    We've sent a 4-digit code to:
                </p>
                <p className='text-center text-sm font-bold mb-8 px-4 opacity-100 italic' style={{ color: colors.dark[100] }}>
                    {clientFound.email}
                </p>

                <div className='w-full max-w-[280px] flex flex-col items-center gap-6'>
                    <CustomInputText
                        label='Enter 4-Digit Code'
                        placeholder='0000'
                        type='number'
                        inputStyle={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
                        onChange={(e) => setInputToken(Number(e.target.value))}
                    />

                    <CustomBotton
                        label={activeLanguage.submit}
                        className='w-full h-12 shadow-lg shadow-indigo-500/10'
                        onclick={handleVerification}
                    />

                    <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => clientFound._id && handleSendVerificationCode(clientFound._id as string)}>
                        <p className='text-xs font-medium opacity-50'>Didn't receive a code?</p>
                        <h6 className='font-black text-xs underline decoration-2 underline-offset-4' style={{ color: colors.dark[100] }}>
                            {activeLanguage.resend}
                        </h6>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default VerificationAccountBanner
