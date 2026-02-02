import React, { useEffect } from 'react'
import ChoseQuantity from './choseQuantity'
import { CartType, ClientType, ProductSpecification, ProductType, PurchaseType } from '@/types'
import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { useScreen } from '@/contexts/screenProvider'
import { useClient } from '@/contexts/client'
import { useRegisterSection } from '@/contexts/registerSec'
import { useLoadingScreen } from '@/contexts/loadingScreen'
import { useSocket } from '@/contexts/soket'
import AddToCartAnimation from './addToCartAnimation'
import OrderNowButton from './orderBtn'
import { useOwner } from '@/contexts/ownerInfo'

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
    setClientForm
}: Props) => {

    const socket = useSocket();
    const { screenWidth } = useScreen();
    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const { client } = useClient();
    const { ownerInfo } = useOwner();
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

    const handleOrder = async () => {
        if (!purchase._id || !ownerInfo?.shippingCost || !clientForm.fullName || !clientForm.phone || ! clientForm.address) return setRegisterSectionExist(true);
        // setLoadingScreen(true);
        socket?.emit('add_order', { 
            form: { ...clientForm, client: client?._id, shippingCoast: ownerInfo?.shippingCost, clientNote: clientForm.note }, 
            purchasesId: [purchase._id]
        });
        // alert(JSON.stringify(purchase))
    }

  return (

        <div 
            className='w-full flex flex-row justify-center items-center my-5- mx-2 px-5 gap-4 bg-red-500-'
        >

            <ChoseQuantity
                quantity={quantity}
                setQuantity={setQuantity}
                max={activeSpecifications?.quantity?? 1}
            />

            {/* {product?.thumbNail && (
                <AddToCartAnimation
                    productImage={product.thumbNail}
                    isInCart={!!purchase?.cart}
                    onToggle={async () => {
                        const result = handlePuttingInCart();
                        return !!result;
                    }}
                />
            )} */}

            <OrderNowButton 
                onOrder={ async () => await handleOrder()} 
            />


        </div>
  )
}

export default ProductActionPanel
