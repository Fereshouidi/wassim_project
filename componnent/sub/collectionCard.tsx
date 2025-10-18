import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { CollectionType } from '@/types'
import React, { useRef, useState } from 'react'
import SkeletonLoading from './SkeletonLoading'
import { useRouter } from 'next/navigation'

type CollectionCardType = {
    collection: CollectionType
    isLoading: boolean
}

const CollectionCard = ({
    collection,
    isLoading
}: CollectionCardType) => {

    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHover, setIsHover] = useState<boolean>(false);
    const router = useRouter();



  return (
    <div 
        className='w-[300px] rounded-sm cursor-pointer duration-300 overflow-hidden'
        style={{
            backgroundColor: colors.light[100],
            boxShadow: isHover ? '0 0px 10px rgba(13, 13, 13, 0.15)' : "0 0px 10px rgba(13, 13, 13, 0.02)",
            transform: isHover ? 'scale(105%)' : ""
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={() => collection.name && router.push(`/search?collectionId=${collection._id}`)}
    >

        <div 
            className='w-full h-[270px] flex flex-1 '
            style={{
                backgroundColor: colors.light[300],
                border: 'none'
            }}
        >
            {collection.thumbNail ?
                <img 
                    src="/" 
                    alt="" 
                    className='w-full h-full'
                /> :
            isLoading ?
                <SkeletonLoading/>
            :
                null
        }
        </div>

        <div className='min-h-7 my-[1px]'>{
            collection.name[activeLanguage.language] ? 
                <h4     
                    className='min-h-5 p-3 text-center'
                    style={{
                        color: colors.dark[150]
                    }}
                >
                    {collection.name[activeLanguage.language]}
                </h4> :
                <div className='h-7'>
                    <SkeletonLoading/>
                </div>
        }</div>
      
    </div>
  )

}

export default CollectionCard
