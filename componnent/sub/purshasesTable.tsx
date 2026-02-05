import { useLanguage } from '@/contexts/languageContext';
import { useLoadingScreen } from '@/contexts/loadingScreen';
import { useOwner } from '@/contexts/ownerInfo';
import { useTheme } from '@/contexts/themeProvider';
import { calculPurshaseTotalPrice } from '@/lib';
import { OrderType, PurchaseType } from '@/types';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

type Props = {
  purchases: PurchaseType[];
  order: OrderType
}

const PurshasesTable = ({ purchases, order }: Props) => {

    const { activeLanguage } = useLanguage();
    const { colors } = useTheme();
    const { ownerInfo } = useOwner();
    const [ totalPrice, setTotalPrice ] = useState<number>(0);
    const { setLoadingScreen } = useLoadingScreen();
    const router = useRouter();

    useEffect(() => {
        setTotalPrice(Number(calculPurshaseTotalPrice(purchases)));
    }, [purchases]);

    return (
        <div 
            className='w-full cursor-auto'
            onClick={(e) => e.stopPropagation()}
        >

            <h2 className='font-bold text-[12px] m-2'>{ activeLanguage.purchasesDetails + " : "}</h2>

            <table 
                className='w-full'
                style={{
                    border: `0.2px solid ${colors.light[300]}`
                }}
            >
                <thead>
                    <tr>
                        <th 
                            className='text-center text-[10px] sm:text-[12px] p-2'
                            style={{
                                border: `0.2px solid ${colors.light[300]}`
                            }}
                        >{activeLanguage.product}</th>
                        <th 
                            className='text-center text-[10px] sm:text-[12px] min-w-[70px] p-2'
                            style={{
                                border: `0.2px solid ${colors.light[300]}`
                            }}
                        >{activeLanguage.specification}</th>
                        <th 
                            className='text-center text-[10px] sm:text-[12px] min-w-[20px] p-2'
                            style={{
                                border: `0.2px solid ${colors.light[300]}`
                            }}
                        >{activeLanguage.quantity}</th>
                        <th 
                            className='text-center text-[10px] sm:text-[12px] min-w-[70px] p-2'
                            style={{
                                border: `0.2px solid ${colors.light[300]}`
                            }}
                        >{activeLanguage.price}</th>
                    </tr>
                </thead>
                <tbody 
                    style={{
                        border: `0.2px solid ${colors.light[300]}`
                    }}
                >
                    {purchases.map((purchase, index) => (
                        <tr 
                            key={index} 
                            className=''
                            style={{
                                border: `0.2px solid ${colors.light[300]}`
                            }}
                            onClick={() => {
                                setLoadingScreen(true);
                                localStorage.removeItem('purchaseId');
                                //@ts-ignore
                                router.push(`/product/${purchase.product._id}`)
                            }}
                        >
                            <td 
                                className=' max-w-[10%] bg-red-500- p-2 cursor-pointer'
                                style={{ border: `0.2px solid ${colors.light[300]}` }}
                            >
                                <div className='w-full flex flex-row items-center gap-2 bg-red-500-'>
                                    <img
                                        src={
                                            //@ts-ignore
                                            purchase.product?.thumbNail ?? ""
                                        }
                                        alt="product"
                                        className='w-5 h-5 rounded-full object-cover'
                                    />
                                    <span className='text-[10px] sm:text-[12px]'>{
                                        //@ts-ignore
                                        purchase.product?.name[activeLanguage.language]
                                    }</span>
                                </div>
                            </td>
                            <td 
                                className=' text-[10px] sm:text-[12px] text-center line p-2'
                                style={{ border: `0.2px solid ${colors.light[300]}` }}
                            >
                                <p className='w-full break-words whitespace-pre-line'>
                                    {
                                        //@ts-ignore
                                        purchase?.specification?.color
                                    }
                                </p>
                                <p className='w-full break-words whitespace-pre-line'>
                                    {
                                        //@ts-ignore
                                        purchase?.specification?.size ?  "" + purchase?.specification?.size :  ""
                                    }
                                </p>
                                <p className='w-full break-words whitespace-pre-line'>
                                    {
                                        //@ts-ignore
                                        purchase?.specification?.type ?  "" + purchase?.specification?.type :  ""
                                    }
                                </p>

                            </td>

                            <td 
                                className='text-[10px] sm:text-[12px] text-center p-2'
                                style={{ border: `0.2px solid ${colors.light[300]}` }}
                            >{purchase.quantity}</td>

                            <td 
                                className='text-[10px] sm:text-[12px] text-center  p-2'
                                style={{ border: `0.2px solid ${colors.light[300]}` }}
                            >
                                {
                                    //@ts-ignore
                                    (purchase.specification?.price * purchase.quantity).toFixed(2)
                                } D.T</td>

                        </tr>
                    ))}
                </tbody>

                <tfoot className='w-full'>

                    <tr>
                        <td 
                            colSpan={3}
                            className=' text-center text-[10px] sm:text-[12px] p-2'
                            style={{ border: `0.2px solid ${colors.light[300]}` }}
                        >
                            <p className='text-center'>{activeLanguage.totalPrice}</p>
                        </td>
                        <td 
                            className='text-[10px] sm:text-[12px] text-center p-2'
                            style={{ border: `0.2px solid ${colors.light[300]}` }}
                        >
                            {totalPrice + " D.T"}
                        </td>
                    </tr>

                    <tr>
                        <td 
                            colSpan={3}
                            className='text-center text-[10px] sm:text-[12px] p-2'
                            style={{ border: `0.2px solid ${colors.light[300]}` }}
                        >
                            {activeLanguage.shippingCoast}
                        </td>
                        <td 
                            className='text-[10px] sm:text-[12px] text-center p-2'
                            // style={{ border: `0.2px solid ${colors.light[300]}` }}
                        >
                            {
                                //@ts-ignore
                                order?.shippingCoast || 0
                            } D.T
                        </td>
                    </tr>

                    <tr>
                        <td 
                            colSpan={3}
                            className='text-center text-[10px] sm:text-[12px] p-2'
                            // style={{ border: `0.2px solid ${colors.light[300]}` }}
                        >
                            {activeLanguage.totalAmmount}
                        </td>
                        <td 
                            className='text-[10px] sm:text-[12px] text-center p-2'
                            style={{ border: `1px solid ${colors.dark[300]}` }}
                        >
                            {
                                //@ts-ignore
                                totalPrice + (order?.shippingCoast || 0)
                            } D.T
                        </td>
                    </tr>

                </tfoot>
            </table>
        </div>
    )
}

export default PurshasesTable
