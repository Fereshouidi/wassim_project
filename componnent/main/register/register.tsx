import { useLanguage } from '@/contexts/languageContext';
import { useRegisterSection } from '@/contexts/registerSec'
import { useTheme } from '@/contexts/themeProvider';
import React, { useEffect, useState } from 'react'
import SignIn from './signin';
import SignUp from './signup';
import { useScreen } from '@/contexts/screenProvider';
import { ClientType, SignInForm, SignUpForm } from '@/types';
import WelcomeIcon from '@/componnent/sub/welcomeIcon';
import VerificationAccountBanner from '@/componnent/sub/banners/verificationAccountBanner';
import { headerHeight } from '@/constent';

type props = {
    // setSideBarExist: (value: boolean) => void
}

const RegisterSection = ({
    // setSideBarExist
}: props) => {

    const { registerSectionExist, setRegisterSectionExist } = useRegisterSection();
    const {activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const [ activePage, setActivePage ] = useState<"signIn" | "signUp">("signIn");
    const { screenWidth } = useScreen();
    const [verificationAccountBannerVisible, setVerificationAccountBannerVisible] = useState<boolean>(false);
    const [clientFound, setClientFound] = useState<ClientType | undefined>(undefined)
    const [signUpForm, setSignUpForm] = useState<SignUpForm>({
        fullName: '',
        email: "",
        password: '',
        retypePassword: ''
    });
    const [signIpForm, setSignIpForm] = useState<SignInForm>({
        fullName: '',
        password: ''
    });

    useEffect(() => {
        console.log({clientFound});
        
    }, [clientFound])

    return (
        <div 
            className="fixed inset-0 z-[888] flex justify-center items-center bg-black/30 backdrop-blur-sm overflow-y-scroll scrollbar-hidden"
            style={{
                color: colors.dark[150]
            }}
            onClick={() => setRegisterSectionExist(false)}
        >


            <div 
                className={`${screenWidth > 1000 ? "w-[450px]" : "w-[350px]"} max-h-[80%] relative`}
                onClick={(e) => e.stopPropagation()}
            >

                <img 
                    src={activeTheme == "dark" ? "/icons/close-white.png" : "/icons/close-black.png"} 
                    className='w-10 h-10 p-3 absolute top-1 right-1 cursor-pointer bg-red-500-'
                    onClick={() => setRegisterSectionExist(false)}
                />

                {
                    activePage == "signIn" ?
                        <SignIn
                            activePage={activePage}
                            setActivePage={setActivePage}
                            signInForm={signIpForm}
                            setSignInForm={setSignIpForm}
                            setRegisterSectionExist={setRegisterSectionExist}
                            clientFound={clientFound}
                            setClientFound={setClientFound}
                            setVerificationAccountBannerVisible={setVerificationAccountBannerVisible}
                        />
                    :   <SignUp
                            activePage={activePage}
                            setActivePage={setActivePage}
                            signUpForm={signUpForm}
                            setSignUpForm={setSignUpForm}
                            setRegisterSectionExist={setRegisterSectionExist}
                            // setSideBarExist={setSideBarExist}
                        />
                }

            {verificationAccountBannerVisible && 
                <div className='w-full h-full bg-transparent- backdrop:blur-2xl fixed top-0 left-0 flex justify-center items-center overflow-y-scroll- z-50'>
                    <div 
                        className={`${screenWidth > 1000 ? "w-[450px]" : "w-[350px]"} h-[450px] max-h-[80%]  relative`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: colors.light[100],
                            boxShadow: `0 0 15px ${colors.dark[100]}`,
                            // marginTop: headerHeight * 1.5
                        }}
                    >
                        <VerificationAccountBanner 
                            verificationAccountBannerVisible={verificationAccountBannerVisible}
                            setVerificationAccountBannerVisible={setVerificationAccountBannerVisible}
                            clientFound={clientFound}
                            setClientFound={setClientFound}
                        />
                    </div>
                </div>
            }

            </div>


        </div>

    )
}

export default RegisterSection;
