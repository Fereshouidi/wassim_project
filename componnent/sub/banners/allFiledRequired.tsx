import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from "@/contexts/themeProvider";

interface Props {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

const RequiredFieldsBanner = ({ isVisible, message, onClose }: Props) => {
  const { colors } = useTheme();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="pointer-events-auto relative overflow-hidden flex flex-col items-center"
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '40px 30px',
              borderRadius: '40px',
              backgroundColor: colors.light[100],
              boxShadow: '0 30px 60px -10px rgba(0,0,0,0.12)',
            }}
          >
            {/* أيقونة التنبيه - تصميم Minimalist بلون دافئ */}
            <div 
              className="w-20 h-20 rounded-full flex justify-center items-center mb-6"
              style={{ backgroundColor: '#FFFBEB' }} // Amber-50
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </motion.div>
            </div>

            {/* محتوى الرسالة */}
            <h3 
              className="text-xl font-black mb-2 tracking-tighter"
              style={{ color: colors.dark[100] }}
            >
              Missing Info
            </h3>
            
            <p 
              className="text-center font-bold text-[15px] opacity-50 leading-relaxed"
              style={{ color: colors.dark[100] }}
            >
              {message}
            </p>

            {/* بار الوقت السفلي باللون البرتقالي الدافئ */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1"
              style={{ backgroundColor: '#F59E0B', opacity: 0.3 }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RequiredFieldsBanner;