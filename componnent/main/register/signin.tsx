import { backEndUrl } from '@/api';
import AccountNotFoundBanner from '@/componnent/sub/banners/accountNotFound';
import RequiredFieldsBanner from '@/componnent/sub/banners/allFiledRequired';
import WrongPasswordBanner from '@/componnent/sub/banners/wrongPasswordBanner';
import CustomBotton from '@/componnent/sub/customBotton';
import CustomInputText from '@/componnent/sub/customInputText';
import WelcomeIcon from '@/componnent/sub/welcomeIcon';
import { useClient } from '@/contexts/client';
import { useLanguage } from '@/contexts/languageContext';
import { useLoadingScreen } from '@/contexts/loadingScreen';
import { useRegisterSection } from '@/contexts/registerSec';
import { useStatusBanner } from '@/contexts/StatusBanner';
import { useTheme } from '@/contexts/themeProvider';
import { getDeviceId } from '@/lib';
import { ClientType, SignInForm, SignUpForm } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { LockKeyhole } from 'lucide-react';


type props = {
    activePage: "signIn" | "signUp"
    setActivePage: (value: "signIn" | "signUp") => void
    signInForm: SignInForm,
    setSignInForm: (value: SignInForm) => void
    setRegisterSectionExist: (value: boolean) => void
    clientFound?: ClientType,
    setClientFound?: (value: ClientType) => void
    setVerificationAccountBannerVisible: (value: boolean) => void
}

const SignIn = ({
    activePage,
    setActivePage,
    signInForm,
    setSignInForm,
    setRegisterSectionExist,
    clientFound,
    setClientFound,
    setVerificationAccountBannerVisible
}: props) => {

    const { registerSectionExist } = useRegisterSection();
    const { activeLanguage } = useLanguage();
    const { colors } = useTheme();
    const { client, setClient } = useClient();
    const { setStatusBanner } = useStatusBanner();
    const { setLoadingScreen } = useLoadingScreen();
    // const [ signInButtonWorks, setSignInButtonWorks ] = useState<boolean>(false);

    const getClient = async () => {
        const deviceId = await getDeviceId();
        await axios.get(backEndUrl + "/validateClientLogin", {
            params: {
                fullName: signInForm.fullName,
                password: signInForm.password,
                deviceId
            }
        })
            .then(({ data }) => {

                setStatusBanner(true, null,
                    <div>
                        <WelcomeIcon
                            title={activeLanguage.welcomeBackMr + (signInForm.fullName.includes(' ') ? signInForm.fullName.slice(0, signInForm.fullName.indexOf(' ')) : signInForm.fullName) + '🖐️'}
                            subtitle={activeLanguage.thanksForComingBack}
                        />
                    </div>
                )

                if (data.client.token) {
                    localStorage.setItem("clientToken", data.client.token.toString());
                }
                setClient(data.client);
                setClientFound && setClientFound(data.client as ClientType);
                setRegisterSectionExist(false);
            })
            .catch((err) => {

                if (err.status == 401) {

                    setClientFound && setClientFound(err.response.data.client);
                    setStatusBanner(
                        true,
                        null,
                        <WrongPasswordBanner
                            isVisible={true}
                            message={activeLanguage.wrongPassword}
                            onClose={() => setStatusBanner(false)}
                        />
                    )
                    return;


                }

                setStatusBanner(
                    true,
                    null,
                    <AccountNotFoundBanner
                        isVisible={true}
                        message={activeLanguage.AccountWithTheseNameAndPasswordNotFound}
                        onClose={() => setStatusBanner(false)}
                    />
                )
            })
    }

    const handleSignInButtonClicked = async () => {

        if (!signInForm.fullName || !signInForm.password) return setStatusBanner(
            true,
            null,
            <RequiredFieldsBanner
                isVisible={true}
                message={activeLanguage.allFildAreRequired}
                onClose={() => setStatusBanner(false)}
            />
        )

        setLoadingScreen(true);
        await getClient();
        setLoadingScreen(false);
    }


    const handleForgetPasswordClicked = async () => {
        setVerificationAccountBannerVisible(true);
    }

    return (
        <div
            className="w-full h-full overflow-y-auto flex flex-col items-center bg-white rounded-3xl p-8 shadow-2xl scrollbar-hidden transition-all duration-300"
            style={{
                backgroundColor: colors.light[100],
            }}
        >
            {/* --- Brand / Icon Section --- */}
            <div className="mb-6 flex flex-col items-center">
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-inner"
                    style={{ backgroundColor: colors.light[200] }}
                >
                    <LockKeyhole
                        className="w-8 h-8 opacity-80"
                        style={{ color: colors.dark[100] }}
                    />

                </div>
                <h2 className='text-2xl font-black tracking-tight self-center'>
                    {activeLanguage.signIn}
                </h2>
                <p className='text-xs font-medium opacity-50 mt-1 text-center'>
                    Sign in to your account to continue
                </p>
            </div>

            <div className='w-full'>

                <CustomInputText
                    label={activeLanguage.sideMatter.fullName}
                    placeholder={activeLanguage.inputYourName + ' ...'}
                    className='mb-4'
                    type='text'
                    value={signInForm.fullName}
                    onChange={(e) => {
                        setSignInForm({
                            ...signInForm,
                            fullName: e.target.value
                        })
                    }}
                />

                <CustomInputText
                    label={activeLanguage.sideMatter.password}
                    placeholder={activeLanguage.inputYourPassword}
                    className='mb-2'
                    type='password'
                    value={signInForm.password}
                    onChange={(e) => {
                        setSignInForm({
                            ...signInForm,
                            password: e.target.value
                        })
                    }}
                />

                <div className="w-full flex justify-end px-1 mb-8">
                    <p
                        className='text-[12px] font-bold cursor-pointer hover:underline'
                        style={{
                            color: colors.dark[400]
                        }}
                        onClick={handleForgetPasswordClicked}
                    >
                        {activeLanguage.forgotPassword}
                    </p>
                </div>

                <CustomBotton
                    label={activeLanguage.signIn}
                    className='w-full h-12 shadow-xl'
                    onclick={handleSignInButtonClicked}
                />

                <div className='mt-8 pt-6 border-t w-full border-gray-100 flex flex-col items-center'>
                    <p
                        className='text-[13px] font-medium opacity-60 mb-2'
                        style={{ color: colors.dark[200] }}
                    >
                        {activeLanguage.DontHaveAnAccount}
                    </p>
                    <button
                        onClick={() => setActivePage("signUp")}
                        className='text-sm font-black underline hover:scale-105 transition-transform'
                        style={{
                            color: colors.dark[100]
                        }}
                    >
                        {activeLanguage.signUp}
                    </button>
                </div>

            </div>

        </div>
    )
}

export default SignIn
