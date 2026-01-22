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
    signUpForm: SignUpForm, 
    setSignUpForm: (value: SignUpForm) =>void
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
    const {activeLanguage } = useLanguage();
    const { colors } = useTheme();
    const { setLoadingScreen } = useLoadingScreen();
    const { setStatusBanner } = useStatusBanner();
    const { setClient } = useClient();
    const [signUpButtonWorks, setSignUpButtonWorks] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [ welcomeShown, setWelcomeShown ] = useState<boolean>(false);

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

            await axios.post(backEndUrl + "/addClient", {
                clientData: clientData
            })
            .then(({data}) => {
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
                        className='w-full h-full bg-red-500- p-10 rounded-sm flex flex-col justify-center items-center'
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
                        <p style={{color: colors.dark[200]}}>{activeLanguage.somethingWentWrongWhileSignUp}</p>
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
                    className='w-full h-full bg-red-500- p-10 rounded-sm flex flex-col justify-center items-center'
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
                    <p style={{color: colors.dark[200]}}>{activeLanguage.somethingWentWrongWhileSignUp}</p>
                </div>
            )
        }

        if (signUpForm.password != signUpForm.retypePassword) {
            return setStatusBanner(
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
        }
        
        handleSignUp();
    }
        
    return (
        <div 
            className="w-full max-h-full overflow-y-scroll flex flex-col justify-center- items-center text-2xl font-bold bg-red-500- rounded-sm p-5 scrollbar-hidden"
            style={{
                backgroundColor: colors.light[100],
                boxShadow: `0 15px 25px ${colors.dark[500]}`
            }}
        >

            <h2 
                className='my-6 font-2xl'
            >{activeLanguage.signUp}</h2>

            <div className='w-full px-4'>

                <CustomInputText
                    label={activeLanguage.sideMatter.fullName}
                    placeholder= {activeLanguage.inputYourName + ' ...'}
                    className='my-4'
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
                    className='my-4'
                    value={signUpForm.email}
                    type="email"
                    // minLength={12}
                    onChange={(e) => {
                    const value = e.target.value;
                    // const limitReached = e.target.value.length > 8;

                    // Allow only digits and leading '+'
                    if (true) {
                        setSignUpForm({
                        ...signUpForm,
                        email: value,
                        });
                    }
                    }}

                />

                <CustomInputText
                    label={activeLanguage.sideMatter.password}
                    placeholder={activeLanguage.inputYourPassword + ' ...'}
                    className='my-4'
                    value={signUpForm.password}
                    type={"text"}
                    onChange={(e) => setSignUpForm({
                        ...signUpForm,
                        password: e.target.value
                    })}
                />

                <CustomInputText
                    label={activeLanguage.sideMatter.rePassword}
                    placeholder={ activeLanguage.inputYourPasswordAgain + ' ...'}
                    className='my-4'
                    value={signUpForm.retypePassword}
                    type={"text"}
                    onChange={(e) => setSignUpForm({
                        ...signUpForm,
                        retypePassword: e.target.value
                    })}
                />

                <p  
                    className='text-[13px] w-full text-center pt-5 pb-2  opacity-50-'
                    style={{
                        color: colors.dark[700]
                    }}
                >
                    {activeLanguage.AlreadyHaveAnAccount}
                    <span 
                        onClick={() => setActivePage("signIn")}
                        className='ml-2 cursor-pointer text-gray-500- underline'
                        style={{
                            color: colors.dark[100]
                        }}
                    >
                        {activeLanguage.signIn}
                    </span>
                </p>

                <CustomBotton
                    label={activeLanguage.signUp}
                    className='mt-2 w-full h-12 text-[14px]'
                    style={{
                        // backgroundColor: signUpButtonWorks ? "red" : 'blue'
                    }}
                    onclick={handleSignUpClicked}
                />

            </div>

            {/* {welcomeShown && <WelcomeIcon
                title={'welcome MR.' + signUpForm.fullName + '🖐️'}
                subtitle='Thank you for joining SilverWay! 😊'
            />} */}


        </div>
    )
}

export default SignUp
