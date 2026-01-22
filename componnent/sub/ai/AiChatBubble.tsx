'use client';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
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

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showInput, setShowInput] = useState(true); 
  const [userMessage, setUserMessage] = useState(''); 
  const { client } = useClient();
  const { isActive, setIsActive } = useCartSide();

  const { colors, activeTheme } = useTheme(); 
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const isDark = activeTheme === 'dark';

  // --- 1. UI Actions ---
  const handleUiAction = (uiAction: { element: string; state: string } | undefined) => {
    if (!uiAction) return;
    const { element, state } = uiAction;

    switch (element) {
      case 'cart':
        if (state === 'open') {
          setIsActive(true); 
        } else if (state === 'close') {
          setIsActive(false);
        }
        break;
      case 'textDirection':
        setBubbleProps({...bubbleProps, textDirection: state as 'rtl' | 'ltr'});
        break;
      default:
        console.warn(`Unknown UI element: ${element}`);
    }
  };

  // --- 2. Positioning ---
  useEffect(() => {
    if (typeof window !== 'undefined' && bubbleProps.exist) {
      setPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
    }
  }, [bubbleProps.exist]);

  // --- 3. Drag Logic ---
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // --- 4. Handle Send Message ---
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const currentMsg = userMessage;
    setUserMessage('');
    setShowInput(false);

    try {
      setBubbleProps(prev => ({ ...prev, answer: '...' }));

      const { data } = await axios.post(`${backEndUrl}/getAnswerFromAi`, {
        userId: client?._id,
        message: currentMsg,
        agent: null
      });

      if (data.uiAction) {
        handleUiAction(data.uiAction);
      }

      setBubbleProps(prev => ({
        ...prev,
        answer: data.answer, 
        isTherAnswer: true,
        exist: true
      }));

    } catch (err) {
      console.error("AI Request Error:", err);
      setBubbleProps(prev => ({
        ...prev,
        answer: "Sorry, there was a connection issue. Please try again."
      }));
    }
  };

  // --- 5. Dynamic Styling (Keeping your original colors) ---
  const mainBg = isDark ? (colors?.dark?.[100] || 'black') : (colors?.light?.[100] || 'white');
  const headerBg = isDark ? (colors?.dark?.[100] || '#111') : (colors?.light?.[100] || '#f9f9f9');
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'; 
  const textColor = isDark ? 'white' : 'black';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  const containerStyle: CSSProperties = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'translate(-50%, -50%)',
    direction: bubbleProps.textDirection,
    position: 'fixed',
    zIndex: 9999,
    backgroundColor: mainBg,
    color: textColor,
    borderColor: borderColor,
    boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.5)' : '0 20px 50px rgba(0,0,0,0.1)',
  };

  if (!bubbleProps.exist) return null;

  return (
    <div
      style={containerStyle}
      className="w-[90vw] md:w-[500px] lg:w-[600px] flex flex-col rounded-2xl overflow-hidden border backdrop-blur-md transition-opacity duration-200"
    >
      {/* --- HEADER --- */}
      <div 
        onMouseDown={handleMouseDown}
        style={{ backgroundColor: headerBg, borderBottom: `1px solid ${borderColor}` }}
        className="flex items-center justify-between px-4 py-3 cursor-move select-none"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden border border-white/10"
            style={{ backgroundColor: isDark ? 'black' : 'white' }}
          >
            <img 
              src={isDark ? '/logo-simple-black.jpg' : '/logo-simple-white.jpg'} 
              alt="AI"
              className="w-full h-full object-cover"
            />
          </div>
          <span style={{ color: textColor }} className="font-bold text-sm tracking-wide opacity-90">
            {" Silver Way AI"}
          </span>
        </div>

        <button 
          onClick={() => setBubbleProps({...bubbleProps, exist: false})}
          className="p-1.5 rounded-full transition-all duration-200 hover:opacity-70"
          style={{ color: textColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* --- BODY --- */}
      <div 
        className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar flex flex-col"
      >
        <div 
          className="text-base leading-7 mb-4 ai-chat-content select-all" 
          style={{ 
            color: textColor,
            direction: bubbleProps.textDirection,      
            textAlign: bubbleProps.textDirection === 'rtl' ? 'right' : 'left',    
          }}
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            components={{
              p: ({ node, ...props }) => (
                <p 
                  className="mb-3 last:mb-0" 
                  style={{ 
                    unicodeBidi: 'plaintext', 
                    textAlign: 'inherit' 
                  }} 
                  {...props} 
                />
              ),
              // --- Optimized Table Styling with inherited colors ---
              table: ({ node, ...props }) => (
                <div className="my-4 overflow-x-auto rounded-lg border border-current/10 shadow-sm">
                  <table className="w-full text-sm border-collapse" {...props} />
                </div>
              ),
              thead: ({ node, ...props }) => <thead style={{ backgroundColor: 'rgba(128,128,128,0.1)' }} {...props} />,
              th: ({ node, ...props }) => <th className="px-4 py-2 border-b border-current/10 text-start font-bold" {...props} />,
              td: ({ node, ...props }) => <td className="px-4 py-2 border-b border-current/5" {...props} />,
              
              ul: ({ node, ...props }) => <ul className={`list-disc mb-3 space-y-1 ${bubbleProps.textDirection === 'rtl' ? 'pr-6' : 'pl-6'}`} {...props} />,
              ol: ({ node, ...props }) => <ol className={`list-decimal mb-3 space-y-1 ${bubbleProps.textDirection === 'rtl' ? 'pr-6' : 'pl-6'}`} {...props} />,
              a: ({ node, ...props }) => <a className="underline opacity-80 hover:opacity-100" target="_blank" rel="noopener noreferrer" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
              code: ({ node, ...props }) => <code className="bg-current/10 px-1 rounded" style={{ direction: 'ltr', display: 'inline-block' }} {...props} />,
            }}
          >
            {bubbleProps?.answer || ""}
          </ReactMarkdown>
        </div>
        
        {/* --- USER INPUT SECTION --- */}
        <div className="mt-2 transition-all duration-300">
            {!showInput ? (
                <button 
                    onClick={() => setShowInput(true)}
                    className="flex items-center gap-2 text-xs opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: textColor }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>{bubbleProps.textDirection === 'rtl' ? 'متابعة الحديث...' : 'Reply / Follow up...'}</span>
                </button>
            ) : (
                <div className="flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-200">
                    <textarea 
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                        placeholder={bubbleProps.textDirection === 'rtl' ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                        className="w-full p-3 rounded-lg text-sm resize-none focus:outline-none"
                        rows={2}
                        style={{ 
                            backgroundColor: inputBg, 
                            color: textColor,
                            border: `1px solid ${borderColor}`
                        }}
                    />
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => setShowInput(false)}
                            className="text-xs px-3 py-1.5 opacity-60 hover:opacity-100"
                            style={{ color: textColor }}
                        >
                            {bubbleProps.textDirection === 'rtl' ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button 
                            onClick={handleSendMessage}
                            className="text-xs px-4 py-1.5 rounded-md font-medium hover:opacity-80 active:scale-95 transition-all"
                            style={{ 
                                backgroundColor: isDark ? 'white' : 'black', 
                                color: isDark ? 'black' : 'white' 
                            }}
                        >
                            {bubbleProps.textDirection === 'rtl' ? 'إرسال' : 'Send'}
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* --- FOOTER --- */}
        <div 
            className="mt-4 pt-3 flex justify-between text-[10px] uppercase tracking-wider opacity-40"
            style={{ borderTop: `1px solid ${borderColor}`, color: textColor }}
        >
            <span>{ownerInfo?.name + " AI assistance"}</span>
            <span>Generated Content</span>
        </div>
      </div>
    </div>
  );
};

export default AiChatBubble;