import { useLanguage } from "@/contexts/languageContext";
import { useScreen } from "@/contexts/screenProvider";
import { useTheme } from "@/contexts/themeProvider";
import { useRef, useState } from "react";

type Props = {
  productImage: string;
  isInCart: boolean;
  onToggle: () => Promise<boolean>; 
};

export default function AddToCartAnimation({ productImage, isInCart, onToggle }: Props) {

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { screenWidth } = useScreen();
  const { colors, activeTheme } = useTheme();
  const { activeLanguage } = useLanguage();

  const handleAction = async () => {
    if (isLoading) return;
    const button = buttonRef.current;
    const cart = document.getElementById("cart-icon");

    if (!button) return;
    setIsLoading(true);

    const buttonRect = button.getBoundingClientRect();
    const cartRect = cart 
      ? cart.getBoundingClientRect() 
      : { left: window.innerWidth - (screenWidth > 1000 ? 80 : 50), top: 50, width: 30, height: 30 };

    const cartX = cartRect.left + (cartRect.width / 2);
    const cartY = cartRect.top + (cartRect.height / 2);

    const clone = document.createElement("img");
    clone.src = productImage;
    Object.assign(clone.style, {
      position: "fixed",
      zIndex: "9999",
      objectFit: "cover",
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(0.2, 1, 0.2, 1)",
    });

    if (isInCart) {
      Object.assign(clone.style, {
        left: `${cartX}px`,
        top: `${cartY}px`,
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        opacity: "0.2",
      });
    } else {
      Object.assign(clone.style, {
        left: `${buttonRect.left}px`,
        top: `${buttonRect.top}px`,
        width: `${buttonRect.width}px`,
        height: `${buttonRect.height}px`,
        borderRadius: "8px",
        opacity: "0.5",
      });
    }

    document.body.appendChild(clone);
    clone.getBoundingClientRect(); // Force Reflow

    requestAnimationFrame(() => {
      if (isInCart) {
        clone.style.left = `${buttonRect.left}px`;
        clone.style.top = `${buttonRect.top}px`;
        clone.style.width = `${buttonRect.width}px`;
        clone.style.height = `${buttonRect.height}px`;
        clone.style.borderRadius = "8px";
        clone.style.opacity = "0.5";
      } else {
        clone.style.left = `${cartX}px`;
        clone.style.top = `${cartY}px`;
        clone.style.width = "20px";
        clone.style.height = "20px";
        clone.style.borderRadius = "50%";
        clone.style.opacity = "0.5";
      }
    });

    await new Promise((r) => setTimeout(r, 800));

    const success = await onToggle();

    if (!success) {
    }

    clone.remove();
    setIsLoading(false);
  };

  return (
    <button
        ref={buttonRef}
        onClick={handleAction}
        disabled={isLoading}
        className={`flex flex-1 min-w-fit px-4 justify-center items-center w-12 h-12 text-sm sm:text-md rounded-xl cursor-pointer`}
        style={{
            backgroundColor: isInCart ? "transparent" : colors.dark[100],
            border: isInCart ? `1px solid ${colors.dark[100]}` : "none",
            color: isInCart ? colors.dark[200] : colors.light[200]
        }}
    >

        {!isInCart && <img 
            src= {activeTheme == "dark" ? "/icons/add-to-cart-black.png"  : "/icons/add-to-cart-white.png" }
            className='w-6 h-6 mr-5'
            alt="" 
        />}

        {
            isInCart ? 
                activeLanguage.inCart
            :  activeLanguage.addToCart
        }


        <img
            src={productImage}
            alt="product"
            className="w-0 h-0 rounded-full object-cover border border-white/20 duration-300"
            style={{
                visibility: "hidden"
            }}
        />

    </button>
  );
}