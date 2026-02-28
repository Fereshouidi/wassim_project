import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { CollectionType, FiltrationType, ProductType } from '@/types'
import React, { useRef, useState } from 'react'
import SkeletonLoading from './SkeletonLoading'
import { useRouter } from 'next/navigation'
import { useLoadingScreen } from '@/contexts/loadingScreen'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion'

type CollectionCardType = {
    collection: CollectionType
    isLoading: boolean
    // mostProductExpensive: ProductType
    // availableColors: string[]
    // availableTypes: string[]
    // availableSizes: string[]
}

const CollectionCard = ({
    collection,
    isLoading,
    // mostProductExpensive,
    // availableColors,
    // availableSizes,
    // availableTypes
}: CollectionCardType) => {

    const { colors, activeTheme } = useTheme();
    const { activeLanguage } = useLanguage();
    const cardRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { setLoadingScreen } = useLoadingScreen();



    const handleCardClicked = () => {

        let filter = null;
        try {
            filter = JSON.parse(localStorage.getItem("searchFilter") ?? "") as unknown as FiltrationType;
        } catch (err) {
            console.log({ err });
        }

        if (!filter) return;

        setLoadingScreen(true);

        const updatedFilter = {
            ...filter,
            collections: [collection._id]
        } as FiltrationType;

        localStorage.setItem("searchFilter", JSON.stringify(updatedFilter));

        router.push(
            `/search?searchInput=${encodeURIComponent("")}&filter=${encodeURIComponent(JSON.stringify(updatedFilter))}`
        );

    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            variants={fadeInUp}
            whileTap={{ scale: 0.98 }}
            className='w-[320px] sm:w-[250px] max-h-[320px] sm:max-h-[270px] rounded-xl cursor-pointer overflow-hidden transition-all duration-300'
            style={{
                backgroundColor: colors.light[100],
                boxShadow: activeTheme === 'dark' ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.05)',
                border: `0.5px solid ${colors.light[400]}`
            }}
            onClick={handleCardClicked}
        >

            <div
                className='w-full h-[270px] sm:h-[220px] flex flex-1 '
                style={{
                    backgroundColor: colors.light[300],
                    border: 'none'
                }}
            >
                {collection.thumbNail ?
                    <img
                        src={collection.thumbNail}
                        alt=""
                        className='w-full h-full'
                    /> :
                    isLoading ?
                        <SkeletonLoading />
                        :
                        null
                }
            </div>

            <div className='min-h-10 mt-[1px]'>{
                collection.name[activeLanguage.language] ?
                    <h4
                        className='min-h-10 p-3 text-center'
                        style={{
                            color: colors.dark[150]
                        }}
                    >
                        {collection.name[activeLanguage.language]}
                    </h4> :
                    <div className='h-10'>
                        <SkeletonLoading />
                    </div>
            }</div>

        </motion.div>
    )

}

export default CollectionCard
