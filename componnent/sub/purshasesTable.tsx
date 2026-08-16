import { useLanguage } from '@/contexts/languageContext';
import { useLoadingScreen } from '@/contexts/loadingScreen';
import { useOwner } from '@/contexts/ownerInfo';
import { useTheme } from '@/contexts/themeProvider';
import { calculPurshaseTotalPrice } from '@/lib';
import { OrderType, PurchaseType } from '@/types';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';

type Props = {
    purchases: PurchaseType[];
    order: OrderType
}
const getSpecImage = (product: any, specIdObj: any) => {
    let imgUri = product?.thumbNail || product?.productThumb || "/icons/shopping-bag-black.png";
    if (!product || !product.images || !product.specifications || !specIdObj) return imgUri;

    const specId = typeof specIdObj === 'string' ? specIdObj : specIdObj._id;
    const specObj = product.specifications.find((s: any) => s._id === specId);

    if (!specObj) return imgUri;

    const normalizeHex = (h?: string | null) => {
        if (!h) return '';
        let v = h.trim().toLowerCase();
        return (v.length === 4 && v.startsWith('#')) ? `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}` : v;
    };

    const specHex = normalizeHex(specObj.colorHex);
    const specColor = specObj.color?.trim().toLowerCase();

    const matchingImg = product.images.find((img: any) => {
        const imgSpecId = typeof img.specification === 'string' ? img.specification : img.specification?._id;
        if (imgSpecId === specId) return true;

        const imgSpecObj = imgSpecId ? product.specifications.find((s: any) => s._id === imgSpecId) : null;
        const imgColorHex = normalizeHex(imgSpecObj?.colorHex || img.specification?.colorHex);
        const imgColorName = (imgSpecObj?.color || img.specification?.color)?.trim().toLowerCase();

        if (specHex && imgColorHex && specHex === imgColorHex) return true;
        if (specColor && imgColorName && specColor === imgColorName) return true;
        return false;
    });

    if (matchingImg?.uri) return matchingImg.uri;
    return imgUri;
};

