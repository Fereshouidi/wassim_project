import React from 'react';
import { useTheme } from '@/contexts/themeProvider';
import { useOwner } from '@/contexts/ownerInfo';
import { useLanguage } from '@/contexts/languageContext';

const LoadingLogo = () => {
  const { ownerInfo } = useOwner();
  const { activeTheme, colors } = useTheme();
  const { activeLanguage } = useLanguage();

  const logoSrc = activeTheme === "dark" ? "/logo-simple-white.jpg" : "/logo-simple-black.jpg";

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[inherit] p-4">
      
      <style>
        {`
          @keyframes breathing {
            0%, 100% {
              transform: scale(0.9);
              filter: drop-shadow(0 0 0px rgba(255,255,255,0));
            }
            50% {
              transform: scale(1.1);
              filter: drop-shadow(0 0 20px ${activeTheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'});
            }
          }
          .animate-breathing {
            animation: breathing 2.5s ease-in-out infinite;
          }
        `}
      </style>

      <div className="relative flex items-center justify-center w-[clamp(80px,20vw,160px)] h-[clamp(80px,20vw,160px)]">

        <div 
          className="absolute inset-0 rounded-full blur-[3vw] opacity-20 animate-pulse"
          style={{ backgroundColor: colors.dark[100] }}
        ></div>

        {logoSrc ? (
          <div 
            className="w-full h-full p-[15%] rounded-full object-contain animate-breathing z-10 flex items-center justify-center"
            style={{
              backgroundColor: colors.dark[100],
              border: `1px solid ${colors.light[200]}`
            }}
          >
            <img
              src={logoSrc}
              alt="Loading Logo"
              className='w-full h-full object-contain'
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center animate-breathing">
             <span className="font-bold opacity-50 text-[min(3vw,14px)]">
               {activeLanguage.sideMatter.loading + "..."}
             </span>
          </div>
        )}
      </div>

      <div className="mt-[5%] flex flex-col items-center gap-2">
        <p className="text-[min(2.5vw,10px)] tracking-[0.3em] uppercase opacity-40 font-medium whitespace-nowrap">
          {activeLanguage.sideMatter.loading}
        </p>
        <div className="flex gap-1.5">
            <span className="w-[4px] h-[4px] bg-current rounded-full animate-bounce" style={{ backgroundColor: colors.dark[200], animationDelay: '0s' }}></span>
            <span className="w-[4px] h-[4px] bg-current rounded-full animate-bounce" style={{ backgroundColor: colors.dark[200], animationDelay: '0.2s' }}></span>
            <span className="w-[4px] h-[4px] bg-current rounded-full animate-bounce" style={{ backgroundColor: colors.dark[200], animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingLogo;