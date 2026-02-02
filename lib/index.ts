import { EvaluationType, OrderType, ProductImage, ProductSpecification, ProductType, PurchaseType } from "@/types";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const handleShareOnFacebook = (shareUrl: string) => {
    console.log({shareUrl});
    
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    "_blank",
    "noopener,noreferrer,width=600,height=400")
    
};

export const handleShareOnInstagram = (shareUrl: string) => {
    console.log({shareUrl});
    
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  window.open(facebookShareUrl, "_blank", "noopener,noreferrer");
};

export function timeAgo(date: string | number | Date, activeLanguage: "en" | "fr"): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = (now.getTime() - past.getTime()) / 1000;

  const i18n = {
    en: {
      justNow: "just now",
      min: "min ago",
      hour: "h ago",
      day: "days ago",
      week: "weeks ago",
      month: "months ago",
      year: "years ago"
    },
    fr: {
      justNow: "à l'instant",
      min: "min",
      hour: "h",
      day: "jours",
      week: "semaines",
      month: "mois",
      year: "ans"
    }
  };

  console.log(date);
  

  const lang = i18n[activeLanguage];
  const prefix = activeLanguage === "fr" ? "il y a " : "";

  if (diffInSeconds < 60) return lang.justNow;

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${prefix}${minutes} ${lang.min}`;

  const hours = Math.floor(diffInSeconds / 3600);
  if (hours < 24) return `${prefix}${hours}${lang.hour}`;

  const days = Math.floor(diffInSeconds / 86400);
  if (days < 7) return `${prefix}${days} ${lang.day}`;

  const weeks = Math.floor(diffInSeconds / 604800);
  if (weeks < 4) return `${prefix}${weeks} ${lang.week}`;

  const months = Math.floor(diffInSeconds / 2592000);
  if (months < 12) return `${prefix}${months} ${lang.month}`;

  const years = Math.floor(diffInSeconds / 31536000);
  return `${prefix}${years} ${lang.year}`;
}

export const showTimeWithTranslate = (date: Date | string, activeLanguage: "en" | "fr") => {
    const d = new Date(date);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false    
    };

    const locale = activeLanguage === "en" ? "en-US" : "fr-FR";

    return d.toLocaleString(locale, options);
};

export const calcTotalPrice = (order: OrderType) => {
    let totalPrice = 0;

    if (!order.purchases) return totalPrice.toFixed(2);
    order.purchases.map((purchase) => {

        //@ts-ignore
        if (!purchase.specification?.price || !purchase.quantity) return;
        //@ts-ignore
        totalPrice = totalPrice + (purchase.specification.price * purchase.quantity);
    })

    return totalPrice.toFixed(2)
}

export const calculPurshaseTotalPrice = (purchases: PurchaseType[]) => {
    //@ts-ignore
    const total =purchases.reduce((total, purchase) => total + (purchase.specification?.price * purchase.quantity), 0);
    return total.toFixed(2);
  }

export const isValidEmail = (email: string): boolean => {

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email) return false;
    
    const trimmedEmail = email.trim();

    return (
        emailRegex.test(trimmedEmail) && 
        !trimmedEmail.includes(" ") &&
        trimmedEmail.length >= 6
    );
};

export const isValidPhone = (phone: string | number): boolean => {
    const phoneStr = phone?.toString().replace(/\s/g, "");
    return /^\d{8}$/.test(phoneStr);
};

export const handleLongText = (text: string, limitLength: number): string => {
  if (!text) return "";
  
  if (text.length <= limitLength) {
    return text;
  }

  return text.substring(0, limitLength).trim() + "...";
};

export const calculateRatingStats = (evaluations: EvaluationType[]) => {
    if (!evaluations || evaluations.length === 0) {
        return {
            average: 0,
            total: 0
        };
    }

    const sum = evaluations.reduce((acc, curr) => {
        return acc + (curr.number || 0);
    }, 0);

    const rawAverage = parseFloat((sum / evaluations.length).toFixed(1));
    const average = Math.round(rawAverage * 2) / 2;

    return {
        average: average,
        total: evaluations.length
    };
};

export const getUniqueColorsFomSpecification = (specs: any[]) => {
  if (!specs || !Array.isArray(specs)) return [];

  // نستخدم Map لضمان التفرد بناءً على اسم اللون
  const uniqueColorsMap = new Map();

  specs.forEach((spec) => {
    if (spec.color && spec.color.name && spec.color.hex) {
      // نستخدم اسم اللون كمفتاح (Key) لضمان عدم التكرار
      uniqueColorsMap.set(spec.color.name, {
        name: spec.color.name,
        hex: spec.color.hex,
      });
    }
  });

  // تحويل الـ Map مرة أخرى إلى مصفوفة
  return Array.from(uniqueColorsMap.values());
};

export const getProductUniqueColors = (images: ProductType['images']): string[] => {
  // التأكد من أن المصفوفة موجودة وليست فارغة
  if (!images || !Array.isArray(images)) return [];

  const hexSet = new Set<string>();

  images.forEach((img) => {
    // بما أن specification كائن (Object)، نصل للون مباشرة بدون forEach
    const hex = img.specification?.colorHex;
    
    if (hex) {
      hexSet.add(hex);
    }
  });

  return Array.from(hexSet);
};

export const getUniqueImagesByColor = (images: ProductImage[]) => {
    if (!images || !Array.isArray(images)) return [];

    const seenHex = new Set<string>();
    let hasGeneralImage = false; // لمتابعة الصور التي ليس لها لون
    
    return images.filter((img) => {
        const spec = img.specification as ProductSpecification;
        const hex = spec?.colorHex;

        if (hex) {
            // إذا كان اللون موجوداً مسبقاً، نحذفه
            if (seenHex.has(hex)) return false;
            
            seenHex.add(hex);
            return true;
        }

        // التعامل مع الصور العامة (التي لا تملك لون)
        // إذا أردت السماح بصورة واحدة فقط بدون لون:
        if (!hasGeneralImage) {
            hasGeneralImage = true;
            return true;
        }

        return false; // أي صورة عامة إضافية سيتم حذفها
    });
};

export const getDeviceId = async () => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
  // setDeviceId(result.visitorId)
  console.log({deviceId: result.visitorId});
  
};