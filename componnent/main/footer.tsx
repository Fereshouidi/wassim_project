"use client";
import { colorsInsLightMode } from '@/constent';
import { useLanguage } from '@/contexts/languageContext';
import { useOwner } from '@/contexts/ownerInfo';
import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { OwnerInfoType } from '@/types';
import React from 'react';

type PropsInfo = {
    // ownerInfo: OwnerInfoType | undefined
}
const Footer = ({
    // ownerInfo
}: PropsInfo) => {

    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();
    const { screenWidth } = useScreen();
    const { ownerInfo } = useOwner();

    return (
        <div 
            id='footer'
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

                <div className='w-fit- flex flex-1 bg-green-400- flex-col justify-center items-center bg-red-500- gap-3 bg-blue-500- hover:text-white- text-white'>

                    <h2 className='font-bold'>{ activeLanguage.contact + ' : '}</h2>

                    <div 
                        className='flex flex-col justify-center items-center gap-2 w-fit text-center'
                        style={{
                            color: colorsInsLightMode.light[350]
                        }}
                    >
                    
                    <a
                        href={`mailto:${ownerInfo?.contact?.email}`}
                        className={`flex flex-row justify-center items-center gap-2 hover:text-white`}
                    >
                        {/* <img
                            src={'/icons/phone.png'}
                            className="w-6 h-6"
                        /> */}
                        <p>{ownerInfo?.contact.email}</p>
                    </a>

                    <a
                        href={`tel:+216${ownerInfo?.contact.phone}`}
                        className="flex flex-row justify-center items-center gap-2- hover:text-white"
                    >
                        {/* <img
                            src={'/icons/email.png'}
                            className="w-6 h-6 p-3"
                        /> */}
                        <p>{"+216" + ownerInfo?.contact.phone}</p>
                    </a>

                        <p className='text-sm cursor-pointer hover:text-white'>{activeLanguage.askAi}</p>
                    </div>
                </div>

                <div className='h-full bg-red-500- flex flex-1 flex-col justify-start items-center '>
                    <p>{activeLanguage.haveGoodShop}</p>
                    <img 
                        src="/logo-simple-black.jpg" 
                        className='w-14 h-14 mt-8'
                        alt="" 
                    />
                </div>
                
                <div className='w-fit- h-full flex flex-1 bg-green-400- flex-col justify-center items-center bg-red-500- gap-3 bg-green-500- text-white'>

                    <h2 className='font-bold'>{'Social Media : '}</h2>

                    <div 
                        className={`flex ${screenWidth > 1000 ? "flex-col" : "flex-row justify-center items-center"} text-center-  gap-2 `}
                        style={{
                            color: colorsInsLightMode.light[350]
                        }}
                    >
                        {ownerInfo?.socialMedia?.map((social, index) => (
                            <a 
                                key={index}
                                href={social.link}
                                className={`bg-red-500- flex ${screenWidth > 1000 ? " justify-start gap-2 sm:px-10" : " justify-center"} items-center`}
                                // style={{
                                //     width: '200px'
                                // }}
                            >
                                <img 
                                    src={social.icon} 
                                    alt="" 
                                    className={screenWidth > 1000 ? 'w-5 h-5' : 'w-7 h-7'}
                                />
                                {screenWidth > 1000 && <p className='text-sm font-[1px] '>{social.platform}</p>}
                            </a>
                        ))}
                    </div>
                </div>

            </div>

            {/* ----------- NEW BOTTOM SECTION ----------- */}
            <div className='w-full flex flex-col sm:flex-row justify-between items-center pt-6 opacity-30 text-[10px] uppercase tracking-widest'>
                <p>© 2026 SilverWayShop. All Rights Reserved.</p>
                <div className='flex gap-6 mt-4 sm:mt-0'>
                    <span className='cursor-pointer hover:underline'>Privacy Policy</span>
                    <span className='cursor-pointer hover:underline'>Terms of Service</span>
                </div>
            </div>
             {/* ------------------------------------------ */}

        </div>
    )
}

export default Footer