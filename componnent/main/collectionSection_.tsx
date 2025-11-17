// import { backEndUrl } from '@/api';
// import { useLanguage } from '@/contexts/languageContext';
// import { CollectionType } from '@/types';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import CollectionCard from '../sub/collectionCard';
// import { collectionsLoading } from '@/constent/data';
// import { useTheme } from '@/contexts/themeProvider';

// type CollectionsSectionType = {
//     collectionsId: string[]
// }

// const CollectionsSection = ({
//     collectionsId
// }: CollectionsSectionType) => {

//     const { activeLanguage } = useLanguage();
//     const [collection, setCollection] = useState<CollectionType | undefined>(undefined);
//     const [collection, setCollection] = useState<CollectionType | undefined>(undefined);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const { colors } = useTheme();


//     useEffect(() => {

//         setCollection(collectionsLoading);

//         const fetchData = async () => {

//             setIsLoading(true);

//             if (importedFrom == "homePage") {

//               await axios.get(backEndUrl + "/topCollections")
//               .then(({ data }) => {
//                   setCollections(data.topCollections);
//                   setIsLoading(false);
//               })
//               .catch((err) => {
//                   throw err;
//               })
              
//             } else {

//               await axios.get(backEndUrl + "/getPublicCollections")
//               .then(({ data }) => {
//                   setCollections(data.publicCollections);
//                   setIsLoading(false);
//               })
//               .catch((err) => {
//                   throw err;
//               })

//             }

//         }

//         fetchData();

//     }, [])

//     // useEffect(() => {
//     //     console.log({
//     //         collections___: collections
//     //     });
        
//     // }, [collections])

    

//   return (
//     <div className='w-full flex flex-col items-center p-5 sm:p-10'>
      
//       <h4 
//         className='text-2xl sm:text-4xl py-10 sm:py-16'
//         style={{
//           color: colors.dark[200]
//         }}
//       >
//         {importedFrom == "collectionsPage" ?
//           activeLanguage.sideMatter.allCollections :
//           activeLanguage.nav.collections
//         }
//       </h4>

//       <div className='w-full flex flex-wrap justify-center sm:justify-start- gap-5 sm:p-10'>

//         {collections?.map((collection) => (

//             <CollectionCard
//                 key={collection._id}
//                 collection={collection}
//                 isLoading={isLoading}
//             />

//         ))}

//       </div>

//     </div>
//   )
// }

// export default CollectionsSection;
