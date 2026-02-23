import React from 'react'
import ChoseQuantity from '../choseQuantity'
import { CartType, ProductSpecification, ProductType, PurchaseType } from '@/types'
import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { useScreen } from '@/contexts/screenProvider'
import { useClient } from '@/contexts/client'
import { useRegisterSection } from '@/contexts/registerSec'
import { useLoadingScreen } from '@/contexts/loadingScreen'
import OrderNowButton from '../orderBtn'
import { useOwner } from '@/contexts/ownerInfo'
import { backEndUrl } from '@/api'
import axios from 'axios'
import AddToCartAnimation from '../addToCartAnimation'
import { useCartSide } from '@/contexts/cart'

type Props = {
    quantity: number,
    setQuantity: (value: number) => void
    activeSpecifications: ProductSpecification | undefined | null
    purchase: PurchaseType
    setPurchase: (value: PurchaseType) => void
    cart: CartType
    product: ProductType
    clientForm: any
    setClientForm: (value: any) => void
    activeButtong?: "orderNow" | "putInCart"
}

const ProductActionPanel = ({
    quantity,
    setQuantity,
    activeSpecifications,
    purchase,
    setPurchase,
    cart,
    product,
    clientForm,
    setClientForm,
    activeButtong
}: Props) => {

    const { screenWidth } = useScreen();
    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const { client } = useClient();
    const { ownerInfo } = useOwner();
    const { setRegisterSectionExist } = useRegisterSection();
    const { setLoadingScreen } = useLoadingScreen();
    const { purchases, setPurchases } = useCartSide();

    /**
     * 1. Cart Toggle Handler
     * Manages adding/removing items from the cart via HTTP PUT request.
     * Updates global cart state and local purchase status.
     */
    const handlePuttingInCart = async () => {
        if (!client) {
            setRegisterSectionExist(true);
            return false;
        }

        const isRemoving = !!purchase.cart;
        const updatedPurchaseData = {
            ...purchase,
            cart: isRemoving ? null : cart._id,
            status: isRemoving ? 'viewed' : 'inCart'
        };

        // Optimistic UI update for the cart side panel
        setPurchases(prev => 
            isRemoving 
                ? prev.filter(p => p._id !== purchase._id) 
                : [...prev, purchase]
        );

        try {
            const { data } = await axios.put(`${backEndUrl}/updatePurchase`, updatedPurchaseData);

            if (data.success) {
                // Synchronize state with the latest server data
                setPurchase(data.purchase); 
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error updating cart:", err);
            return false;
        }
    };

    /**
     * 2. Direct Order Handler
     * Validates form data and processes the final checkout via HTTP POST.
     */
    const handleOrder = async () => {
        
        if (
            !purchase._id || 
            !ownerInfo?.shippingCost || 
            !clientForm.fullName || 
            !clientForm.phone || 
            !clientForm.address
        ) {
            return setRegisterSectionExist(true);
        }

        setLoadingScreen(true);

        const orderData = { 
            orderForm: { 
                ...clientForm, 
                client: client?._id, 
                shippingCoast: ownerInfo?.shippingCost, 
                clientNote: clientForm.note 
            }, 
            purchasesId: [purchase._id]
        };

        try {
            // Ensure purchase data is synced before finalizing order
            await axios.put(`${backEndUrl}/updatePurchase`, purchase);
            const { data } = await axios.post(`${backEndUrl}/addOrder`, orderData);
            
            if (data.success) {
                console.log("Order Successful:", data.newOrder);
                // Success redirect or notification logic goes here
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "An error occurred during checkout";
            console.error("Order Error:", errorMessage);
        } finally {
            setLoadingScreen(false);
        }
    };

    return (
        <div className='w-full flex flex-row justify-center items-center my-5 mx-2 px-5 gap-4'>
            
            <ChoseQuantity
                quantity={quantity}
                setQuantity={setQuantity}
                max={activeSpecifications?.quantity ?? 1}
            />

            {
                activeButtong == "putInCart" ? 
                
                product?.thumbNail && (
                    <AddToCartAnimation
                        productImage={product.thumbNail}
                        isInCart={!!purchase?.cart}
                        onToggle={handlePuttingInCart}
                    />
                )
                :
                <OrderNowButton 
                    onOrder={handleOrder} 
                />
            }

        </div>
    )
}

export default ProductActionPanel;