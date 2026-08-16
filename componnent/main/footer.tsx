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
                            className={`flex flex-row justify-center items-center gap-2 hover:text-white transition-colors text-[12px]`}
                        >
                            <p>{ownerInfo?.contact.email}</p>
                        </a>

                        <a
                            href={`tel:+216${ownerInfo?.contact.phone}`}
                            className="flex flex-row justify-center items-center hover:text-white transition-colors text-[12px]"
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

                            <p className='text-[12px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 group-hover:from-indigo-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300'>
                                {activeLanguage.askAi}
                            </p>
                        </div>
                    </div>
                </div>

                {screenWidth > 1000 && (
                    <div className='h-full flex flex-1 flex-col justify-center items-center gap-5'>
                        {/* Decorative line */}
                        <div className='w-12 h-[1px] bg-gradient-to-r from-transparent via-white/20- to-transparent' />

                        {/* Logo with glow ring */}
                        <div className='relative group'>
                            <div
                                className='absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700'
                                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)' }}
                            />
                            <div className='relative w-14 h-14 bg-white p-1 rounded-full border border-white/10 group-hover:border-white/25 transition-all duration-500'>
                                <img
                                    src="/logo-simple-white.jpg"
                                    className='w-full h-full rounded-full object-cover'
                                    alt="Silver Way"
                                />
                            </div>
                        </div>

                        {/* Brand message */}
                        <div className='text-[8px] font-bold uppercase tracking-[0.3em] text-white/40 text-center'>
                            <p>{activeLanguage.haveGoodShop?.part1}</p>
                            <p>{activeLanguage.haveGoodShop?.part2}</p>
                        </div>

                        {/* Decorative line */}
                        <div className='w-12 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent' />
                    </div>
                )}

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
                                {screenWidth > 1000 && <p className='text-[11px] font-[1px] '>{social.platform}</p>}
                            </a>
                        ))}
                    </div>
                </div>

                {screenWidth < 1000 && (
                    <div className='h-full flex flex-1 flex-col justify-center items-center gap-4 pt-2'>
                        <div className='w-10 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent' />

                        <div className='relative'>
                            <div
                                className='absolute inset-0 rounded-full blur-lg opacity-20'
                                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)' }}
                            />
                            <div className='relative w-12 h-12 bg-white p-1 rounded-full border border-white/10 group-hover:border-white/25 transition-all duration-500'>
                                <img
                                    src="/logo-simple-white.jpg"
                                    className='w-full h-full rounded-full object-cover'
                                    alt="Silver Way"
                                />
                            </div>
                        </div>

                        <div className='text-[8px] font-bold uppercase tracking-[0.25em] text-white/35 text-center'>
                            <p>{activeLanguage.haveGoodShop?.part1}</p>
                            <p>{activeLanguage.haveGoodShop?.part2}</p>
                        </div>

                        <div className='w-10 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent' />
                    </div>
                )}

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
