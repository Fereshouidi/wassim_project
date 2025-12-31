import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { ProductType } from '@/types'
import React, { CSSProperties, useEffect, useState } from 'react'
import SkeletonLoading from './SkeletonLoading'
import { useRouter } from 'next/navigation'
import { useScreen } from '@/contexts/screenProvider'
import { useLoadingScreen } from '@/contexts/loadingScreen'
import { useClient } from '@/contexts/client'
import { useRegisterSection } from '@/contexts/registerSec'
import axios from 'axios'
import { backEndUrl } from '@/api'
import { useStatusBanner } from '@/contexts/StatusBanner'

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

    const handleLike = async () => {

        if (!product || !client || like == null) return;
        // setLoadingScreen(true);

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

        // setLoadingScreen(false);

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
              console.log({like: data.like})
          })
          .catch( err => {
              console.error({err})
          })
          
        }
        fetchLike();
    }, [client?._id, product._id])

  return (
    <div 
        className={` flex relative flex-col items-center gap-2 rounded-sm overflow-hidden cursor-pointer ${className}`}
        style={{
            ...style
            // backgroundColor: colors.light[100]
        }}
        onClick={() => {
            if ((product?._id?.length || 0) < 3) return;
            setLoadingScreen(true);
            localStorage.removeItem('purchaseId');
            router.push(`/product/${product._id}`)
        }}
    >

        {useLike && <div 
            className={`absolute top-1 right-1 rounded-full p-[5px] ${like ? "bg-red-500" : "bg-gray-400 opacity-75"} w-8 h-8 z-2 cursor-pointer`}
            style={{
                // boxShadow: `0 5px 15px ${colors.dark[400]}`,
                // backgroundColor: like ? "" : 
            }}
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
            className='w-[200px] sm:w-[250px] min-h-[150px]- sm:min-h-[170px]- h-[180px] sm:h-[220px] rounded-sm overflow-hidden'
            style={{
                backgroundColor: colors.light[300]
            }}
        >
            {
                product.thumbNail ? <img 
                    src={product.thumbNail}
                    className='w-full h-full rounded-sm overflow-hidden hover:scale-110 duration-300'
                /> :
                product.thumbNail == null ?
                    <SkeletonLoading/> :
                null
                }
        </div>


        <h4 
            className='w-full rounded-sm overflow-hidden min-h-5 text-[14px] sm:text-lg text-center '
            style={{
                color: colors.dark[200]
            }}
        >
            {
                product.name[activeLanguage.language] != null ?
                    product.name[activeLanguage.language] + ""
                : <SkeletonLoading/>
            }
            
        </h4>

        <span 
            className='min-w-[50%] rounded-sm overflow-hidden min-h-5 text-[17px] sm:text-lg font-bold text-center'
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

    </div>
  )
}

export default ProductCard
