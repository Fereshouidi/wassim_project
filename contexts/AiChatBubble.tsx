"use client";

import React, { createContext, ReactNode, useContext, useState, useCallback } from "react";

// 1. تعريف شكل الرسالة
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 2. تعريف شكل البيانات الأساسية للفقاعة
type AiChatBubbleProps = {
  exist: boolean;
  answer: string | null;
  textDirection: 'rtl' | 'ltr';
  isTherAnswer: boolean;
};

// 3. تعريف شكل الـ Context الكامل
type AiChatBubbleContextType = {
  bubbleProps: AiChatBubbleProps;
  setBubbleProps: React.Dispatch<React.SetStateAction<AiChatBubbleProps>>;
  history: Message[];
  setHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
};

const AiChatBubbleContext = createContext<AiChatBubbleContextType | undefined>(undefined);

export const AiChatBubbleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bubbleProps, setBubbleProps] = useState<AiChatBubbleProps>({
    exist: false,
    answer: "Hi, I'm your AI assistant. How can I help you? 🖐️",
    textDirection: 'ltr',
    isTherAnswer: false,
  });

  // مصفوفة التاريخ أصبحت هنا للتحكم بها من أي مكان
  const [history, setHistory] = useState<Message[]>([]);

  // دالة مساعدة لإضافة الرسائل بسرعة
  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    setHistory(prev => [...prev, { role, content }]);
  }, []);

  return (
    <AiChatBubbleContext.Provider value={{ 
      bubbleProps, 
      setBubbleProps, 
      history, 
      setHistory,
      addMessage 
    }}>
      {children}
    </AiChatBubbleContext.Provider>
  );
};

// 4. Custom hook
export const useAiChatBubble = (): AiChatBubbleContextType => {
  const context = useContext(AiChatBubbleContext);
  if (!context) {
    throw new Error("useAiChatBubble must be used within an AiChatBubbleProvider");
  }
  return context;
};