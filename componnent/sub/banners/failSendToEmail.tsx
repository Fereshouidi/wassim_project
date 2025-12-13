import React from "react";
import { AlertCircle } from "lucide-react"; 
import { useTheme } from "@/contexts/themeProvider";
import { useLanguage } from "@/contexts/languageContext";

export default function FailSendToEmail() {

    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();

  return (
    <div 
        className="w-full max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center"
        style={{
            backgroundColor: colors.light[100],
            color: colors.dark[200]
        }}
    >
      <AlertCircle 
        className="w-16 h-16 mb-4" 
        style={{
            backgroundColor: 'transparent',
            color: colors.dark[200] // Or use a specific error color like '#ef4444' if available
        }}
    />

      <h1 className="text-2xl font-semibold mb-2">{activeLanguage.FailedToSendEmail}</h1>

      <p className="text-base opacity-80 mb-4">{activeLanguage.FailedToSendEmailParagraph}</p>

    </div>
  );
}