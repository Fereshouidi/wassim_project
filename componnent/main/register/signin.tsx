import { backEndUrl } from '@/api';
import CustomBotton from '@/componnent/sub/customBotton';
import CustomInputText from '@/componnent/sub/customInputText';
import WelcomeIcon from '@/componnent/sub/welcomeIcon';
import { useClient } from '@/contexts/client';
import { useLanguage } from '@/contexts/languageContext';
import { useLoadingScreen } from '@/contexts/loadingScreen';
import { useRegisterSection } from '@/contexts/registerSec';
import { useStatusBanner } from '@/contexts/StatusBanner';
import { useTheme } from '@/contexts/themeProvider';
import { SignInForm, SignUpForm } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

type props = {
    activePage: "signIn" | "signUp"
    setActivePage: (value: "signIn" | "signUp") => void
    signInForm: SignInForm, 
    setSignInForm: (value: SignInForm) =>void
    setRegisterSectionExist: (value: boolean) =>void
}

const SignIn = ({
    activePage,
    setActivePage,
    signInForm, 
    setSignInForm,
    setRegisterSectionExist
}: props) => {

    const { registerSectionExist } = useRegisterSection();
    const {activeLanguage } = useLanguage();
    const { colors } = useTheme();
    const { client, setClient } = useClient();
    const { setStatusBanner } = useStatusBanner();
    const { setLoadingScreen } = useLoadingScreen();
    // const [ signInButtonWorks, setSignInButtonWorks ] = useState<boolean>(false);

    const getClient = async () => {
        await axios.get( backEndUrl + "/validateClientLogin", {
            params: {
                fullName: signInForm.fullName,
                password: signInForm.password
            }
        })
        .then(({data}) => {
            setRegisterSectionExist(false);
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
        })
        .catch((err) => {
            setStatusBanner(
                true,
                null,
                <div 
                    className='w-full h-full bg-red-500- p-10 rounded-sm flex flex-col justify-center items-center'
                    style={{
                        backgroundColor: colors.light[100]
                    }}
                >
                    <video  
                        src="/icons/fail.webm"
                        className='w-[200px] h-[200px]'
                        autoPlay
                    ></video>
                    <p>{activeLanguage.AccountWithTheseNameAndPasswordNotFound}</p>
                </div>
            )
        })
    }

    const handleSignInButtonClicked = async () => {

        if (!signInForm.fullName || !signInForm.password) return setStatusBanner(
            true,
            null,
            <div 
                className='w-full h-full bg-red-500- p-10 rounded-sm flex flex-col justify-center items-center'
                style={{
                    backgroundColor: colors.light[100]
                }}
            >
                <video  
                    src="/icons/fail.webm"
                    className='w-[200px] h-[200px]'
                    autoPlay
                ></video>
                <p>{activeLanguage.allFildAreRequired}</p>
            </div>
        )

        setLoadingScreen(true);
        await getClient();
        setLoadingScreen(false);
    }

    useEffect(() => {
        console.log({ client });

    }, [client]);
        
    return (
        <div 
            className="w-full h-full overflow-y-scroll flex flex-col justify-center- items-center text-2xl font-bold bg-red-500- rounded-sm p-5 scrollbar-hidden"
            style={{
                backgroundColor: colors.light[100],
                boxShadow: `0 10px 25px ${colors.dark[500]}`
            }}
        >

            <h2 
                className='my-6 font-2xl'
            >{activeLanguage.signIn}</h2>

            <div className='w-full px-4'>

                <CustomInputText
                    label={activeLanguage.sideMatter.fullName}
                    placeholder={activeLanguage.inputYourName + ' ...'}
                    className='my-5'
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
                    className='my-5'
                    type='text'
                    value={signInForm.password}
                    onChange={(e) => {
                        setSignInForm({
                            ...signInForm,
                            password: e.target.value
                        })
                    }}
                />

                <p  
                    className='text-[14px] w-full text-center pt-5 pb-2  opacity-50-'
                    style={{
                        color: colors.dark[700]
                    }}
                >                    
                    {activeLanguage.DontHaveAnAccount} 
                    <span 
                        onClick={() => setActivePage("signUp")}
                        className='ml-2 cursor-pointer text-gray-500- underline'
                        style={{
                            color: colors.dark[100]
                        }}
                    >
                        {activeLanguage.signIn}
                    </span>
                </p>

                <CustomBotton
                    label={activeLanguage.signIn}
                    className='mt-2 h-12'
                    onclick={handleSignInButtonClicked}
                />

            </div>


        </div>
    )
}

export default SignIn
