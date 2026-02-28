"use client";

import React, { CSSProperties, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Framer Motion
import { motion } from 'framer-motion';
import { slideInFromBottom, fadeInUp } from '@/lib/motion';

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
    const { purchases, setPurchases, cart } = useCartSide();

    // --- States ---
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [like, setLike] = useState<boolean | null>(null);
    const [activeSpecifications, setActiveSpecifications] = useState<ProductSpecification | null>(null);

    // --- UseMemo ---
    const isInCart = useMemo(() => {
        return purchases.some(pur =>
            //@ts-ignore
            (typeof pur?.product === 'string' ? pur.product === product._id : pur?.product?._id === product._id) &&
            pur?.status === 'inCart'
        );
    }, [purchases, product._id]);

    // --- Effects ---
    useEffect(() => {
        if (product.thumbNail) setCurrentImage(product.thumbNail);
        else if (product.images?.[0]) setCurrentImage(product.images[0].uri || null);

        // We specifically DO NOT set a default active specification here 
        // to show the base product price until a user interacts with colors.
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

    // --- Handlers ---
    const handleColorChange = (hex: string | null) => {
        if (!hex) {
            setCurrentImage(product.thumbNail || product.images?.[0]?.uri || null);
            setActiveSpecifications(null);
            return;
        }

        // تحديث الصورة
        const targetImage = product.images?.find(img =>
            (img.specification as ProductSpecification)?.colorHex === hex
        );
        if (targetImage?.uri) setCurrentImage(targetImage.uri);

        // تحديث المواصفة النشطة لتتوافق مع اللون المختار
        const targetSpec = product.specifications?.find(s => s.colorHex === hex);
        if (targetSpec) setActiveSpecifications(targetSpec);
    };

    const handleCartToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!product?._id || !client?._id) {
            setRegisterSectionExist(true);
            return;
        }

        // استخدام المواصفة المختارة أو الافتراضية
        const selectedSpec = activeSpecifications || product.specifications?.[0];
        if (!selectedSpec) return;

        const previousPurchases = [...purchases];
        const tempId = `temp-${Date.now()}`;

        try {
            if (isInCart) {
                const purchaseToRemove = purchases.find(pur =>
                    //@ts-ignore
                    (typeof pur.product === 'string' ? pur.product === product._id : pur.product?._id === product._id)
                );

                if (purchaseToRemove) {
                    setPurchases(prev => prev.filter(p => p._id !== purchaseToRemove._id));
                    await axios.put(`${backEndUrl}/updatePurchase`, {
                        ...purchaseToRemove,
                        cart: null,
                        status: 'viewed'
                    });
                }
            } else {
                // إضافة تفاؤلية
                const optimisticPurchase = {
                    _id: tempId,
                    product: product,
                    specification: selectedSpec,
                    quantity: 1,
                    status: 'inCart'
                } as unknown as PurchaseType;

                setPurchases(prev => [...prev, optimisticPurchase]);

                const { data: getRes } = await axios.get(`${backEndUrl}/getPurchaseByClientAndProduct`, {
                    params: { productId: product._id, clientId: client._id }
                });

                const targetPurchase = getRes.purchase;

                const { data: updateRes } = await axios.put(`${backEndUrl}/updatePurchase`, {
                    ...targetPurchase,
                    product: product._id,
                    client: client._id,
                    cart: cart?._id,
                    status: 'inCart',
                    specification: selectedSpec._id || selectedSpec
                });

                if (updateRes.success) {
                    setPurchases(prev => {
                        const filtered = prev.filter(p =>
                            p._id !== tempId &&
                            //@ts-ignore
                            (typeof p.product === 'string' ? p.product !== product._id : p.product?._id !== product._id)
                        );
                        return [...filtered, updateRes.purchase];
                    });
                }
            }
        } catch (error) {
            setPurchases(previousPurchases);
            console.error("Cart Toggle Error:", error);
        }
    };


    const handleLike = async () => {
        if (!product || !client || like == null) return;

        if (!like) {
            await axios.post(backEndUrl + "/addLike", {
                likeData: {
                    client: client?._id,
                    product: product._id
                }
            })
                .then(() => { setLike(true) })
                .catch((err) => {
                    console.log(err);
                    setStatusBanner(true, "something went wrong !");
                })
        } else {
            await axios.delete(backEndUrl + "/deleteLike", {
                data: {
                    clientId: client?._id,
                    productId: product._id
                }
            })
                .then(() => { setLike(false) })
                .catch(() => {
                    setStatusBanner(true, "something went wrong !");
                })
        }
    }

    const isMobile = screenWidth < 640;

    // --- Shared Render Parts ---
    const renderCardContent = (layout: 'mobile' | 'desktop') => {
        const isMob = layout === 'mobile';
        return (
            <>
                {useLike && <div
                    className={`absolute top-1 right-2 rounded-full p-[5px] ${like ? "bg-red-500" : "bg-gray-400 opacity-75"} transition-transform active:scale-75 w-8 h-8 z-[2] cursor-pointer`}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (client && product._id) {
                            setLike(!like);
                            handleLike()
                        } else {
                            setRegisterSectionExist(true)
                        }
                    }}
                >
                    <img
                        src="/icons/heart-white.png"
                        className='w-full h-full'
                        alt="like"
                    />
                </div>}
                <div className={`w-full overflow-hidden bg-gray-50 relative ${isMob ? 'aspect-square' : 'aspect-square'}`}>
                    {currentImage ? (
                        <img src={currentImage} className={`w-full h-full object-cover transition-all duration-500 ${!isMob && 'group-hover:scale-110'}`} alt="Product" />
                    ) : <SkeletonLoading />}
                </div>
                <div className="flex flex-col gap-1 px-2 pb-1">
                    <h4 className={`font-md text-center line-clamp-1 mt-2`} style={{ color: colors.dark[200], fontSize: isMob ? '14px' : '16px' }}>
                        {product.name[activeLanguage.language] ? handleLongText(product.name[activeLanguage.language]!, isMob ? 20 : 25) : "..."}
                    </h4>
                    <div className="text-center">
                        <span className={`font-semibold`} style={{ color: colors.dark[100], fontSize: isMob ? '16px' : '20px' }}>
                            {activeSpecifications?.price || product.price} DT
                        </span>
                    </div>
                </div>
                <div className="px-1" onClick={(e) => e.stopPropagation()}>
                    <SpecificationsSlider product={product.images} importedFrom="slider" onColorSelect={handleColorChange} />
                </div>
                <div className={`w-full flex ${isMob ? 'flex-col' : 'justify-between'} items-center gap-2 p-2 border-t border-gray-100`}>
                    <button
                        className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl transition-all cursor-pointer w-full ${isInCart ? 'bg-green-50' : 'hover:bg-gray-100'}`}
                        onClick={handleCartToggle}
                    >
                        {!isInCart && <img src={activeTheme === "dark" ? "/icons/shopping-bag-white.png" : "/icons/shopping-bag-black.png"} className="w-4 h-4 opacity-70" alt="Cart" />}
                        <span className={`text-[11px] font-bold uppercase tracking-tighter ${isInCart ? 'text-green-600' : ''}`}>
                            {isInCart ? "In Cart" : "Panier"}
                        </span>
                    </button>
                    <button className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl cursor-pointer w-full" style={{ backgroundColor: colors.dark[200], color: colors.light[200] }}>
                        <span className="text-[11px] font-bold uppercase tracking-tighter">Acheter</span>
                        <img src={activeTheme === "dark" ? "/icons/right-arrow-black.png" : "/icons/right-arrow-white.png"} className="w-3 h-3" alt="Buy" />
                    </button>
                </div>
            </>
        );
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            whileTap={{ scale: 0.98 }}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl transition-all duration-500 ${className} ${isMobile ? 'w-full h-[380px]' : 'w-full max-w-[320px] min-h-[400px]'}`}
            style={{
                ...style,
                backgroundColor: colors.light[100],
                color: colors.dark[200],
                boxShadow: activeTheme === 'dark' ? `0 10px 30px rgba(0,0,0,0.5)` : `0 10px 30px ${colors.light[400]}`,
            }}
            onClick={() => {
                if (!product?._id || product._id.length < 4) return;
                setLoadingScreen(true);
                router.push(`/product/${product._id}`);
            }}
        >
            {renderCardContent(isMobile ? 'mobile' : 'desktop')}
        </motion.div>
    );
};

export default ProductCard;