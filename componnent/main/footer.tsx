"use client";
import { colorsInsLightMode } from '@/constent';
import { useLanguage } from '@/contexts/languageContext';
import { useOwner } from '@/contexts/ownerInfo';
import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import { useAiChatBubble } from '@/contexts/AiChatBubble';
import { useClient } from '@/contexts/client';
import { useRegisterSection } from '@/contexts/registerSec';
import { OwnerInfoType } from '@/types';
import React from 'react';
import { Sparkles } from 'lucide-react';


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
    const { setBubbleProps, bubbleProps } = useAiChatBubble();
    const { client } = useClient();
    const { setRegisterSectionExist } = useRegisterSection();

    const handleAskAiClicked = () => {
        if (!client) {
            setRegisterSectionExist(true);
            return;
        }
        setBubbleProps(prev => ({ ...prev, exist: true }));
    };

    return (
        <div
            id='footer'
            className={`w-full min-h-[250px] overflow-hidden- ${screenWidth > 1000 ? 'p-14' : 'px-6 py-10'}`}
            style={{
                backgroundColor: "black",
                color: colorsInsLightMode.light[200]
            }}
        >
            <div
                className={`w-full h-full border-t border-b ${screenWidth > 1000 ? "flex-row gap-10 justify-around" : "flex-col gap-8"} flex items-center py-10`}
                style={{
                    borderTop: `0.2px solid #bbbbbb54`,
                    borderBottom: `0.2px solid #bbbbbb54`,
                }}
            >

                <div className={`w-full flex flex-1 flex-col justify-center items-center gap-3 text-white ${screenWidth <= 1000 ? 'text-center' : ''}`}>

                    <h2 className='font-bold'>{activeLanguage.contact + ' : '}</h2>

                    <div
                        className='flex flex-col justify-center items-center gap-2 w-fit text-center'
                        style={{
                            color: colorsInsLightMode.light[350]
                        }}
                    >

                        <a
                            href={`mailto:${ownerInfo?.contact?.email}`}
                            className={`flex flex-row justify-center items-center gap-2 hover:text-white transition-colors text-sm`}
                        >
                            <p>{ownerInfo?.contact.email}</p>
                        </a>

                        <a
                            href={`tel:+216${ownerInfo?.contact.phone}`}
                            className="flex flex-row justify-center items-center hover:text-white transition-colors text-sm"
                        >
                            <p>{"+216" + ownerInfo?.contact.phone}</p>
                        </a>

                        {/* Ask AI Link */}
                        <div
                            className='flex items-center gap-2 mt-2 cursor-pointer group transition-all duration-300'
                            onClick={handleAskAiClicked}
                        >
                            <Sparkles
                                className='w-4 h-4 transition-colors duration-300'
                                strokeWidth={2.5}
                                style={{ color: '#a855f7' }}
                            />

                            <p className='text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 group-hover:from-indigo-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300'>
                                {activeLanguage.askAi}
                            </p>
                        </div>
                    </div>
                </div>

                {screenWidth > 1000 && <div className='h-full flex flex-1 flex-col justify-start items-center '>
                    <p>{activeLanguage.haveGoodShop}</p>
                    <img
                        src="/logo-simple-black.jpg"
                        className='w-14 h-14 mt-8'
                        alt=""
                    />
                </div>}

                <div className={`w-full flex flex-1 flex-col justify-center items-center gap-3 text-white ${screenWidth <= 1000 ? 'text-center' : ''}`}>

                    <h2 className='font-bold'>{'Social Media : '}</h2>

                    <div
                        className={`flex ${screenWidth > 1000 ? "flex-col" : "flex-row justify-center items-center"} text-center gap-3`}
                        style={{
                            color: colorsInsLightMode.light[350]
                        }}
                    >
                        {ownerInfo?.socialMedia?.map((social, index) => (
                            <a
                                key={index}
                                href={social.link}
                                className={`flex ${screenWidth > 1000 ? " justify-start gap-2 sm:px-10" : " justify-center"} items-center hover:opacity-80 transition-opacity`}
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

                {screenWidth < 1000 && <div className='h-full flex flex-1 flex-col justify-start items-center '>
                    <p className='text-center text-sm opacity-80 mt-2'>{activeLanguage.haveGoodShop}</p>
                    <img
                        src="/logo-simple-black.jpg"
                        className='w-10 h-10 mt-4'
                        alt=""
                    />
                </div>}

            </div>

            {/* ----------- NEW BOTTOM SECTION ----------- */}
            <div className='w-full flex flex-col sm:flex-row justify-between items-center pt-6 opacity-30 text-[10px] uppercase tracking-widest'>
                <p>© 2026 SilverWayShop. All Rights Reserved.</p>
            </div>
            {/* ------------------------------------------ */}

        </div>
    )
}

export default Footer
