'use client';
import React, { useState } from 'react';
import { useTheme } from '@/contexts/themeProvider';
import { useAiChatBubble } from '@/contexts/AiChatBubble';
import { useClient } from '@/contexts/client';
import { useRegisterSection } from '@/contexts/registerSec';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, MessageCircle } from 'lucide-react';

const AiFloatingButton = () => {
    const { colors, activeTheme } = useTheme();
    const { bubbleProps, setBubbleProps } = useAiChatBubble();
    const { client } = useClient();
    const { setRegisterSectionExist } = useRegisterSection();
    const [isHovered, setIsHovered] = useState(false);
    const isDark = activeTheme === 'dark';

    const handleClick = () => {
        if (!client) {
            setRegisterSectionExist(true);
            return;
        }
        setBubbleProps(prev => ({ ...prev, exist: !prev.exist }));
    };

    // Don't render the button if chat is already open
    if (bubbleProps.exist) return null;

    return (
        <motion.div
            className="fixed bottom-8 left-6 z-[40] flex items-center gap-3"
            initial={{ opacity: 0, scale: 0, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 1 }}
        >
            {/* Tooltip / Label */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: 10, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.9 }}
                        className="px-4 py-2.5 rounded-2xl shadow-xl border whitespace-nowrap"
                        style={{
                            backgroundColor: isDark ? 'rgba(20,20,20,0.95)' : 'rgba(255,255,255,0.95)',
                            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        <p className="text-xs font-bold" style={{ color: colors.dark[200] }}>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">AI Assistant</span>
                            <span className="ml-1 opacity-50">· Ask me anything</span>
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Button */}
            <motion.button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="relative group cursor-pointer outline-none"
                aria-label="Open AI Assistant"
            >
                {/* Glow ring */}
                <div className="absolute -inset-1 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-md"
                    style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                    }}
                />

                {/* Animated pulse ring */}
                <div className="absolute -inset-2 rounded-full animate-ping opacity-20"
                    style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                        animationDuration: '3s',
                    }}
                />

                {/* Button body */}
                <div
                    className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                    }}
                >
                    {/* Inner shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/20 to-white/0 translate-y-full group-hover:translate-y-[-100%] transition-transform duration-700" />

                    <Sparkles className="w-6 h-6 text-white relative z-10 drop-shadow-md" strokeWidth={2.5} />
                </div>

                {/* Notification dot */}
                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white dark:border-gray-900 shadow-md flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
            </motion.button>
        </motion.div>
    );
};

export default AiFloatingButton;
