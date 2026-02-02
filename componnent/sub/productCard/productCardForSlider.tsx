import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { ProductType, PurchaseType } from '@/types'
import React, { CSSProperties, useEffect, useState } from 'react'
import SkeletonLoading from '../SkeletonLoading'
import { useRouter } from 'next/navigation'
import { useScreen } from '@/contexts/screenProvider'
import { useLoadingScreen } from '@/contexts/loadingScreen'
import { useClient } from '@/contexts/client'
import { useRegisterSection } from '@/contexts/registerSec'
import axios from 'axios'
import { backEndUrl } from '@/api'
import { useStatusBanner } from '@/contexts/StatusBanner'
import { handleLongText } from '@/lib'
import { useCartSide } from '@/contexts/cart'
import { useSocket } from '@/contexts/soket'

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
    const socket = useSocket();

    const isInCart = purchases.some(pur =>
        // @ts-ignore
        (typeof pur?.product === 'string' ? pur.product === product._id : pur?.product?._id === product._id) && 
        pur?.status === 'inCart'
    );

    const handleLike = async () => {
        if (!product || !client || like == null) return;

        if (!like) {
          await axios.post( backEndUrl + "/addLike", {
            likeData: {
              client: client?._id,
              product: product._id
            }
          })
          .then(({ data }) => {setLike(true)})
          .catch((err) => {
            console.log(err);
            setStatusBanner(true, "something went wrong !");
          })
        } else {
          await axios.delete( backEndUrl + "/deleteLike", {
            data: {
              clientId: client?._id,
              productId: product._id
            }
          })
          .then(({ data }) => {setLike(false)})
          .catch((err) => {
            setStatusBanner(true, "something went wrong !");
          })
        }
    }

    useEffect(() => {
        if (!client?._id || (product._id?.length || 0) < 4) return;

        const fetchLike = async () => {
          await axios.get( backEndUrl + "/getLikeByClientAndProduct", {
              params: {
                clientId: client._id, 
                productId: product._id
              }
          })
          .then(({ data }) => {
              setLike(data.like ?  true : false);
          })
          .catch( err => {
              console.error({err})
          })
        }
        fetchLike();
    }, [client?._id, product._id])

    const handlePuttingInCart = async () => {
        if (!client) {
            setRegisterSectionExist(true);
            return false;
        }

        if (!socket || !cart) return false;

        let purchase = null as unknown as PurchaseType

        await axios.get(`${backEndUrl}/getPurchaseByClientAndProduct`, { 
            params: { 
                productId: product._id,
                clientId: client._id 
            } 
        })
        .then(({ data }) => purchase = data.purchase);

        if (!purchase) {
            const purchaseData = {
                product: product._id,
                specification: product.specifications[0],
                quantity: 1
            }
            await axios.post(`${backEndUrl}/addPurchase`, {purchaseData, clientId: client._id})
                .then(({ data }) => purchase = data.newPurchase);
        }

        if (purchase?.cart) {
            socket.emit("update_purchase", {
                ...purchase, 
                cart: null,
                status: 'viewed'
            });
        } else {
            socket.emit("update_purchase", {
                ...purchase, 
                cart: cart?._id,
                status: 'inCart'
            });
        }

        return true;
    };

  return (
    <div 
        className={`h-[500px]- flex relative flex-col bg-red-500- items-center gap-2 p-2- rounded-xl overflow-hidden cursor-pointer pb-2 px-2- ${className}`}
        style={{
            ...style,
            color: colors.dark[200],
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
            className={`absolute top-1 right-2 rounded-full p-[5px] ${like ? "bg-red-500" : "bg-gray-400 opacity-75"} transition-transform active:scale-75 w-8 h-8 z-2 cursor-pointer`}
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
                src={activeTheme == "dark" ? "/icons/heart-white.png" : "/icons/heart-white.png"} 
                className='w-full h-full'
                alt="" 
            />
        </div>}
        
        <div 
            className='w-full sm:w-full h-[200px] sm:h-[200px] rounded-xl overflow-hidden px-2-'
            style={{
                backgroundColor: colors.light[300]
            }}
        >
            {
                product.thumbNail ? <img 
                    src={product.thumbNail}
                    className='w-full h-full rounded-xl overflow-hidden hover:scale-110 duration-300'
                    alt=""
                /> :
                product.thumbNail == null ?
                    <SkeletonLoading/> :
                null
            }
        </div>

        <h4 
            className={`w-full rounded-xl overflow-hidden ${product.name[activeLanguage.language] == null && "h-5"} text-[14px] sm:text-[16px] text-center px-2`}
            style={{
                color: colors.dark[200]
            }}
        >
            {
                product.name[activeLanguage.language] != null ?
                    handleLongText(product.name[activeLanguage.language] + "", 15)
                : <SkeletonLoading/>
            }
        </h4>

        <span 
            className={`min-w-[50%] ${product.price == null && "h-5"} rounded-xl overflow-hidden min-h-5 text-[17px] sm:text-lg font-bold text-center`}
            style={{
                color: colors.dark[100]
            }}
        >
            {
                product.price != null ?
                    product.price + " D.T"
                : <SkeletonLoading/>
            }
        </span>

        <div className="w-full flex flex-row justify-between items-center gap-2 pt-2 border-t border-gray-50 px-1 sm:p-2-">
            <div 
                className={`flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-2 rounded-lg active:scale-95 transition-all cursor-pointer ${isInCart ? 'bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-100'}`}
                onClick={ async (e) => {
                    e.stopPropagation();
                    if (!product || (product._id?.length || 0) < 3) return;

                    if (isInCart) {
                        setPurchases(purchases.filter(pur => 
                            // @ts-ignore
                            (typeof pur?.product === 'string' ? pur.product !== product._id : pur?.product?._id !== product._id)
                        ));
                    }
                    
                    await handlePuttingInCart();
                }}
            >
                {!isInCart && <img 
                    src={isInCart 
                        ? (activeTheme === "dark" ? "/icons/shopping-bag-white.png" : "/icons/shopping-bag-black.png")
                        : (activeTheme === "dark" ? "/icons/shopping-bag-white.png" : "/icons/shopping-bag-black.png")
                    }
                    className={`w-3.5 h-3.5 ${isInCart ? 'opacity-100' : 'opacity-70'}`}
                    alt="Cart" 
                />}
                <span className={`text-[10px] sm:text-[11px] font-medium uppercase ${isInCart ? 'text-green-600' : 'text-gray-600'}`}>
                    {isInCart ? "In Cart" : "Panier"}
                </span>
            </div>

            <div
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-2 rounded-lg shadow-sm active:scale-95 transition-all cursor-pointer"
                style={{
                    backgroundColor: colors.dark[200],
                    color: colors.light[200]
                }}
            >
                <span className="text-[10px] sm:text-xs font-bold uppercase">Acheter</span>
                <img 
                    src={activeTheme === "dark" ? "/icons/right-arrow-black.png" : "/icons/right-arrow-white.png"}
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                    alt="Buy" 
                />
            </div>
        </div>
    </div>
  )
}

export default ProductCard;