import { useTheme } from "@/contexts/themeProvider";

type ErrorBannerProps = {
    show: boolean;
    message: string;
}

export const ErrorBanner = ({ show, message }: ErrorBannerProps) => {
    const { colors } = useTheme();
    
    if (!show) return null;

    return (
        <div 
            className='w-full max-w-md p-4 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn'
            style={{
                backgroundColor: '#ef4444',
                color: 'white'
            }}
        >
            <div className='w-6 h-6 flex items-center justify-center'>
                ❌
            </div>
            <div className='flex-1'>
                <p className='font-semibold'>Error</p>
                <p className='text-sm opacity-90'>{message}</p>
            </div>
        </div>
    );
};