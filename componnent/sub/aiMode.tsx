import { useTheme } from '@/contexts/themeProvider';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React from 'react'

type PropsType = {
    aiModeActive: boolean,
    setAiModeActive: (value: boolean) => void,
}

const AiMode = ({
    aiModeActive,
    setAiModeActive
}: PropsType) => {

    const { activeTheme, colors } = useTheme();
    const aiIcon = activeTheme == "dark" ? "/icons/ai_black.png" : "/icons/ai_black.png" 
  return (
        <div    
            className='h-[70%] w-full flex justify-center items-center rounded-full m-3 p-2 relative duration-300'
            style={{
                // backgroundColor: colors.light[300]
            }}
            onClick={() => setAiModeActive(!aiModeActive)}
        >
            <h4 
                className={`text-sm ${aiModeActive ? "flex" : "hidden"} z-10 duration-300`}
                style={{
                    color: colors.dark[200]
                }}
            >Ai mode</h4>

            <img 
                className='rounded-sm cursor-pointer mx-2 h-[70%] z-10'
                src={aiIcon} 
                alt="" 
                style={{
                    // backgroundColor: colors.dark[100]
                    // ...searchIconStyle,
                }}
            />

            <DotLottieReact
                src={"/AIBg.json"}
                autoplay
                loop
                // muted
                className={`absolute w-[200%] h-[200%] rounded-full object-cover rounded-sm pointer-events-none opacity-100 duration-300 z-0`}
            />

        </div>
  )
}

export default AiMode


// AIBg