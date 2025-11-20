"use client";
import { colorsInsLightMode } from '@/constent';
import { useLanguage } from '@/contexts/languageContext';
import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { OwnerInfoType } from '@/types';
import React from 'react';

type PropsInfo = {
    ownerInfo: OwnerInfoType | undefined
}
const Footer = ({
    ownerInfo
}: PropsInfo) => {

    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();
    const { screenWidth } = useScreen();

    return (
        <div 
            className='w-full min-h-[250px] p-14 sm:p-14 overflow-hidden-'
            style={{
                backgroundColor: "black",
                color: colorsInsLightMode.light[200]
            }}
        >
            <div 
                className={`w-full h-full bg-yellow-400- border-t border-b ${screenWidth > 1000 ? "flex-row gap-10 justify-around" : "flex-col gap-5"} flex justify-center- items-center py-10`}
                style={{
                    borderTop: `0.2px solid #bbbbbb54`,
                    borderBottom: `0.2px solid #bbbbbb54`,
                }}
            >

                <div className='w-fit- flex flex-1 bg-green-400- flex-col justify-center items-center bg-red-500- gap-3 bg-blue-500- text-white'>

                    <h2 className='font-bold'>{ activeLanguage.contact + ' : '}</h2>

                    <div 
                        className='flex flex-col justify-center items-center gap-2 w-fit text-center'
                        style={{
                            color: colorsInsLightMode.light[350]
                        }}
                    >
                    
                    <a
                        href="mailto:silverwayshop@gmail.com"
                        className="flex flex-row justify-center items-center gap-2"
                    >
                        {/* <img
                            src={'/icons/phone.png'}
                            className="w-6 h-6"
                        /> */}
                        <p>silverwayshop@gmail.com</p>
                    </a>

                    <a
                        href="tel:+21690353752"
                        className="flex flex-row justify-center items-center gap-2-"
                    >
                        {/* <img
                            src={'/icons/email.png'}
                            className="w-6 h-6 p-3"
                        /> */}
                        <p>+21690353752</p>
                    </a>

                        <p className='text-sm '>{activeLanguage.askAi}</p>
                    </div>
                </div>

                <div className='w-fit- flex flex-1 bg-green-400- flex-col justify-center items-center bg-red-500- gap-3 bg-red-500- text-white'>
                    
                    <h2 className='font-bold'>{activeLanguage.aboutUs + ' : '}</h2>

                    <div 
                        className='flex flex-col gap-2 w-fit  text-center'
                        style={{
                            color: colorsInsLightMode.light[350]
                        }}
                    >
                        <a 
                            href="" 
                            className='text-sm font-[1px] w-fit'
                        >example 1 </a>
                        <a 
                            href="" 
                            className='text-sm '
                        >example 2</a>
                        <a 
                            href="" 
                            className='text-sm '
                        >example 3</a>                    
                    </div>

                </div>
                
                <div className='w-fit- flex flex-1 bg-green-400- flex-col justify-center items-center bg-red-500- gap-3 bg-green-500- text-white'>

                    <h2 className='font-bold'>{'Social Media : '}</h2>

                    <div 
                        className='flex flex-col gap-2 text-center-'
                        style={{
                            color: colorsInsLightMode.light[350]
                        }}
                    >
                        {ownerInfo?.socialMedia?.map((social, index) => (
                            <a 
                                key={index}
                                href={social.link}
                                className={`bg-red-500- flex ${screenWidth > 1000 ? " justify-start" : " justify-center"} items-center gap-2 sm:px-10`}
                                // style={{
                                //     width: '200px'
                                // }}
                            >
                                <img 
                                    src={social.icon} 
                                    alt="" 
                                    className='w-5 h-5'
                                />
                                <p className='text-sm font-[1px] '>{social.platform}</p>
                            </a>
                        ))}
                        {/* <a 
                            href="" 
                            className='text-sm font-[1px] '
                        >Instagram</a>
                        <a 
                            href="" 
                            className='text-sm '
                        >Facebook</a>
                         <a 
                            href="" 
                            className='text-sm '
                        >WhatsApp</a>
                         <a 
                            href="" 
                            className='text-sm '
                        >TikTok</a> */}
                        
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Footer
