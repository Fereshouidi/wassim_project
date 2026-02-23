import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from "@/contexts/themeProvider";

interface Props {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

const WrongPasswordBanner = ({ isVisible, message, onClose }: Props) => {
  const { colors } = useTheme();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3500); // يختفي بعد 3.5 ثانية
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none p-4">
          <motion.div
            // تأثير الدخول: اهتزاز أفقي (Shake) يوحي بالرفض
            initial={{ opacity: 0, scale: 0.9, x: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: [0, -10, 10, -10, 10, 0] // حركة Shake احترافية
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ 
              x: { duration: 0.5, ease: "easeInOut" },
              default: { type: "spring", stiffness: 300, damping: 20 } 
            }}
            className="pointer-events-auto relative overflow-hidden flex flex-col items-center"
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '50px 30px',
              borderRadius: '40px',
              backgroundColor: colors.light[100],
              boxShadow: '0 40px 80px -15px rgba(239, 68, 68, 0.15), 0 20px 40px -10px rgba(0,0,0,0.1)',
              border: '1px solid rgba(239, 68, 68, 0.1)' // حدود حمراء خفيفة جداً
            }}
          >
            {/* أيقونة القفل المغلق بتصميم Minimalist */}
            <div 
              className="w-20 h-20 rounded-full flex justify-center items-center mb-6"
              style={{ backgroundColor: '#FEF2F2' }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                <line x1="12" y1="15" x2="12" y2="17"></line>
              </svg>
            </div>

            {/* نصوص الخطأ */}
            <h3 
              className="text-2xl font-black mb-2 tracking-tighter"
              style={{ color: colors.dark[100] }}
            >
              Access Denied
            </h3>
            
            <p 
              className="text-center font-bold text-[15px] opacity-50 leading-relaxed px-6"
              style={{ color: colors.dark[100] }}
            >
              {message}
            </p>

            {/* بار الوقت السفلي (Progress Bar) باللون الأحمر */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3.5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1"
              style={{ backgroundColor: '#EF4444', opacity: 0.4 }}
            />
            
            {/* زخرفة هندسية في الخلفية */}
            <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
               <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                  <circle cx="100" cy="0" r="100" fill="#EF4444" />
               </svg>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WrongPasswordBanner;