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
import { getDeviceId } from '@/lib';
import { SignInForm, SignUpForm } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { UserPlus } from 'lucide-react';


type props = {
    activePage: "signIn" | "signUp"
    setActivePage: (value: "signIn" | "signUp") => void
    signUpForm: SignUpForm,
    setSignUpForm: (value: SignUpForm) => void
    setRegisterSectionExist: (value: boolean) => void
    // setSideBarExist: (value: boolean) => void
}

const SignUp = ({
    activePage,
    setActivePage,
    signUpForm,
    setSignUpForm,
    setRegisterSectionExist,
    // setSideBarExist
}: props) => {

    const { registerSectionExist } = useRegisterSection();
    const { activeLanguage } = useLanguage();
    const { colors } = useTheme();
    const { setLoadingScreen } = useLoadingScreen();
    const { setStatusBanner } = useStatusBanner();
    const { setClient } = useClient();
    const [signUpButtonWorks, setSignUpButtonWorks] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [welcomeShown, setWelcomeShown] = useState<boolean>(false);

    useEffect(() => {
        console.log({ signUpForm });

        const { fullName, password, retypePassword, email } = signUpForm;

        const isPhoneValid = true

        const canSignUp = fullName && password && retypePassword && email && isPhoneValid;

        setSignUpButtonWorks(Boolean(canSignUp));
    }, [signUpForm]);


    const handleSignUp = async () => {

        if (!signUpButtonWorks) return;

        const clientData = {
            ...signUpForm,
            email: signUpForm.email
        }

        setLoadingScreen(true);

        const deviceId = await getDeviceId();

        await axios.post(backEndUrl + "/addClient", {
            clientData: clientData,
            deviceId
        })
            .then(({ data }) => {
                setRegisterSectionExist(false);
                setStatusBanner(true, null,
                    <div>
                        <WelcomeIcon
                            title={activeLanguage.welcomeMr + (signUpForm.fullName.includes(' ') ? signUpForm.fullName.slice(0, signUpForm.fullName.indexOf(' ')) : signUpForm.fullName) + '🖐️'}
                            subtitle={activeLanguage.thanksForJoining}
                        />
                    </div>
                )

                if (data.newClient.token) {
                    localStorage.setItem("clientToken", data.newClient.token.toString());
                }
                setClient(data.newClient);
            })
            .catch(err => {
                setStatusBanner(
                    true,
                    null,
                    <div
                        className='w-full h-full bg-red-500- p-10 rounded-xl flex flex-col justify-center items-center'
                        style={{
                            backgroundColor: colors.light[100],
                            boxShadow: `0 0 15px ${colors.dark[700]}`
                            // border: `2px solid ${colors.dark[500]}`
                        }}
                    >
                        <video
                            src="/icons/fail.webm"
                            className='w-[200px] h-[200px]'
                            autoPlay
                        ></video>
                        <p style={{ color: colors.dark[200] }}>{activeLanguage.somethingWentWrongWhileSignUp}</p>
                    </div>
                )
            })

        setLoadingScreen(false);
    }

    const handleSignUpClicked = () => {

        if (!signUpButtonWorks) {
            return setStatusBanner(
                true,
                null,
                <div
                    className='w-full h-full bg-red-500- p-10 rounded-xl flex flex-col justify-center items-center'
                    style={{
                        backgroundColor: colors.light[100],
                        boxShadow: `0 0 15px ${colors.dark[700]}`
                        // border: `2px solid ${colors.dark[500]}`
                    }}
                >
                    <video
                        src="/icons/fail.webm"
                        className='w-[200px] h-[200px]'
                        autoPlay
                    ></video>
                    <p style={{ color: colors.dark[200] }}>{activeLanguage.somethingWentWrongWhileSignUp}</p>
                </div>
            )
        }

        if (signUpForm.password != signUpForm.retypePassword) {
            return setStatusBanner(
                true,
                null,
                <div
                    className='w-full h-full bg-red-500- p-10 rounded-xl flex flex-col justify-center items-center'
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
        }

        handleSignUp();
    }

    return (
        <div
            className="w-full h-full overflow-y-auto flex flex-col items-center bg-white rounded-3xl p-8 shadow-2xl scrollbar-hidden transition-all duration-300"
            style={{
                backgroundColor: colors.light[100],
            }}
        >
            {/* --- Header Section --- */}
            <div className="mb-6 flex flex-col items-center">
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-inner"
                    style={{ backgroundColor: colors.light[200] }}
                >
                    <UserPlus
                        className="w-8 h-8 opacity-80"
                        style={{ color: colors.dark[100] }}
                    />

                </div>
                <h2 className='text-2xl font-black tracking-tight self-center'>
                    {activeLanguage.signUp}
                </h2>
                <p className='text-xs font-medium opacity-50 mt-1 text-center'>
                    Create your account to start shopping
                </p>
            </div>

            <div className='w-full'>

                <CustomInputText
                    label={activeLanguage.sideMatter.fullName}
                    placeholder={activeLanguage.inputYourName + ' ...'}
                    className='mb-4'
                    value={signUpForm.fullName}
                    type='text'
                    onChange={(e) => setSignUpForm({
                        ...signUpForm,
                        fullName: e.target.value
                    })}
                />

                <CustomInputText
                    label={activeLanguage.sideMatter.email}
                    placeholder={activeLanguage.inputYourEmail + ' ...'}
                    className='mb-4'
                    value={signUpForm.email}
                    type="email"
                    onChange={(e) => {
                        setSignUpForm({
                            ...signUpForm,
                            email: e.target.value,
                        });
                    }}
                />

                <CustomInputText
                    label={activeLanguage.sideMatter.password}
                    placeholder={activeLanguage.inputYourPassword + ' ...'}
                    className='mb-4'
                    value={signUpForm.password}
                    type="password"
                    onChange={(e) => setSignUpForm({
                        ...signUpForm,
                        password: e.target.value
                    })}
                />

                <CustomInputText
                    label={activeLanguage.sideMatter.rePassword}
                    placeholder={activeLanguage.inputYourPasswordAgain + ' ...'}
                    className='mb-6'
                    value={signUpForm.retypePassword}
                    type="password"
                    onChange={(e) => setSignUpForm({
                        ...signUpForm,
                        retypePassword: e.target.value
                    })}
                />

                <CustomBotton
                    label={activeLanguage.signUp}
                    className='w-full h-12 shadow-xl'
                    onclick={handleSignUpClicked}
                />

                <div className='mt-8 pt-6 border-t w-full border-gray-100 flex flex-col items-center'>
                    <p
                        className='text-[13px] font-medium opacity-60 mb-2'
                        style={{ color: colors.dark[200] }}
                    >
                        {activeLanguage.AlreadyHaveAnAccount}
                    </p>
                    <button
                        onClick={() => setActivePage("signIn")}
                        className='text-sm font-black underline hover:scale-105 transition-transform'
                        style={{
                            color: colors.dark[100]
                        }}
                    >
                        {activeLanguage.signIn}
                    </button>
                </div>

            </div>

        </div>
    )
}

export default SignUp
