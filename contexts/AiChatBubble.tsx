"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

// 1. تعريف شكل البيانات
type AiChatBubbleProps = {
  exist: boolean;
  answer: string | null;
  textDirection: 'rtl' | 'ltr';
  isTherAnswer: boolean;
  // أضفنا علامة الاستفهام ليكون تحديث الحالة أسهل لاحقاً
  setExist?: (value: boolean) => void;
  setIsTherAnswer?: (value: boolean) => void;
};

// 2. تعريف شكل الـ Context
type AiChatBubbleContextType = {
  bubbleProps: AiChatBubbleProps;
  setBubbleProps: React.Dispatch<React.SetStateAction<AiChatBubbleProps>>;
};

const AiChatBubbleContext = createContext<AiChatBubbleContextType | undefined>(undefined);

export const AiChatBubbleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // وضع قيم افتراضية كاملة لتجنب أخطاء الـ Typescript
  const [bubbleProps, setBubbleProps] = useState<AiChatBubbleProps>({
    exist: false,
    answer: "Hi i'm you ai assistance in silver way, how can i help you 🖐️",
    textDirection: 'ltr',
    isTherAnswer: false,
  });

  return (
    <AiChatBubbleContext.Provider value={{ bubbleProps, setBubbleProps }}>
      {children}
    </AiChatBubbleContext.Provider>
  );
};

// 3. Custom hook
export const useAiChatBubble = (): AiChatBubbleContextType => {
  const context = useContext(AiChatBubbleContext);
  if (!context) {
    throw new Error("useAiChatBubble must be used within an AiChatBubbleProvider");
  }
  return context;
};