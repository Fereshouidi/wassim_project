"use client";
import { useLanguage } from "@/contexts/languageContext";
import { useTheme } from "@/contexts/themeProvider";
import { useState } from "react";

export default function OrderNowButton({ onOrder }: { onOrder: () => Promise<void> }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const { activeTheme } = useTheme();
  const { activeLanguage } = useLanguage();

  const handleOrder = async () => {
    if (status !== "idle") return;
    
    setStatus("loading");
    
    // محاكاة وقت المعالجة أو انتظار البروميس الفعلي
    const orderPromise = onOrder();
    
    // ننتظر قليلاً ليرى المستخدم أنميشن التحميل
    await Promise.all([orderPromise, new Promise(res => setTimeout(res, 1500))]);
    
    setStatus("success");

    // العودة للحالة العادية بعد 3 ثوانٍ (اختياري)
    setTimeout(() => setStatus("idle"), 3000);
  };

  const isDark = activeTheme === "dark";
  const mainColor = isDark ? "white" : "black";
  const contrastColor = isDark ? "black" : "white";

  return (
    <button
      onClick={handleOrder}
      disabled={status === "loading"}
      className="flex flex-1 min-w-fit px-4 justify-center items-center w-12 h-12 text-sm sm:text-md rounded-xl cursor-pointer"
      style={{
        backgroundColor: status === "success" ? "#000" : mainColor,
        color: status === "success" ? "#fff" : contrastColor,
      }}
    >
      {status === "loading" && (
        <div 
          className="absolute inset-0 bg-black/20 dark:bg-white/20 origin-left animate-progress"
          style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.3)" }}
        />
      )}

      <div className="relative z-10 flex items-center gap-2 font-bold uppercase text-xs sm:text-sm tracking-widest">
        {status === "idle" && (
          <span className="flex items-center gap-2 animate-fadeIn">
            {activeLanguage?.orderNow || "Order Now"}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        )}

        {status === "loading" && (
          <span className="flex items-center gap-2 animate-pulse">
            Processing...
          </span>
        )}

        {status === "success" && (
          <span className="flex items-center gap-2 animate-bounceIn">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            Done
          </span>
        )}
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-progress { animation: progress 1.5s ease-in-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-bounceIn { animation: bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
      `}</style>
    </button>
  );
}