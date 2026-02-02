"use client";

import React, { CSSProperties, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Framer Motion
import { motion } from 'framer-motion';
// استيراد الـ variant الذي قمنا بإنشائه (تأكد من المسار الصحيح لملف الـ variants الخاص بك)
// إذا كنت تضعه في نفس الملف أو ملف خارجي، تأكد من وجود slideInFromBottom
import { slideInFromBottom } from '@/lib/motion';

// Contexts
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import { useScreen } from '@/contexts/screenProvider';
import { useLoadingScreen } from '@/contexts/loadingScreen';
import { useClient } from '@/contexts/client';
import { useRegisterSection } from '@/contexts/registerSec';
import { useStatusBanner } from '@/contexts/StatusBanner';
import { ProductType, ProductSpecification, PurchaseType } from '@/types';
import { backEndUrl } from '@/api';
import { handleLongText } from '@/lib';

// Components
import SkeletonLoading from '../SkeletonLoading';
import SpecificationsSlider from '../specificationsSlider';
import { useCartSide } from '@/contexts/cart';

type ProductCardType = {
    product: ProductType;
    className?: string;
    style?: CSSProperties;
    useLike?: boolean;
}

const ProductCard = ({ product, className, style, useLike }: ProductCardType) => {
    const { colors, activeTheme } = useTheme();
    const { activeLanguage } = useLanguage();
    const { screenWidth } = useScreen();
    const router = useRouter();
    const { setLoadingScreen } = useLoadingScreen();
    const { client } = useClient();
    const { setRegisterSectionExist } = useRegisterSection();
    const { setStatusBanner } = useStatusBanner();
    const { setIsActive, purchases, setPurchases } = useCartSide();

    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [like, setLike] = useState<boolean | null>(null);

    // التحقق من وجود المنتج في السلة
    const isInCart = useMemo(() => {
        return purchases.some(pur => 
            //@ts-ignore
            (typeof pur?.product === 'string' ? pur.product === product._id : pur?.product?._id === product._id) && 
            pur?.status === 'inCart'
        );
    }, [purchases, product._id]);

    useEffect(() => {
        if (product.thumbNail) setCurrentImage(product.thumbNail);
        else if (product.images?.[0]) setCurrentImage(product.images[0].uri || null);
    }, [product]);

    useEffect(() => {
        if (!client?._id || !product._id || product._id.length < 4) return;
        const fetchLike = async () => {
            try {
                const { data } = await axios.get(`${backEndUrl}/getLikeByClientAndProduct`, {
                    params: { clientId: client._id, productId: product._id }
                });
                setLike(!!data.like);
            } catch (err) { console.error(err); }
        };
        fetchLike();
    }, [client?._id, product._id]);

    const handleColorChange = (hex: string | null) => {
        if (!hex) {
            setCurrentImage(product.thumbNail || product.images?.[0]?.uri || null);
            return;
        }
        const targetImage = product.images?.find(img => 
            (img.specification as ProductSpecification)?.colorHex === hex
        );
        if (targetImage?.uri) setCurrentImage(targetImage.uri);
    };

    const handleCartToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!product?._id) return;

        if (isInCart) {
            // إزالة المنتج من القائمة المحلية (Optimistic Update)
            setPurchases(purchases.filter(pur => 
                //@ts-ignore
                (typeof pur?.product === 'string' ? pur.product !== product._id : pur?.product?._id !== product._id)
            ));
        } else {
            // إضافة المنتج (بافتراض أول مواصفة)
            const firstSpec = product.images?.[0]?.specification as ProductSpecification;
            setPurchases([
                ...purchases, 
                {
                    product: product,
                    specification: firstSpec,
                    quantity: 1,
                    status: 'inCart'
                } as unknown as PurchaseType
            ]);
        }
    };

    const isMobile = screenWidth < 640;

    if (isMobile) {
        return (
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideInFromBottom(0)}
                className={`group relative flex flex-col w-full h-[350px] mx-auto- justify-between overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-xl ${className}`}
                style={{
                    ...style,
                    backgroundColor: colors.light[100],
                    boxShadow: activeTheme === 'dark' ? `0 4px 15px rgba(0,0,0,0.3)` : `0 4px 15px ${colors.light[400]}`,
                }}
                onClick={() => {
                    if (!product?._id) return;
                    setLoadingScreen(true);
                    router.push(`/product/${product._id}`);
                }}
            >
                {useLike && (
                    <div className="absolute top-2 right-2 rounded-full p-1.5 transition-transform active:scale-75 z-20 shadow-md cursor-pointer"
                        style={{ backgroundColor: like ? "#ef4444" : "rgba(255, 255, 255, 0.9)" }}
                        onClick={(e) => e.stopPropagation()}>
                        <img src={like ? "/icons/heart-white.png" : "/icons/heart-black.png"} className="w-4 h-4 object-contain" alt="Like" />
                    </div>
                )}
                <div className="w-full h- aspect-[1/1] overflow-hidden bg-gray-50 relative">
                    {currentImage ? <img src={currentImage} className="w-full h-full object-cover" alt="Product" /> : <SkeletonLoading />}
                </div>
                <div className="flex flex-col gap-1 px-2 pb-1">
                    <h4 className="font-md text-[14px] text-center line-clamp-1- mt-2" style={{ color: colors.dark[200] }}>
                        {product.name[activeLanguage.language] ? handleLongText(product.name[activeLanguage.language]!, 20) : "..."}
                    </h4>
                    <div className="text-center">
                        <span className="text-[16px] font-semibold" style={{ color: colors.dark[100] }}>{product.price} DT</span>
                    </div>
                </div>
                <div className="px-1" onClick={(e) => e.stopPropagation()}>
                    <SpecificationsSlider product={product.images} importedFrom="slider" onColorSelect={handleColorChange} />
                </div>
                <div className="w-full flex flex-col gap-1.5 p-2 border-t border-gray-50">
                    <button 
                        className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl transition-all ${isInCart ? 'bg-green-50' : 'hover:bg-gray-100'}`}
                        onClick={handleCartToggle}
                    >
                        {!isInCart && <img src={activeTheme === "dark" ? "/icons/shopping-bag-white.png" : "/icons/shopping-bag-black.png"} className={`w-3.5 h-3.5 ${isInCart ? 'opacity-100' : 'opacity-70'}`} alt="Cart" />}
                        <span className={`text-[10px] font-bold uppercase ${isInCart ? 'text-green-600' : ''}`}>
                            {isInCart ? "In Cart" : "Panier"}
                        </span>
                    </button>
                    <button className="flex items-center justify-center gap-2 w-full py-2 rounded-xl" style={{ backgroundColor: colors.dark[200], color: colors.light[200] }}>
                        <span className="text-[10px] font-bold uppercase">Acheter</span>
                        <img src={activeTheme === "dark" ? "/icons/right-arrow-black.png" : "/icons/right-arrow-white.png"} className="w-2.5 h-2.5" alt="Buy" />
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInFromBottom(0.1)}
            className={`group relative flex flex-col w-full max-w-[320px] min-h-[300px] justify-between gap-2 overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl ${className}`}
            style={{
                ...style,
                backgroundColor: colors.light[100],
                color: colors.dark[200],
                boxShadow: activeTheme === 'dark' ? `0 10px 30px rgba(0,0,0,0.5)` : `0 10px 30px ${colors.light[400]}`,
            }}
            onClick={() => {
                if (!product?._id) return;
                setLoadingScreen(true);
                router.push(`/product/${product._id}`);
            }}
        >
            {useLike && (
                <div className="absolute top-4 right-4 rounded-full p-2 z-20 shadow-md cursor-pointer"
                    style={{ backgroundColor: like ? "#ef4444" : "rgba(255, 255, 255, 0.9)" }}
                    onClick={(e) => e.stopPropagation()}>
                    <img src={like ? "/icons/heart-white.png" : "/icons/heart-black.png"} className="w-5 h-5 object-contain" alt="Like" />
                </div>
            )}
            <div className="w-full aspect-square overflow-hidden bg-gray-50 relative">
                {currentImage ? <img src={currentImage} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt="Product" /> : <SkeletonLoading />}
            </div>
            <div className="flex h-fit flex-col gap-1 px-1">
                <h4 className="font-md text-[14px] sm:text-[16px] text-center line-clamp-1 mt-2" style={{ color: colors.dark[200] }}>
                    {product.name[activeLanguage.language] ? handleLongText(product.name[activeLanguage.language]!, 25) : "..."}
                </h4>
                <div className="text-center">
                    <span className="text-[18px] sm:text-[20px] font-semibold" style={{ color: colors.dark[100] }}>{product.price} DT</span>
                </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                <SpecificationsSlider product={product.images} importedFrom="slider" onColorSelect={handleColorChange} />
            </div>
            <div className="w-full flex justify-between items-center gap-2 mt-2 p-2 border-t border-gray-100 dark:border-gray-900-">
                {/* زر السلة - Desktop */}
                <div 
                    className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${isInCart ? 'bg-green-50' : 'hover:bg-gray-100'}`}
                    onClick={handleCartToggle}
                >
                    {!isInCart && <img src={activeTheme === "dark" ? "/icons/shopping-bag-white.png" : "/icons/shopping-bag-black.png"} className={`w-4 h-4 ${isInCart ? 'opacity-100' : 'opacity-70'}`} alt="Cart" />}
                    <span className={`text-[11px] font-bold uppercase tracking-tighter ${isInCart ? 'text-green-600' : ''}`}>
                        {isInCart ? "In Cart" : "Panier"}
                    </span>
                </div>
                <div className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl cursor-pointer" style={{ backgroundColor: colors.dark[200], color: colors.light[200] }}>
                    <span className="text-[11px] font-bold uppercase tracking-tighter">Acheter</span>
                    <img src={activeTheme === "dark" ? "/icons/right-arrow-black.png" : "/icons/right-arrow-white.png"} className="w-3 h-3" alt="Buy" />
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;