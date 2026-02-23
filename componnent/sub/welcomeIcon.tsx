import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/themeProvider"; // افترضت أنك تستخدم نفس الـ Context

export default function WelcomeOverlay({ title = "Welcome Back!", subtitle = "We're glad to see you again." }) {
  const { colors } = useTheme();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[12px]">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[480px] overflow-hidden rounded-[40px] border border-white/40 bg-white/70 p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)]"
      >
        {/* تأثير الضوء المتحرك في الخلفية (Blurry Blob) */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0] 
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute -top-24 -right-24 h-64 w-64 rounded-full blur-[80px]"
          style={{ backgroundColor: `${colors.dark[100]}15` }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* أيقونة Checkmark بسيطة وأنيقة */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8 flex h-20 w-20 items-center justify-center rounded-full shadow-inner"
            style={{ backgroundColor: colors.dark[100] }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </motion.div>

          {/* نصوص الـ Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-3 text-4xl font-black tracking-[-1.5px]"
            style={{ color: colors.dark[100] }}
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-[280px] text-lg font-medium leading-relaxed"
            style={{ color: `${colors.dark[100]}70` }}
          >
            {subtitle}
          </motion.p>

          {/* مؤشر تحميل ناعم جداً في الأسفل (اختياري) */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ delay: 0.6, duration: 2 }}
            className="mt-10 h-[2px] rounded-full"
            style={{ backgroundColor: colors.dark[100], opacity: 0.2 }}
          />
        </div>
      </motion.div>
    </div>
  );
}