import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from "@/contexts/themeProvider";

interface Props {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

const AccountNotFoundBanner = ({ isVisible, message, onClose }: Props) => {
  const { colors } = useTheme();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000); // مدة أطول قليلاً للقراءة
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="pointer-events-auto relative overflow-hidden flex flex-col items-center"
            style={{
              width: '100%',
              maxWidth: '450px',
              padding: '60px 40px',
              borderRadius: '50px',
              backgroundColor: colors.light[100],
              boxShadow: '0 50px 100px -20px rgba(0,0,0,0.2)',
              border: `1px solid ${colors.dark[100]}05`
            }}
          >
            {/* أيقونة البحث المفقود - تصميم تجريدي */}
            <div className="relative mb-8">
              <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-24 h-24 rounded-full flex justify-center items-center shadow-inner"
                style={{ backgroundColor: `${colors.dark[100]}08` }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={colors.dark[100]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="18" y1="8" x2="23" y2="13"></line>
                  <line x1="23" y1="8" x2="18" y2="13"></line>
                </svg>
              </motion.div>
            </div>

            {/* محتوى الرسالة */}
            <h3 
              className="text-2xl font-black mb-3 tracking-tighter"
              style={{ color: colors.dark[100] }}
            >
               User Not Found
            </h3>
            
            <p 
              className="text-center font-bold text-[15px] opacity-40 leading-relaxed"
              style={{ color: colors.dark[100] }}
            >
              {message}
            </p>

            {/* تفصيل تجميلي: نقاط صغيرة توحي بالبحث */}
            <div className="flex gap-2 mt-8">
               {[0, 1, 2].map((i) => (
                 <motion.div 
                   key={i}
                   animate={{ opacity: [0.2, 1, 0.2] }}
                   transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                   className="w-1.5 h-1.5 rounded-full"
                   style={{ backgroundColor: colors.dark[100] }}
                 />
               ))}
            </div>

            {/* بار الوقت السفلي بلون الـ Dark ليعطي طابعاً رسمياً */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 4, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1"
              style={{ backgroundColor: colors.dark[100], opacity: 0.1 }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AccountNotFoundBanner;