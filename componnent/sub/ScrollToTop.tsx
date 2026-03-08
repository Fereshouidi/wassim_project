'use client';
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/themeProvider';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { colors, activeTheme } = useTheme();

    const isDark = activeTheme === 'dark';

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.scrollY > 400) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="fixed bottom-10 right-10 sm:right-10 z-[50] cursor-pointer"
                    onClick={scrollToTop}
                >
                    <div
                        className="w-12 h-12 flex items-center justify-center rounded-2xl shadow-2xl border"
                        style={{
                            backgroundColor: isDark ? 'rgba(15, 15, 15, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                            color: colors.dark[100],
                            backdropFilter: 'blur(12px)',
                            boxShadow: isDark ? '0 15px 35px rgba(0,0,0,0.5)' : '0 15px 35px rgba(0,0,0,0.1)',
                        }}
                    >
                        <ChevronUp size={24} strokeWidth={3} className="animate-bounce-slow" />
                    </div>
                    <style jsx>{`
                        .animate-bounce-slow {
                            animation: bounce-slow 2s infinite;
                        }
                        @keyframes bounce-slow {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-3px); }
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
