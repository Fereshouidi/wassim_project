import { useTheme } from '@/contexts/themeProvider';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
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
    const aiIcon = "ai.png"
    
    // activeTheme == "dark" ? "/icons/ai_black.png" : "/icons/ai_black.png" 
    
    return (

        <div 
            className={`${aiModeHover || aiModeActive ? 'w-[100px]' : 'w-[50px]'} h-[80%] flex justify-center items-center bg-red-500 relative overflow-hidden m-3 rounded-full duration-300`}
            onClick={() => setAiModeActive(!aiModeActive)}
        >

            <div    
                className={`${aiModeHover || aiModeActive ? 'w-[97px]' : 'w-[47px]'} h-[92%] flex justify-center items-center rounded-full p-2 z-10 overflow-hidden relative duration-300`}
                style={{
                    ...aiIconStyle,
                    // backgroundColor: colors.light[200]
                    
                }}
                onClick={() => setAiModeActive(!aiModeActive)}
                onMouseEnter={() => setAiModeHover(true)}
                onMouseLeave={() => setAiModeHover(false)}
            >
                <h4 
                    className={`
                        text-sm ${aiModeHover || aiModeActive ? "opacity-100" : "opacity-0 invisible w-0"} 
                        z-10 duration-300- whitespace-nowrap block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-red-500
                    `}
                    style={{
                        // color: colors.dark[400]
                        ...aiIconContentStyle
                    }}
                >Ai mode</h4>

                <img 
                    className='rounded-sm cursor-pointer mx-2 h-[80%] z-10'
                    src={aiIcon} 
                    alt="" 
                    style={{
                        // backgroundColor: colors.dark[100]
                        // ...searchIconStyle,
                    }}
                />

            </div>
        
            <DotLottieReact
                src={"/AIBg.json"}
                autoplay
                loop
                // muted
                className={`absolute w-[500%] h-[500%] object-cover pointer-events-none opacity-100 duration-300 z-0`}
            />
        
        </div>
    )
}

export default AiMode


// AIBg