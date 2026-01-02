import { useTheme } from "@/contexts/themeProvider";
import { OrderType } from "@/types";

type OrderConfirmedBannerProps = {
    show: boolean;
    order?: OrderType;
}

export const OrderConfirmedBanner = ({ show, order }: OrderConfirmedBannerProps) => {
    const { colors } = useTheme();
    
    if (!show) return null;

    return (
        <div 
            className='w-full max-w-md p-4 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn'
            style={{
                backgroundColor: '#10b981',
                color: 'white'
            }}
        >
            <div className='w-6 h-6 flex items-center justify-center'>
                ✓
            </div>
            <div className='flex-1'>
                <p className='font-semibold'>Order Confirmed!</p>
                {order && (
                    <p className='text-sm opacity-90'>
                        Order #{order.orderNumber} has been placed successfully
                    </p>
                )}
            </div>
        </div>
    );
};