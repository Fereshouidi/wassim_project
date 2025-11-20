import React from 'react'
import ChoseQuantity from './choseQuantity'
import { CartType, ProductSpecification, PurchaseType } from '@/types'
import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { useScreen } from '@/contexts/screenProvider'
import { useClient } from '@/contexts/client'
import { useRegisterSection } from '@/contexts/registerSec'

type Props = {
    quantity: number,
    setQuantity: (value: number) => void
    activeSpecifications: ProductSpecification | undefined | null
    purchase: PurchaseType
    setPurchase: (value: PurchaseType) => void
    cart: CartType
}

const ProductActionPanel = ({
    quantity,
    setQuantity,
    activeSpecifications,
    purchase,
    setPurchase,
    cart
}: Props) => {

    const { screenWidth } = useScreen();
    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const { client } = useClient();
    const { setRegisterSectionExist } = useRegisterSection();

    const handlePuttingInCart = () => {

        if (!client) return setRegisterSectionExist(true);

        if (purchase.cart) {
            setPurchase({
                ...purchase, 
                cart: null,
                status: 'viewed'
            })
        } else {
            setPurchase({
                ...purchase, 
                cart: cart._id,
                status: 'inCart'
            })
        }


    }

  return (

        <div 
            className='flex flex-row my-5- mx-2 gap-4'
        >

            <ChoseQuantity
                quantity={quantity}
                setQuantity={setQuantity}
                max={activeSpecifications?.quantity?? 1}
            />

            <button 
                className='flex flex-1 justify-center items-center w-12 h-12 text-sm sm:text-md rounded-sm cursor-pointer'
                style={{
                    backgroundColor: colors.dark[100],
                    color: colors.light[200]
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
                
            </button>

        </div>
  )
}

export default ProductActionPanel
