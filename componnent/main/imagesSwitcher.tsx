"use client";
import { useTheme } from '@/contexts/themeProvider';
import React, { CSSProperties, useEffect, useRef, useState } from 'react'

type ImagesSwitcherType = {
    className?: string
    style?: CSSProperties
    images: string[]
}
const ImagesSwitcher = ({
    className,
    style,
    images
}: ImagesSwitcherType) => { 

    const imageDisplayRef = useRef<HTMLImageElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [imageDisplayWidth, setImageDisplayWidth] = useState<number>(0);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [ leftArrowHover, setLeftArrowHover ] = useState<boolean>(false);
    const [ rightArrowHover, setRightArrowHover ] = useState<boolean>(false);
    const { colors, activeTheme } = useTheme();
    const [imgWidth, setimgWidth] = useState<number>(100);


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
        transform: 'scale(1)'
    }
    const arrowHoverStyle = {
        backgroundColor: colors.light[250],
        transform: 'scale(1.2)'
    }


  return (
    <div 
        className={` bg-blue-500  ${className}`} 
        style={{ 
            ...style 
        }}
    >
      
      <div 
        className='w-full min-h-[500px] flex flex-1 justify-center items-center bg-green-500 p-10'
        style={{
            // minHeight: imageDisplayWidth / 2
        }}
    >
        <img 
            src={images[currentImageIndex]} 
            alt="" 
            className='w-full object-content'
            style={{
                maxHeight: imageDisplayWidth,
            }}
            ref={imageDisplayRef}
        />
      </div>


        <div className='w-full h-[100px]- flex flex-row justify-center items-center bg-purple-500'>

            {/* left arrow */}
            <div 
                className={`w-14 h-14 flex justify-center items-center rounded-full mx-10 cursor-pointer duration-300`}
                onMouseEnter={() => setLeftArrowHover(true)}
                onMouseLeave={() => setLeftArrowHover(false)}
                onClick={handleLeftArrowClick}
                style={leftArrowHover ?  arrowHoverStyle : arrowStyle}
            >
                <img 
                    src={activeTheme == "dark" ? "/icons/left-arrow-white.png" : "/icons/left-arrow-black.png"}
                    className='w-7 h-7'
                />
            </div>
            
            {/* slider */}
        <div 
            className='h-full- overflow-x-scroll scrollbar-hidden bg-pink-500'
            ref={sliderRef}
            style={{
                width: imgWidth * 3 + "px"
            }}
        >

            {/* slides */}
            <div 
                className='slides w-[500px]- w-fit h-full- bg-yellow-500 flex flex-row'
            >{
                images.map((img, index) => (
                    <div 
                        className='flex justify-center items-center p-2 overflow-hidden bg-orange-500 border-1 border-red-500'
                        key={index}
                        style={{
                            width: imgWidth + 'px',
                            height: imgWidth + 'px',
                        }}
                    >
                        <img
                            className='w-full h-full object-cover cursor-pointer rounded-full'
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
            <div 
                className={`w-14 h-14 flex justify-center items-center rounded-full mx-10 cursor-pointer duration-300`}
                onMouseEnter={() => setRightArrowHover(true)}
                onMouseLeave={() => setRightArrowHover(false)}
                onClick={handleRightArrowClick}
                style={rightArrowHover ?  arrowHoverStyle : arrowStyle}
            >
                <img 
                    src={activeTheme == "dark" ? "/icons/right-arrow-white.png" : "/icons/right-arrow-black.png"}
                    className='w-7 h-7'
                />
            </div>
        </div>


    </div>
  )
}

export default ImagesSwitcher
