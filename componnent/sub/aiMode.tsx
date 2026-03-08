import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import React, { CSSProperties, useState } from 'react'

type PropsType = {
    aiModeActive: boolean,
    setAiModeActive: (value: boolean) => void,
    aiIconStyle?: CSSProperties,
    aiIconContentStyle?: CSSProperties
}

const AiMode = ({
    aiModeActive,
    setAiModeActive,
    aiIconStyle,
    aiIconContentStyle
}: PropsType) => {

    const [aiModeHover, setAiModeHover] = useState<boolean>(false);
    const { activeTheme, colors } = useTheme();
    const { screenWidth } = useScreen();

    return (
        <>
            <div
                className={`${screenWidth > 1000 || aiModeActive ? 'w-[100px]' : 'w-[50px]'} h-[80%] flex justify-center items-center relative overflow-hidden m-3 rounded-full transition-[width] duration-300 cursor-pointer`}
                onClick={() => {
                    setAiModeActive(!aiModeActive)
                    setAiModeHover(aiModeActive ? false : aiModeHover)
                }}
            >
                {/* Inner content */}
                <div
                    className={`${screenWidth > 1000 || aiModeActive ? 'w-[97px] p-3' : 'w-[47px] p-2'} h-[93%] flex justify-center items-center rounded-full z-10 overflow-hidden relative transition-[width] duration-300`}
                    style={{
                        ...aiIconStyle,
                    }}
                    onMouseEnter={() => setAiModeHover(true)}
                    onMouseLeave={() => setAiModeHover(false)}
                >
                    <h4
                        className={`
                            text-sm ${screenWidth > 1000 || aiModeActive ? "opacity-100 mr-2" : "opacity-0 invisible w-0"} 
                            z-10 mr-2- whitespace-nowrap block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-bold-
                        `}
                        style={{
                            ...aiIconContentStyle
                        }}
                    >AI mode</h4>

                    <img
                        src="/ai.png"
                        alt="AI"
                        className="w-4 h-4 mr-1 object-contain relative z-10"
                    />
                </div>

                {/* CSS Animated Gradient Background */}
                <div
                    className="absolute inset-0 rounded-full z-0 ai-gradient-bg"
                    style={{
                        background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899, #6366f1)',
                        backgroundSize: '300% 300%',
                    }}
                />
            </div>

            <style jsx>{`
                .ai-gradient-bg {
                    animation: ai-gradient-shift 4s ease infinite;
                }
                @keyframes ai-gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </>
    )
}

export default AiMode
