"use client";

import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { ProductType, PurchaseType } from '@/types'
import React, { CSSProperties, useEffect, useState } from 'react'
import SkeletonLoading from '../SkeletonLoading'
import { useRouter } from 'next/navigation'
import { useLoadingScreen } from '@/contexts/loadingScreen'
import { useClient } from '@/contexts/client'
import { useRegisterSection } from '@/contexts/registerSec'
import axios from 'axios'
import { backEndUrl } from '@/api'
import { useStatusBanner } from '@/contexts/StatusBanner'
import { handleLongText } from '@/lib'
import { useCartSide } from '@/contexts/cart'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion'

type productCardType = {
    product: ProductType
    className?: String
    style?: CSSProperties
    useLike?: boolean
}

const ProductCard = ({
    product,
    className,
    style,
    useLike
}: productCardType) => {

    const { colors, activeTheme } = useTheme();
    const { activeLanguage } = useLanguage();
    const router = useRouter();
    const { setLoadingScreen } = useLoadingScreen();
    const [like, setLike] = useState<boolean | null>(null);
    const { client } = useClient();
    const { setRegisterSectionExist } = useRegisterSection();
    const { setStatusBanner } = useStatusBanner();
    const { purchases, setPurchases, cart } = useCartSide();

    const isInCart = purchases.some(pur =>
        // @ts-ignore
        (typeof pur?.product === 'string' ? pur.product === product._id : pur?.product?._id === product._id) &&
        pur?.status === 'inCart'
    );

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

    useEffect(() => {
        if (!client?._id || (product._id?.length || 0) < 4) return;

        const fetchLike = async () => {
            await axios.get(backEndUrl + "/getLikeByClientAndProduct", {
                params: {
                    clientId: client._id,
                    productId: product._id
                }
            })
                .then(({ data }) => {
                    setLike(data.like ? true : false);
                })
                .catch(err => {
                    console.error({ err })
                })
        }
        fetchLike();
    }, [client?._id, product._id])

    const handlePuttingInCart = async () => {
        if (!client) {
            setRegisterSectionExist(true);
            return false;
        }

        if (!cart) return;

        const previousPurchases = [...purchases];
        const tempId = `temp-${Date.now()}`;

        try {
            if (isInCart) {
                // 1. العثور على العنصر المراد حذفه من السلة (محلياً)
                const purchaseToRemove = purchases.find(pur =>
                    //@ts-ignore
                    (typeof pur.product === 'string' ? pur.product === product._id : pur.product?._id === product._id) &&
                    pur.status === 'inCart'
                );

                if (purchaseToRemove) {
                    // تحديث محلي فوري (حذف)
                    setPurchases(prev => prev.filter(p => p._id !== purchaseToRemove._id));

                    // تحديث السيرفر
                    await axios.put(`${backEndUrl}/updatePurchase`, {
                        ...purchaseToRemove,
                        cart: null,
                        status: 'viewed'
                    });
                }
            } else {
                // 2. تحديث محلي فوري (إضافة)
                const optimisticPurchase = {
                    _id: tempId,
                    product: product,
                    specification: product.specifications?.[0],
                    quantity: 1,
                    status: 'inCart'
                } as unknown as PurchaseType;

                setPurchases(prev => [...prev, optimisticPurchase]);

                // جلب Purchase الموجود أو إنشاء واحد جديد
                const { data: getRes } = await axios.get(`${backEndUrl}/getPurchaseByClientAndProduct`, {
                    params: { productId: product._id, clientId: client._id }
                });

                let targetPurchase = getRes.purchase;

                if (!targetPurchase) {
                    const purchaseData = {
                        product: product._id,
                        specification: product.specifications?.[0],
                        quantity: 1,
                        client: client._id
                    };
                    const { data: addRes } = await axios.post(`${backEndUrl}/addPurchase`, { purchaseData, clientId: client._id });
                    targetPurchase = addRes.newPurchase;
                }

                if (!targetPurchase) throw new Error("Purchase action failed");

                // وضع المنتج في السلة
                const { data: updateRes } = await axios.put(`${backEndUrl}/updatePurchase`, {
                    ...targetPurchase,
                    cart: cart?._id,
                    status: 'inCart'
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
            return true;
        } catch (error) {
            console.error("Cart action failed:", error);
            setPurchases(previousPurchases);
            setStatusBanner(true, "Failed to update cart");
        }
        return false;
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            whileTap={{ scale: 0.98 }}
            className={`flex relative flex-col items-center justify-between gap-2 rounded-xl overflow-hidden cursor-pointer py-1 px-1 sm:py-2 sm:px-2 transition-all duration-300 ${className}`}
            style={{
                ...style,
                color: colors.dark[200],
                backgroundColor: colors.light[100],
                boxShadow: `0 0px 15px ${colors.light[300]}`,
            }}
            onClick={() => {
                if ((product?._id?.length || 0) < 3) return;
                setLoadingScreen(true);
                localStorage.removeItem('purchaseId');
                router.push(`/product/${product._id}`)
            }}
        >
            {useLike && <div
                className={`absolute top-1 right-1 sm:top-3 sm:right-3 rounded-full p-[5px] ${like ? "bg-red-500" : "bg-gray-400 opacity-75"} transition-transform active:scale-75 w-8 h-8 z-[2] cursor-pointer`}
                onClick={(e) => {
                    e.stopPropagation();
                    if (client) {
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

            <div
                className='w-full h-[150px] sm:h-[280px] pt-2- bg-red-500- rounded-xl overflow-hidden'
                style={{ backgroundColor: colors.light[300] }}
            >
                {
                    product.thumbNail ? <img
                        src={product.thumbNail}
                        className='w-full h-full rounded-2xl overflow-hidden hover:scale-110 duration-300 object-cover'
                        alt={product.name[activeLanguage.language] || ""}
                    /> : <SkeletonLoading />
                }
            </div>

            <h4 className={`w-full h-7 flex items-center justify-center rounded-xl overflow-hidden z-50 text-[14px] sm:text-[16px] text-center px-4 font-medium`}>
                {product.name?.[activeLanguage.language]
                    ? handleLongText(product.name[activeLanguage.language] + "", 15)
                    : <div className="w-28 h-4 opacity-50"><SkeletonLoading /></div>
                }
            </h4>

            <div className={`w-fit min-w-[90px] h-8 overflow-hidden rounded-xl flex flex-row items-center justify-center gap-2 px-2`}>
                {product.price != null ? (
                    <>
                        <span className={`font-bold text-center text-[17px] sm:text-lg`} style={{ color: colors.dark[100] }}>
                            {product.price} D.T
                        </span>
                        {product.oldPrice && product.oldPrice > (product.price || 0) && (
                            <span className="text-xs sm:text-sm line-through opacity-30 mt-0.5 text-center">
                                {product.oldPrice} DT
                            </span>
                        )}
                    </>
                ) : (
                    <div className="w-20 h-5 opacity-50"><SkeletonLoading /></div>
                )}
            </div>

            <div className="w-full flex flex-row justify-between items-center gap-2 pt-2 border-t border-gray-50 px-1 sm:px-2">
                <div
                    className={`flex items-center justify-center gap-2 w-full sm:w-auto px-1 py-2 rounded-lg active:scale-95 transition-all cursor-pointer ${isInCart ? 'bg-green-50' : 'hover:bg-gray-100'}`}
                    onClick={async (e) => {
                        e.stopPropagation();
                        if (!product || (product._id?.length || 0) < 3) return;
                        await handlePuttingInCart();
                    }}
                >
                    <img
                        src={activeTheme === "dark" || isInCart ? "/icons/shopping-bag-white.png" : "/icons/shopping-bag-black.png"}
                        className={`w-3.5 h-3.5 ${isInCart ? 'opacity-100' : 'opacity-70'}`}
                        style={{ filter: isInCart ? "invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)" : "none" }}
                        alt="Cart"
                    />
                    <span className={`text-[10px] sm:text-[11px] font-medium uppercase ${isInCart ? 'text-green-600' : 'text-gray-600'}`}>
                        {isInCart ? activeLanguage.inCart : activeLanguage.add}
                    </span>
                </div>

                <div
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-2 rounded-lg shadow-sm active:scale-95 transition-all cursor-pointer"
                    style={{ backgroundColor: colors.dark[200], color: colors.light[200] }}
                >
                    <span className="text-[10px] sm:text-xs font-bold uppercase">Acheter</span>
                    <img
                        src={activeTheme === "dark" ? "/icons/right-arrow-black.png" : "/icons/right-arrow-white.png"}
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                        alt="Buy"
                    />
                </div>
            </div>
        </motion.div>
    )
}

export default ProductCard;