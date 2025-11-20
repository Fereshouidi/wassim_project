"use client";
import { useScreen } from '@/contexts/screenProvider';
import { useTheme } from '@/contexts/themeProvider';
import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import SkeletonLoading from '../sub/SkeletonLoading';
import { useClient } from '@/contexts/client';
import { useRegisterSection } from '@/contexts/registerSec';

type ImagesSwitcherType = {
    className?: string
    style?: CSSProperties
    images: string[],
    like: boolean
    setLike: (value: boolean) => void
}
const ImagesSwitcher = ({
    className,
    style,
    images,
    like,
    setLike
}: ImagesSwitcherType) => { 

    const imageDisplayRef = useRef<HTMLImageElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [imageDisplayWidth, setImageDisplayWidth] = useState<number>(0);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [ leftArrowHover, setLeftArrowHover ] = useState<boolean>(false);
    const [ rightArrowHover, setRightArrowHover ] = useState<boolean>(false);
    const { colors, activeTheme } = useTheme();
    const [imgWidth, setimgWidth] = useState<number>(100);
    const { screenWidth } = useScreen();
    const { client } = useClient();
    const { setRegisterSectionExist } = useRegisterSection();


    useEffect(() => {
        if (imageDisplayRef.current) {
            setImageDisplayWidth(imageDisplayRef.current.clientWidth);
        }
    }, []);

  const handleLeftArrowClick = () => {
        if (!sliderRef.current) return;
        sliderRef.current.scrollLeft -= imgWidth;
  }

    const handleRightArrowClick = () => {
        if (!sliderRef.current) return;
        sliderRef.current.scrollLeft += imgWidth;
    }

    const arrowStyle = {
        transform: 'scale(1)',
        backgroundColor: colors.light[250],
    }
    const arrowHoverStyle = {
        backgroundColor: colors.light[250],
        transform: 'scale(1.2)'
    }


  return (
    <div 
        className={` relative h-full top-0 min-w-[300px] sm:min-w-[550px] min-h-[300px] sm:min-h-[500px] bg-yellow-500- w-[600px]- flex flex-col justify-center items-center bg-yellow-500- pt-10- no-sellect bg-transparent- ${className}`} 
        style={{ 
            ...style 
        }}
    >

      
      <div 
        className={`bg-red-500- relative min-h-full- min-w-full ${screenWidth > 500 ? "w-[600px]- h-[500px]" : "w-[400px]- h-[400px]"}  bg-red-500- rounded-sm flex flex-1 justify-center items-center p-5 sm:px-10- scrollbar-hidden`}
        style={{
            paddingBottom: 2,
            // minHeight: imageDisplayWidth / 2
        }}
    >
        <div 
            className={`absolute top-7 right-7 rounded-full p-2 ${like ? "bg-red-500" : "bg-gray-400"} w-10 h-10 cursor-pointer`}
            style={{
                boxShadow: `0 5px 15px ${colors.dark[700]}`,
                // backgroundColor: like ? "" : 
            }}
            onClick={() => {
                if (client) {
                    setLike(!like)
                } else {
                    setRegisterSectionExist(true)
                }
            }}
        >
            <img 
                src={activeTheme == "dark" ? "/icons/heart-white.png" : "/icons/heart-white.png"} 
                className='w-full h-full'
                alt="" 
            />
        </div>

        {
            images[currentImageIndex] ? <img 
                src={images[currentImageIndex]} 
                alt="" 
                className='w-full h-full bg-blue-500- object-content rounded-sm'
                style={{
                    maxHeight: "90vh",
                }}
                ref={imageDisplayRef}
            />
        :
            <SkeletonLoading/>
        }
      </div>


        {images && <div className='w-full h-[100px]- flex flex-row justify-center items-center'>

            {/* left arrow */}
            {images.length > 3 && screenWidth > 1000 && <div 
                className={`w-14 h-14 flex justify-center items-center rounded-full mx-10- cursor-pointer duration-300`}
                onMouseEnter={() => setLeftArrowHover(true)}
                onMouseLeave={() => setLeftArrowHover(false)}
                onClick={handleLeftArrowClick}
                style={leftArrowHover ?  arrowHoverStyle : arrowStyle}
            >
                <img 
                    src={activeTheme == "dark" ? "/icons/left-arrow-white.png" : "/icons/left-arrow-black.png"}
                    className='w-6 h-6'
                />
            </div>}
            
            {/* slider */}
        <div 
            className='h-full- overflow-x-scroll scrollbar-hidden'
            ref={sliderRef}
            style={{
                width: imgWidth * 3 + "px"
            }}
        >

            {/* slides */}
            <div 
                className='slides w-[500px]- w-fit h-full- flex flex-row'
            >{
                images.map((img, index) => (
                    <div 
                        className='flex justify-center items-center p-2 overflow-hidden '
                        key={index}
                        style={{
                            width: imgWidth + 'px',
                            height: imgWidth + 'px',
                        }}
                    >
                        <img
                            className='w-full h-full object-cover cursor-pointer rounded-sm'
                            src={img}
                            style={{
                                border: currentImageIndex == index ? `2px solid ${colors.dark[100]}` : `2px solid transparent`
                            }}
                            onClick={() => setCurrentImageIndex(index)}
                        />
                    </div>
                ))
            }</div>

        </div>

            {/* right arrow */}
            {images.length > 3 && screenWidth > 1000 && <div 
                className={`w-14 h-14 flex justify-center items-center rounded-full mx-10- cursor-pointer duration-300`}
                onMouseEnter={() => setRightArrowHover(true)}
                onMouseLeave={() => setRightArrowHover(false)}
                onClick={handleRightArrowClick}
                style={rightArrowHover ?  arrowHoverStyle : arrowStyle}
            >
                <img 
                    src={activeTheme == "dark" ? "/icons/right-arrow-white.png" : "/icons/right-arrow-black.png"}
                    className='w-6 h-6'
                />
            </div>}
        </div>}


    </div>
  )
}

export default ImagesSwitcher
