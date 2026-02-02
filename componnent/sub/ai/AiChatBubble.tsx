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
  const { bubbleProps, setBubbleProps } = useAiChatBubble();
  const { client } = useClient();
  const { setIsActive } = useCartSide();
  const { activeTheme, colors } = useTheme();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(null);

  const isDark = activeTheme === 'dark';
  const accentGradient = "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #ef4444)";

  const handleUiAction = useCallback((uiAction: any) => {
    if (!uiAction) return;
    if (uiAction.element === 'cart') setIsActive(uiAction.state === 'open');
  }, [setIsActive]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [bubbleProps.answer, isTyping]);

  useEffect(() => {
    if (bubbleProps.exist && position.x === 0) {
      setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
  }, [bubbleProps.exist, position.x]);

  const updatePosition = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    
    requestRef.current = requestAnimationFrame(() => {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y
      });
    });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    window.removeEventListener('mousemove', updatePosition);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isTyping) return;
    const currentMsg = userMessage;
    setUserMessage('');
    setIsTyping(true);

    try {
      setBubbleProps(prev => ({ ...prev, answer: '', isTherAnswer: true }));
      const { data } = await axios.post(`${backEndUrl}/getAnswerFromAi`, {
        userId: client?._id,
        message: currentMsg,
      });
      if (data.uiAction) handleUiAction(data.uiAction);
      setBubbleProps(prev => ({ ...prev, answer: data.answer }));
    } catch (err) {
      setBubbleProps(prev => ({ ...prev, answer: "Connection error." }));
    } finally {
      setIsTyping(false);
    }
  };

  if (!bubbleProps.exist) return null;

  return (
    <div
      style={{
        left: 0,
        top: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        backgroundColor: isDark ? '#000000' : '#ffffff',
        borderColor: isDark ? '#222' : '#eee',
        willChange: 'transform',
      }}
      className="fixed z-[9999] w-[90vw] md:w-[500px] flex flex-col rounded-xl overflow-hidden border shadow-2xl transition-[opacity,border-color] duration-300"
    >
      {/* Header */}
      <div 
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between px-5 py-4 cursor-move border-b border-current/5 select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-xl bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
            {ownerInfo?.name} AI
          </span>
        </div>
        <button onClick={() => setBubbleProps({...bubbleProps, exist: false})} className="w-10 h-7 p-3 opacity-40 hover:opacity-100 transition-opacity">
          <svg width="100%" height="100%" viewBox="0 0 20 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Message History Area */}
      <div ref={scrollRef} className="p-6 max-h-[40vh] overflow-y-auto custom-scrollbar bg-current/[0.01]">
        <div className={`prose prose-sm max-w-none text-[15px] leading-relaxed ${isDark ? 'text-white/90' : 'text-black/90'}`}>
          {isTyping && !bubbleProps.answer ? (
            <div className="space-y-3">
              <div className="h-2 bg-current/5 rounded-xl w-3/4 overflow-hidden relative">
                <div className="absolute inset-0 w-1/2" style={{ background: accentGradient, filter: 'blur(8px)', animation: 'shimmer 1.5s infinite' }} />
              </div>
              <div className="h-2 bg-current/5 rounded-xl w-1/2" />
            </div>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {bubbleProps?.answer || ""}
            </ReactMarkdown>
          )}
          {isTyping && bubbleProps.answer && (
            <span className="inline-block w-1 h-4 ml-1 bg-purple-500 animate-pulse" />
          )}
        </div>
      </div>

      {/* Persistent Input Section */}
      <div className="p-5 border-t border-current/5 bg-current/[0.02]">
        <div className="flex flex-col gap-3">
          <textarea 
            autoFocus
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
            placeholder="Type your message..."
            className="w-full p-4 bg-current/5 rounded-xl text-sm border-none outline-none focus:ring-1 focus:ring-purple-500/20 transition-all resize-none"
            rows={2}
          />
          <div className="flex justify-between items-center">
             <span className="text-[9px] opacity-20 font-bold uppercase tracking-widest">Press Enter to Send</span>
             <button 
                onClick={handleSendMessage}
                disabled={isTyping}
                className="relative px-8 py-2 rounded-xl overflow-hidden transition-all active:scale-95 group"
                style={{color: colors.light[200]}}
              >
                <div className="absolute inset-0 opacity-10 group-hover:opacity-100 transition-opacity" style={{ background: accentGradient }} />
                <div className="absolute inset-[1px] bg-white dark:bg-black rounded-xl" />
                <span className="relative z-10 text-[10px] font-black uppercase tracking-widest">
                  {isTyping ? "..." : "Send"}
                </span>
              </button>
          </div>
        </div>
      </div>

      <div className="h-[2px] w-full opacity-40" style={{ background: accentGradient }} />

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AiChatBubble;