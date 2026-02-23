'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '@/contexts/themeProvider';
import { useOwner } from '@/contexts/ownerInfo';
import { useAiChatBubble } from '@/contexts/AiChatBubble';
import axios from 'axios';
import { backEndUrl } from '@/api';
import { useClient } from '@/contexts/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 
import { useCartSide } from '@/contexts/cart';

const AiChatBubble = () => {
    const { ownerInfo } = useOwner();
    // استخدام history و addMessage من الـ Context
    const { bubbleProps, setBubbleProps, history, setHistory, addMessage } = useAiChatBubble();
    const { client } = useClient();
    const { setIsActive } = useCartSide();
    const { activeTheme, colors } = useTheme();

    const containerRef = useRef<HTMLDivElement>(null);
    const posRef = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const [userMessage, setUserMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [skip, setSkip] = useState(0);
    const limit = 15;

    const scrollRef = useRef<HTMLDivElement>(null);
    const snapshotScrollRef = useRef<number>(0);

    const isDark = activeTheme === 'dark';
    const accentGradient = "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)";

    useEffect(() => {
        if (bubbleProps.exist && containerRef.current && posRef.current.x === 0) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            posRef.current = { x: centerX, y: centerY };
            containerRef.current.style.transform = `translate3d(${centerX}px, ${centerY}px, 0) translate(-50%, -50%)`;
        }
    }, [bubbleProps.exist]);

    const fetchChatHistory = useCallback(async (currentSkip: number) => {
        if (!client?._id || (!hasMore && currentSkip !== 0)) return;
        if (scrollRef.current) snapshotScrollRef.current = scrollRef.current.scrollHeight;

        setIsLoadingMore(true);
        try {
            const { data } = await axios.post(`${backEndUrl}/getChatHistory`, {
                clientId: client._id,
                limit: limit,
                skip: currentSkip
            });

            if (data.length < limit) setHasMore(false);

            if (currentSkip === 0) {
                setHistory(data);
                requestAnimationFrame(() => {
                    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                });
            } else {
                setHistory(prev => [...data, ...prev]);
                requestAnimationFrame(() => {
                    if (scrollRef.current) {
                        scrollRef.current.scrollTop = scrollRef.current.scrollHeight - snapshotScrollRef.current;
                    }
                });
            }
            setSkip(currentSkip + data.length);
        } catch (err) {
            console.error("History Error:", err);
        } finally {
            setIsLoadingMore(false);
        }
    }, [client?._id, hasMore, setHistory]);

    useEffect(() => {
        if (bubbleProps.exist && client?._id && history.length === 0) fetchChatHistory(0);
    }, [bubbleProps.exist, client?._id, fetchChatHistory, history.length]);

    const updatePosition = (e: MouseEvent) => {
        if (!isDragging.current || !containerRef.current) return;
        const nextX = e.clientX - dragOffset.current.x;
        const nextY = e.clientY - dragOffset.current.y;
        posRef.current = { x: nextX, y: nextY };
        containerRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0) translate(-50%, -50%)`;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragOffset.current = { x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y };
        window.addEventListener('mousemove', updatePosition);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener('mousemove', updatePosition);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    const handleSendMessage = async () => {
        if (!userMessage.trim() || isTyping) return;
        const msg = userMessage;
        
        addMessage('user', msg); 
        setUserMessage('');
        setIsTyping(true);

        try {
            setBubbleProps(prev => ({ ...prev, isTherAnswer: true }));
            const { data } = await axios.post(`${backEndUrl}/getAnswerFromAi`, {
                userId: client?._id, message: msg,
            });
            if (data.uiAction && data.uiAction.element === 'cart') setIsActive(data.uiAction.state === 'open');
            
            addMessage('assistant', data.answer);
        } catch (err) {
            setBubbleProps(prev => ({ ...prev, answer: "Error." }));
        } finally {
            setIsTyping(false);
            requestAnimationFrame(() => {
                if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            });
        }
    };

    if (!bubbleProps.exist) return null;

    return (
        <div
            ref={containerRef}
            style={{
                left: 0, top: 0,
                backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)',
                color: colors.dark[200],
                backdropFilter: 'blur(12px)',
                borderColor: isDark ? '#333' : '#e5e7eb',
            }}
            className="fixed z-[9999] w-[95vw] md:w-[480px] flex flex-col rounded-3xl overflow-hidden border shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
        >
            <div onMouseDown={handleMouseDown} className="flex items-center justify-between px-6 py-5 cursor-grab active:cursor-grabbing border-b border-current/5 select-none">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.20em] opacity-60">
                        {ownerInfo?.name} AI
                    </span>
                </div>
                <button onClick={() => setBubbleProps({...bubbleProps, exist: false})} className="hover:scale-110 transition-transform p-1 opacity-50 hover:opacity-100">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
            </div>

            <div ref={scrollRef} onScroll={(e) => e.currentTarget.scrollTop <= 5 && !isLoadingMore && hasMore && fetchChatHistory(skip)} className="p-6 h-[50vh] overflow-y-auto custom-scrollbar flex flex-col gap-6">
                {isLoadingMore && <div className="h-4 bg-current/5 rounded w-1/3 self-center animate-pulse" />}
                
                <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''}`}>
                    {history.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                            <div className={`max-w-[88%] px-5 py-3 rounded-[22px] text-[14px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-none' : 'bg-current/5 border border-current/5 rounded-tl-none'}`}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                                    table: ({ children }) => (<div className="my-3 overflow-x-auto border border-current/10 rounded-xl"><table className="min-w-full divide-y divide-current/10 text-[12px]">{children}</table></div>),
                                    th: ({ children }) => <th className="p-3 bg-current/5 font-bold text-left">{children}</th>,
                                    td: ({ children }) => <td className="p-3 border-t border-current/5">{children}</td>,
                                }}>
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start animate-in fade-in slide-in-from-left-2">
                            <div className="bg-current/5 px-5 py-4 rounded-[22px] rounded-tl-none w-2/3 flex flex-col gap-2">
                                <div className="h-2 bg-current/10 rounded-full w-full overflow-hidden">
                                    <div className="h-full w-1/2" style={{ background: accentGradient, animation: 'shimmer 1.5s infinite' }} />
                                </div>
                                <div className="h-2 bg-current/10 rounded-full w-2/3" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 bg-gradient-to-b from-transparent to-current/[0.03]">
                <div className="relative group">
                    <textarea autoFocus value={userMessage} onChange={(e) => setUserMessage(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}} placeholder="Ask me anything..." className="w-full p-4 pb-12 bg-current/5 rounded-2xl text-[14px] border border-transparent focus:border-purple-500/30 outline-none transition-all resize-none shadow-inner" rows={2} />
                    <button onClick={handleSendMessage} disabled={isTyping || !userMessage.trim()} className="absolute bottom-3 right-3 p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-30" style={{ background: accentGradient, color: 'white' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                </div>
            </div>

            <style jsx global>{`
                @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default AiChatBubble;