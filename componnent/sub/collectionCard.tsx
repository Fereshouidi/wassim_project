import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { CollectionType } from '@/types'
import React, { useRef, useState } from 'react'

type CollectionCardType = {
    collection: CollectionType
}

const CollectionCard = ({
    collection
}: CollectionCardType) => {

    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHover, setIsHover] = useState<boolean>(false);



  return (
    <div 
        className='w-[270px] min-h-[270px] rounded-sm cursor-pointer duration-300'
        style={{
            backgroundColor: colors.light[100],
            boxShadow: isHover ? '0 0px 10px rgba(13, 13, 13, 0.15)' : "0 0px 10px rgba(13, 13, 13, 0.02)",
            transform: isHover ? 'scale(105%)' : ""
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
    >

        <img 
            src="/" 
            alt="" 
            className='w-[270px] h-[270px] flex flex-1 '
            style={{
                backgroundColor: colors.light[300],
                border: 'none'
            }}
        />
        <h4 className='p-2 text-center'>{collection.name[activeLanguage.language]}</h4>
      
    </div>
  )

}

export default CollectionCard
