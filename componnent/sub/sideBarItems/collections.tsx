import { backEndUrl } from '@/api';
import LoadingHomePage from '@/componnent/main/loading/loadingHomePage';
import { useLanguage } from '@/contexts/languageContext'
import { useStatusBanner } from '@/contexts/StatusBanner';
import { useTheme } from '@/contexts/themeProvider';
import { CollectionType } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import LoadingScreen from '../loading/loadingScreen';
import LoadingIcon from '../loading/loadingIcon';
import { col } from 'framer-motion/m';
import { useScreen } from '@/contexts/screenProvider';

type props = {
    sideBarActive: boolean
}
const Collections = ({sideBarActive}: props) => {

    const { activeLanguage } = useLanguage();
    const { activeTheme, colors } = useTheme();
    const { screenWidth } = useScreen();
    const [collections, setCollections] = useState<CollectionType[]>([]);
    const { setStatusBanner } = useStatusBanner();
    const [loading, setLoading] = useState<boolean>(false);
    const [collectionsDivVisible, setCollectionsDivVisible] = useState<boolean>(false);

    const getCollections = async () => {

        setLoading(true);

        await axios.get( backEndUrl + "/getCollectionsInSideBar" )
        .then(({ data }) => {
            setCollections(data.collections);
            setCollectionsDivVisible(true)
        })
        .catch(( err ) => {
            console.log({err});
            alert("err")
        })

        setLoading(false);
    }

    useEffect(() => {
        setCollectionsDivVisible(false)
        //alert(sideBarActive)
        
    }, [sideBarActive])

    return (
        <div 
            className='relative h-full w-full bg-red-800- flex flex-row justify-between items-center z-50'
        >
            {activeLanguage.nav.collections}
            {screenWidth > 1000 && <img 
                src={activeTheme == "dark" ? "/icons/right-arrow-black.png" : "/icons/right-arrow-white.png"}
                className='w-5 h-5 bg-red-400- p-[5px] rounded-full cursor-pointer'
                alt="" 
                onClick={(e) => {
                    e.stopPropagation();
                    if (collections.length > 0) {
                        setCollections([]);
                        
                    } else {
                        getCollections()
                    }
                    
                }}
            />}


            <div
                className={`w-fit fixed bg-red-500 ${collectionsDivVisible ? "left-[320px]" : "invisible left-0"}  top-0- z-[9999] rounded-sm duration-300`}
                style={{
                    backgroundColor: colors.dark[100]
                }}
            >
                {loading && <LoadingIcon
                    size={20}
                    squareSize={10}
                />}

                {collections.length > 0 && collections.map(( collection ) => (
                    <div
                        key={collection._id}
                        className={`p-2 min-w-32 cursor-pointer ${activeTheme == "dark" ? "hover:bg-gray-200" : "hover:bg-gray-900"} `}
                        style={{
                            border: `0.2px solid ${colors.dark[200]}`
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                    >
                        {collection.name[activeLanguage.language]}
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Collections
