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