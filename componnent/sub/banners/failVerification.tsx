import React from "react";
import { XCircle } from "lucide-react"; // Changed from CheckCircle
import { useTheme } from "@/contexts/themeProvider";
import { useLanguage } from "@/contexts/languageContext";

export default function InvalidToken() {

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
      <XCircle 
        className="w-16 h-16 mb-4" 
        style={{
            // You might want to use a specific error color here if your theme has one
            // e.g., color: colors.status.error or '#ef4444'
            backgroundColor: 'transparent', 
            color: colors.dark[200] 
        }}
    />

      <h1 className="text-2xl font-semibold mb-2">{activeLanguage.invalidVerificationToken}</h1>

      <p className="text-base opacity-80 mb-4">{activeLanguage.invalidVerificationTokenParagraph}</p>

    </div>
  );
}