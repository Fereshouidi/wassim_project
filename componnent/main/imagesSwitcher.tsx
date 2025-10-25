"use client";
import { useScreen } from '@/contexts/screenProvider';
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
    const { screenWidth } = useScreen();


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
        className={` no-sellect ${className}`} 
        style={{ 
            ...style 
        }}
    >
      
      <div 
        className='w-full h-[300px] sm:h-[500px] rounded-sm flex flex-1 justify-center items-center px-5 sm:px-10 scrollbar-hidden'
        style={{
            paddingBottom: 2,
            // minHeight: imageDisplayWidth / 2
        }}
    >
        <img 
            src={images[currentImageIndex]} 
            alt="" 
            className='w-full h-full object-content rounded-sm'
            style={{
                maxHeight: imageDisplayWidth,
            }}
            ref={imageDisplayRef}
        />
      </div>


        <div className='w-full h-[100px]- flex flex-row justify-center items-center'>

            {/* left arrow */}
            {screenWidth > 1000 && <div 
                className={`w-14 h-14 flex justify-center items-center rounded-full mx-10- cursor-pointer duration-300`}
                onMouseEnter={() => setLeftArrowHover(true)}
                onMouseLeave={() => setLeftArrowHover(false)}
                onClick={handleLeftArrowClick}
                style={leftArrowHover ?  arrowHoverStyle : arrowStyle}
            >
                <img 
                    src={activeTheme == "dark" ? "/icons/left-arrow-white.png" : "/icons/left-arrow-black.png"}
                    className='w-7 h-7'
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
            {screenWidth > 1000 && <div 
                className={`w-14 h-14 flex justify-center items-center rounded-full mx-10- cursor-pointer duration-300`}
                onMouseEnter={() => setRightArrowHover(true)}
                onMouseLeave={() => setRightArrowHover(false)}
                onClick={handleRightArrowClick}
                style={rightArrowHover ?  arrowHoverStyle : arrowStyle}
            >
                <img 
                    src={activeTheme == "dark" ? "/icons/right-arrow-white.png" : "/icons/right-arrow-black.png"}
                    className='w-7 h-7'
                />
            </div>}
        </div>


    </div>
  )
}

export default ImagesSwitcher
