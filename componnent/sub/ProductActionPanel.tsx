import React, { useEffect } from 'react'
import ChoseQuantity from './choseQuantity'
import { CartType, ProductSpecification, ProductType, PurchaseType } from '@/types'
import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { useScreen } from '@/contexts/screenProvider'
import { useClient } from '@/contexts/client'
import { useRegisterSection } from '@/contexts/registerSec'
import { useLoadingScreen } from '@/contexts/loadingScreen'
import { useSocket } from '@/contexts/soket'
import AddToCartAnimation from './addToCartAnimation'

type Props = {
    quantity: number,
    setQuantity: (value: number) => void
    activeSpecifications: ProductSpecification | undefined | null
    purchase: PurchaseType
    setPurchase: (value: PurchaseType) => void
    cart: CartType
    product: ProductType
}

const ProductActionPanel = ({
    quantity,
    setQuantity,
    activeSpecifications,
    purchase,
    setPurchase,
    cart,
    product
}: Props) => {

    const socket = useSocket();
    const { screenWidth } = useScreen();
    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const { client } = useClient();
    const { setRegisterSectionExist } = useRegisterSection();
    const { loadingScreen, setLoadingScreen } = useLoadingScreen();

const handlePuttingInCart = () => {
    if (!client) {
        setRegisterSectionExist(true);
        return false;
    }

    if (!socket) return false;

    if (purchase.cart) {
        socket.emit("update_purchase", {
            ...purchase, 
            cart: null,
            status: 'viewed'
        });
    } else {
        socket.emit("update_purchase", {
            ...purchase, 
            cart: cart._id,
            status: 'inCart'
        });
    }

    return true;
};

    useEffect(() => {
        socket.on('receive_update_purchase_result', async (data: {message: string, purchase: PurchaseType}) => {
            data.purchase && setPurchase(data.purchase);
            setLoadingScreen(false);
        })
        return () => {
            socket.off('receive_update_purchase_result');
        }
    }, [])

  return (

        <div 
            className='flex flex-row my-5- mx-2 gap-4'
        >

            <ChoseQuantity
                quantity={quantity}
                setQuantity={setQuantity}
                max={activeSpecifications?.quantity?? 1}
            />
{/* 
            <button 
                className='flex flex-1 min-w-fit px-4 justify-center items-center w-12 h-12 text-sm sm:text-md rounded-sm cursor-pointer'
                style={{
                    backgroundColor: purchase.cart ? "transparent" : colors.dark[100],
                    border: purchase.cart ? `1px solid ${colors.dark[100]}` : "none",
                    color: purchase.cart ? colors.dark[200] : colors.light[200]
                }}
                onClick={handlePuttingInCart}
            >
                {!purchase.cart && <img 
                    src= {activeTheme == "dark" ? "/icons/add-to-cart-black.png"  : "/icons/add-to-cart-white.png" }
                    className='w-6 h-6 mr-5'
                    alt="" 
                />}

                {
                    purchase.cart ? 
                       activeLanguage.inCart
                    :  activeLanguage.addToCart
                }
                
            </button> */}

            {product?.thumbNail && (
                <AddToCartAnimation
                    productImage={product.thumbNail}
                    isInCart={!!purchase?.cart}
                    onToggle={async () => {
                        const result = handlePuttingInCart();
                        return !!result;
                    }}
                />
            )}


        </div>
  )
}

export default ProductActionPanel
