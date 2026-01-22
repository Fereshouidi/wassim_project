import React from 'react';
import { useTheme } from '@/contexts/themeProvider';
import { useOwner } from '@/contexts/ownerInfo';
import { useLanguage } from '@/contexts/languageContext';

const LoadingLogo = () => {

  const { ownerInfo } = useOwner();
  const { activeTheme, colors } = useTheme();
  const { activeLanguage } = useLanguage();

  const logoSrc = activeTheme === "dark" ? "/logo-simple-white.jpg" : "/logo-simple-black.jpg" ;

  return (
    <div className="flex flex-col items-center justify-center w-full h-64">

      <style>
        {`
          @keyframes breathing {
            0%, 100% {
              transform: scale(0.85);
              filter: drop-shadow(0 0 0px rgba(255,255,255,0));
            }
            50% {
              transform: scale(1.15);
              filter: drop-shadow(0 0 15px ${activeTheme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'});
            }
          }
          .animate-breathing {
            animation: breathing 2.5s ease-in-out infinite;
          }
        `}
      </style>

      <div className="relative flex items-center justify-center">

        <div 
          className="absolute w-32 h-32 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ backgroundColor: colors.dark[100] }}
        ></div>

        {logoSrc ? (
          <div 
            className="w-28 h-28 p-5 rounded-full object-contain animate-breathing z-10"
            style={{
              backgroundColor: colors.dark[100],
              border: `1px solid ${colors.light[100]}`
            }}
          >
            <img
              src={logoSrc}
              alt="Loading Logo"
              className='w-full h-full'
            />
          </div>
        ) : (
          <div className="w-28 h-28 flex items-center justify-center animate-breathing">
             <span className="font-bold opacity-50">{activeLanguage.sideMatter.loading + "..."}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col items-center gap-1">
        <p className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-medium">
          {activeLanguage.sideMatter.loading}
        </p>
        <div className="flex gap-1">
            <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingLogo;