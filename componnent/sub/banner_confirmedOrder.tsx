import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/languageContext";

export default function OrderConfirmedBanner({ 
    show = false, 
    onClose = null,
}) {

  const [visible, setVisible] = useState(show);
  const { activeLanguage } = useLanguage();

  useEffect(() => {
    if (show) {
      setVisible(true);

      // auto hide after 3 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        // if (onClose) onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <div
      className={`
        max-w-[90%] w-fit min-w-[300px]
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        flex items-start gap-3 px-3 py-2 sm:px-6 sm:py-4
        bg-green-600 text-white rounded-xl shadow-xl
        backdrop-blur-md border border-green-400/50

        transition-all duration-500 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}
      `}
    >
      <CheckCircle className="w-6 h-6 text-white" />

      <p className="font-semibold text-[12px] sm:text-lg">{activeLanguage.confirmedOrder}</p>
    </div>
  );
}
