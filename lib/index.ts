import { OrderType, PurchaseType } from "@/types";

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

export function timeAgo(date: string | number | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = (now.getTime() - past.getTime()) / 1000;

  if (diffInSeconds < 60) return "just now";

  const minutes = diffInSeconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)} min ago`;

  const hours = diffInSeconds / 3600;
  if (hours < 24) return `${Math.floor(hours)} h ago`;

  const days = diffInSeconds / 86400;
  if (days < 7) return `${Math.floor(days)} days ago`;

  const weeks = diffInSeconds / 604800;
  if (weeks < 4) return `${Math.floor(weeks)} weeks ago`;

  const months = diffInSeconds / 2592000;
  if (months < 12) return `${Math.floor(months)} months ago`;

  const years = diffInSeconds / 31536000;
  return `${Math.floor(years)} years ago`;
}

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
    const total =purchases.reduce((total, purchase) => total + (purchase.specification.price * purchase.quantity), 0);
    return total.toFixed(2);
  }

// export const socialMedia = [
//     {
//         id: '1',
//         icon: "/instagram.png",
//         link: "https://www.instagram.com/silver_wayshop?igsh=MXhwM3djanVmOXFtYg==",
//         label: "Instagram",
//         bachground: "bg-linear-to-l from-[rgb(245,7,205)] to-[rgba(210,237,6,0.63)]"
//     },
//     {
//         id: '2',
//         icon: "/facebook.png",
//         link: "https://www.facebook.com/share/17UjzhdToc/",
//         label: "Facebook",
//         bachground: "bg-blue-500"
//     },
//     {
//         id: '3',
//         icon: "/whatsapp.png",
//         link: "https://wa.me/message/T4PUSR6MRIYCK1",
//         label: "WhatsApp",
//         bachground: "bg-green-500"
//     },
//     {
//         id: '4',
//         icon: "/tiktok.png",
//         link: "https://www.tiktok.com/@silver.wayshop?_r=1&_t=ZM-91Av6lCb9Ds",
//         label: "TikTok",
//         bachground: "bg-black"
//     }
// ]