import { headerHeight, headerHeightForPhones } from '@/constent'
import { useScreen } from '@/contexts/screenProvider'
import { useStatusBanner } from '@/contexts/StatusBanner'
import WelcomeIcon from '@/componnent/sub/welcomeIcon'
import React, { CSSProperties } from 'react'


const StatusBanner = () => {

    const { screenWidth } = useScreen();
    const { statusBannerExist, setStatusBanner, contentClassName, contentStyle, className, style, items, text } = useStatusBanner();

    return (
        <div 
            className={`w-full h-full fixed top-0 left-0 flex justify-center items-center z-[999] bg-black/30 backdrop-blur-sm ${contentClassName}`}
            style={{...contentStyle}}
            onClick={() => setStatusBanner(false)}
        >

            <div 
                className={`
                    rounded-sm flex justify-center px-5 py-2 absolute-
                    duration-300 ${className}`
                }
                style={{
                    top: screenWidth > 1000 ? headerHeight * 1.7 : headerHeightForPhones * 1.7 ,
                    ...style
                }}
            >
                <div className='w-fit h-fit bg-blue-500-'>
                    {items as React.ReactNode}
                    {text}
                </div>
            </div>

        </div>
    )
}

export default StatusBanner



//                    ${statusBannerExist ? "visible top" : "invisible top-[200px]"} 