const PurshasesTable = ({ purchases, order }: Props) => {
    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const { setLoadingScreen } = useLoadingScreen();
    const router = useRouter();

    useEffect(() => {
        setTotalPrice(Number(calculPurshaseTotalPrice(purchases)));
    }, [purchases]);

    return (
        <div
            className='w-full cursor-auto overflow-hidden rounded-sm-'
            style={{
                backgroundColor: colors.light[100],
                border: `1px solid ${colors.light[250]}`,
                boxShadow: activeTheme === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.05)'
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className='p-4 border-b' style={{ borderColor: colors.light[250] }}>
                <h2 className='font-bold text-sm flex items-center gap-2' style={{ color: colors.dark[100] }}>
                    <span className='w-1 h-4 rounded-full' style={{ backgroundColor: colors.dark[200] }} />
                    {activeLanguage.purchasesDetails}
                </h2>
            </div>

            <div className='overflow-x-auto scrollbar-hide'>
                <table className='w-full text-left border-collapse min-w-[450px] sm:min-w-0'>
                    <thead>
                        <tr style={{ backgroundColor: colors.light[150] }}>
                            <th className='p-3 sm:p-4 text-[10px] uppercase font-bold tracking-wider opacity-60'>{activeLanguage.product}</th>
                            <th className='p-3 sm:p-4 text-[10px] uppercase font-bold tracking-wider opacity-60 text-center'>{activeLanguage.specification}</th>
                            <th className='p-3 sm:p-4 text-[10px] uppercase font-bold tracking-wider opacity-60 text-center'>{activeLanguage.quantity}</th>
                            <th className='p-3 sm:p-4 text-[10px] uppercase font-bold tracking-wider opacity-60 text-right'>{activeLanguage.price}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map((purchase, index) => (
                            <motion.tr
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className='group cursor-pointer transition-colors hover:bg-opacity-50'
                                style={{
                                    borderBottom: `1px solid ${colors.light[200]}`,
                                    backgroundColor: 'transparent'
                                }}
                                whileHover={{ backgroundColor: colors.light[200] }}
                                onClick={() => {
                                    const pId = purchase.product?._id || purchase.productId;
                                    if (!pId) return;

                                    setLoadingScreen(true);
                                    localStorage.removeItem('purchaseId');
                                    //@ts-ignore
                                    router.push(`/product/${pId}`)
                                }}
                            >
                                <td className='p-3 sm:p-4'>
                                    <div className='flex items-center gap-2 sm:gap-4'>
                                        {purchase.isCustomized ? (
                                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-sm- bg-gray-50 flex-shrink-0" style={{ borderColor: colors.light[300], overflow: 'hidden' }}>
                                                {typeof purchase.product === 'object' && (
                                                    <img
                                                        src={getSpecImage(purchase.product, purchase.specification)}
                                                        className="w-[85%] h-[85%] absolute"
                                                        style={{ top: '7.5%', left: '7.5%', objectFit: 'contain' }}
                                                        alt="base"
                                                    />
                                                )}
                                                {purchase.customizedCharms?.map((customCharm, idx) => {
                                                    const charmObj = typeof customCharm.charm === 'object' ? customCharm.charm : null;
                                                    const charmThumb = charmObj ? getSpecImage(charmObj, customCharm.spec) : null;

                                                    if (!charmThumb) return null;
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="absolute"
                                                            style={{
                                                                left: `${customCharm.x}%`,
                                                                top: `${customCharm.y}%`,
                                                                width: '15%',
                                                                aspectRatio: '1/1',
                                                                marginLeft: '-7.5%',
                                                                marginTop: '-7.5%',
                                                                backgroundColor: 'transparent'
                                                            }}
                                                        >
                                                            <img
                                                                src={charmThumb}
                                                                className="w-full h-full object-contain"
                                                                alt="charm"
                                                            />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-sm- overflow-hidden border bg-white flex-shrink-0' style={{ borderColor: colors.light[300] }}>
                                                <img
                                                    src={getSpecImage(purchase.product, purchase.specification)}
                                                    alt="product"
                                                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-1 w-full max-w-[120px] sm:max-w-[200px]">
                                            <span className='text-[10px] sm:text-xs font-medium' style={{ color: colors.dark[200], wordWrap: 'break-word', whiteSpace: 'normal' }}>
                                                {purchase.isCustomized && <span className="text-purple-600 font-bold block mb-1" style={{ color: '#9333ea' }}>🪄 DIY - </span>}
                                                {//@ts-ignore
                                                    purchase.product ? purchase.product.name[activeLanguage.language] : (purchase.productName ? purchase.productName[activeLanguage.language] : "Deleted Product")
                                                }</span>
                                        </div>
                                    </div>
                                </td>
                                <td className='p-3 sm:p-4 text-center'>
                                    <div className='flex flex-col gap-1'>
                                        {(purchase.specification?.color || purchase.specColor) && (
                                            <span className='text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full inline-block mx-auto border'
                                                style={{ borderColor: colors.light[350], color: colors.dark[600] }}>
                                                {purchase.specification?.color || purchase.specColor}
                                            </span>
                                        )}
                                        {(purchase.specification?.size || purchase.specSize) && (
                                            <span className='text-[9px] sm:text-[10px] font-bold opacity-60 italic'>Size: {purchase.specification?.size || purchase.specSize}</span>
                                        )}
                                        {purchase.isCustomized && purchase.customizedCharms && purchase.customizedCharms.length > 0 && (
                                            <span className='text-[9px] sm:text-[10px] font-bold opacity-80' style={{ color: '#9333ea' }}>
                                                +{purchase.customizedCharms.length} {activeLanguage.language === 'en' ? 'Charms' : 'Charmes'}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className='p-3 sm:p-4 text-center'>
                                    <span className='text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-1 rounded-sm-' style={{ backgroundColor: colors.light[250], color: colors.dark[300] }}>
                                        {purchase.quantity}
                                    </span>
                                </td>
                                <td className='p-3 sm:p-4 text-right'>
                                    <span className='text-[10px] sm:text-xs font-bold' style={{ color: colors.dark[100] }}>
                                        {(() => {
                                            const basePrice = (purchase.specification as any)?.price || purchase.specPrice || 0;
                                            const charmsPrice = purchase.customizedCharms?.reduce((acc, pc) => {
                                                const p = (pc.spec as any)?.price || (pc.charm as any)?.price || (pc.charm as any)?.specifications?.[0]?.price || 0;
                                                return acc + p;
                                            }, 0) || 0;
                                            return ((basePrice + charmsPrice) * (purchase.quantity || 0)).toFixed(2);
                                        })()} <span className='text-[8px] sm:text-[10px] opacity-60 font-normal'>D.T</span>
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className='p-4 flex flex-col gap-2' style={{ backgroundColor: colors.light[150] }}>
                <div className='flex justify-between items-center text-[10px] sm:text-xs opacity-70'>
                    <span>{activeLanguage.totalPrice}</span>
                    <span className='font-bold'>{totalPrice.toFixed(2)} D.T</span>
                </div>
                <div className='flex justify-between items-center text-[10px] sm:text-xs opacity-70'>
                    <span>{activeLanguage.shippingCoast}</span>
                    <span className='font-bold'>{(order?.shippingCoast || 0).toFixed(2)} D.T</span>
                </div>
                <div className='h-[1px] my-1' style={{ backgroundColor: colors.light[300] }} />
                <div className='flex justify-between items-center'>
                    <span className='text-[10px] sm:text-xs font-bold uppercase tracking-wider'>{activeLanguage.totalAmmount}</span>
                    <div className='bg-black text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-sm- text-xs sm:text-sm font-bold shadow-lg'
                        style={{ backgroundColor: colors.dark[100], color: colors.light[100] }}>
                        {(totalPrice + (order?.shippingCoast || 0)).toFixed(2)} <span className='text-[8px] sm:text-[10px] font-normal'>D.T</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PurshasesTable
