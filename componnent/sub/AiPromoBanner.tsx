'use client';
import React from 'react';
import { useTheme } from '@/contexts/themeProvider';
import { useAiChatBubble } from '@/contexts/AiChatBubble';
import { useClient } from '@/contexts/client';
import { useRegisterSection } from '@/contexts/registerSec';
import { useLanguage } from '@/contexts/languageContext';
import { useOwner } from '@/contexts/ownerInfo';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, MessageSquare, Zap, Search } from 'lucide-react';

const AiPromoBanner = () => {
    const { colors, activeTheme } = useTheme();
    const { setBubbleProps } = useAiChatBubble();
    const { client } = useClient();
    const { setRegisterSectionExist } = useRegisterSection();
    const { activeLanguage } = useLanguage();
    const { ownerInfo } = useOwner();
    const isDark = activeTheme === 'dark';

    const handleOpenAi = () => {
        if (!client) {
            setRegisterSectionExist(true);
            return;
        }
        setBubbleProps(prev => ({ ...prev, exist: true }));
    };

    const features = [
        { icon: Search, label: activeLanguage.language === 'fr' ? 'Recherche intelligente' : 'Smart Search' },
        { icon: MessageSquare, label: activeLanguage.language === 'fr' ? 'Chat en temps réel' : 'Real-time Chat' },
        { icon: Zap, label: activeLanguage.language === 'fr' ? 'Réponses instantanées' : 'Instant Answers' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-full px-4 sm:px-8 py-6"
        >
            <div
                className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden cursor-pointer group"
                onClick={handleOpenAi}
                style={{
                    background: isDark
                        ? 'linear-gradient(135deg, rgba(20,10,40,0.9) 0%, rgba(10,5,30,0.95) 100%)'
                        : 'linear-gradient(135deg, #f8f6ff 0%, #f0e8ff 50%, #ffe8f0 100%)',
                    border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'}`,
                }}
            >
                {/* Animated gradient border glow */}
                <div className="absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-sm"
                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)' }}
                />

                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-80 h-80 opacity-10 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
                    }}
                />
                <div className="absolute bottom-0 left-0 w-60 h-60 opacity-10 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
                    }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-10">

                    {/* Left: Text Content */}
                    <div className="flex-1 text-center sm:text-left">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] mb-5"
                            style={{
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
                                color: isDark ? '#c4b5fd' : '#7c3aed',
                                border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
                            }}
                        >
                            <Sparkles className="w-3 h-3" />
                            {activeLanguage.language === 'fr' ? 'Nouveau · Intelligence Artificielle' : 'New · Artificial Intelligence'}
                        </motion.div>

                        {/* Heading */}
                        <h3
                            className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-3"
                            style={{ color: isDark ? '#fff' : '#1a1a2e' }}
                        >
                            {activeLanguage.language === 'fr'
                                ? <>Votre assistant shopping<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">propulsé par l'IA</span></>
                                : <>Your personal shopping<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">AI-powered assistant</span></>
                            }
                        </h3>

                        <p className="text-sm font-medium opacity-60 max-w-md leading-relaxed mb-6"
                            style={{ color: isDark ? '#ccc' : '#555' }}
                        >
                            {activeLanguage.language === 'fr'
                                ? "Demandez n'importe quoi sur nos produits, obtenez des recommandations personnalisées et trouvez exactement ce que vous cherchez."
                                : "Ask anything about our products, get personalized recommendations, and find exactly what you're looking for."
                            }
                        </p>

                        {/* Feature pills */}
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                            {features.map((feat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                                    style={{
                                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                        color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                                    }}
                                >
                                    <feat.icon className="w-3.5 h-3.5" />
                                    {feat.label}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="shrink-0"
                    >
                        <div
                            className="flex items-center gap-3 px-7 py-4 rounded-2xl text-white font-black text-sm shadow-xl group-hover:shadow-2xl group-hover:-translate-y-0.5 transition-all duration-300"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                                boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
                            }}
                        >
                            <Sparkles className="w-5 h-5" />
                            {activeLanguage.language === 'fr' ? 'Essayer l\'IA' : 'Try AI Now'}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </motion.div>
    );
};

export default AiPromoBanner;
