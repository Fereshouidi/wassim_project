"use client";

import { useEffect, useState } from "react";
import { ProductType, OwnerInfoType, ProductSpecification, CollectionType } from "@/types";
import ImagesSwitcher from "@/componnent/main/imagesSwitcher";
import ProductDetails from "@/componnent/main/productDetails";
import OtherSimilarChose from "@/componnent/main/otherSimilarChose";
import SideBar from "@/componnent/main/sideBar";
import Footer from "@/componnent/main/footer";
import Header from "@/componnent/main/header";
import AnnouncementBar from "@/componnent/sub/AnnouncementBar";
import ProductActionPanel from "@/componnent/sub/ProductActionPanel";
import { useScreen } from "@/contexts/screenProvider";
import { useTheme } from "@/contexts/themeProvider";
import { handleShareOnFacebook } from "@/lib";
import { headerHeight } from "@/constent";
import { fakeProducts } from "@/constent/data";
import { useLoadingScreen } from "@/contexts/loadingScreen";
import { useSocket } from "@/contexts/soket";
import axios from "axios";
import { backEndUrl } from "@/api";

interface Props {
  product: ProductType;
  ownerInfo: OwnerInfoType;
}

export default function ClientProductPage({ product, ownerInfo }: Props) {
    const { screenWidth, screenHeight } = useScreen();
    const { colors } = useTheme();
    const socket = useSocket();

    const [quantity, setQuantity] = useState(1);
    const [activeSpecifications, setActiveSpecifications] = useState<ProductSpecification>(product.specifications[0]);
    const [loadingGettingCollection, setLoadingGettingCollection] = useState<boolean>(true);
    const [sideBarActive, setSideBarActive] = useState(false);
    const { setLoadingScreen } = useLoadingScreen();
    const [collections, setCollections] = useState<CollectionType[]>([]);


    useEffect(() => {
    setLoadingScreen(false);
    }, [])


    useEffect(() => {
        const fetchCollections = async () => {
        try {
            setLoadingGettingCollection(true);
            await axios.get(`${backEndUrl}/getCollectionsByProduct`, {
                params: { productId: product._id },
            })
            .then(({ data }) => {
                const filtered = data.collections.filter(
                (collection: CollectionType) =>
                    collection.type === "public"
                );
                
                const toSlider = filtered.map((collection: CollectionType) => { return {...collection, display: "horizontal"} })

                setCollections(toSlider);            
            })

        } catch (err) {
            console.error(err);
        } finally {
            setLoadingGettingCollection(false);
        }
        };

        if (product?._id && product._id.length > fakeProducts.length) {
        fetchCollections();
        }
    }, [product?._id]);

    useEffect(() => {
        if (!socket) return;

        socket.emit("greating", "hi")

        socket.on("greatingBack", (data: any) => {
            alert(data)
        });

        // Clean up
        return () => {
            socket.off("greatingBack");
        };
    }, [socket]);

 return (

    <>
      {/* <Main> */}
        <div 
            className="page bg-transparent"
            style={{
                backgroundColor: colors.light[100],
                color: colors.dark[150]
            }}
            
        >

          <AnnouncementBar/>
          <Header
            isSideBarActive={sideBarActive}
            setIsSideBarActive={setSideBarActive}
            ownerInfo={ownerInfo}
            setOwnerInfo={() => {}}
          />

          <div 
            className={`w-full bg-red-500- sm:min-h-[90vh]- relative flex bg-blue-500- ${screenWidth > 1000 ? 'h-[90vh] flex-row justify-center' : 'flex-col items-center'} pt-5`}
            style={{
                minHeight: screenHeight - (headerHeight * 1.5) 
            }}
        >

            <div 
              className={`
                ${screenWidth > 1000 ? 
                    "w-24 h-[90%] flex flex-col gap-2 justify-center items-end bg-red-500-"
                  : "w-full flex flex-row gap-2 justify-center items-end bg-red-500-"
                }
              `}
            >
              {ownerInfo?.socialMedia?.map((media) => (
                <img 
                  key={media.platform}
                  src={media.icon}
                  onClick={() => {
                    media.platform == "Facebook" ? handleShareOnFacebook(window.location.href)
                    : null
                  }}
                  className="w-10 h-10 cursor-pointer"
                />
              ))}
            </div>
            
            <div className={`flex flex-1 ${screenWidth > 1000 ? 'h-[90vh] flex-row justify-center' : 'flex-col items-center'}`}>
              <ImagesSwitcher
                  images={product?.images || []}
                  className=""
                  style={{
                      // width: screenWidth > 1000 ? "500px" : "90%",
                      // backgroundColor: 'red'
                  }}
              />

              <ProductDetails
                  product={product?? fakeProducts[0]}
                  loadingGettingProduct={false}
                  style={{
                      // width: screenWidth > 1000 ? "40%" : "90%",
                      height: screenWidth > 1000 ? "" : "100%",
                  }}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  activeSpecifications={activeSpecifications}
                  collections={collections}
                  setCollections={setCollections}
                  loadingGettingCollection={loadingGettingCollection}
                  setLoadingGettingCollection={setLoadingGettingCollection}
                  setActiveSpecifications={(value) => {
                    if (value !== null && value !== undefined) {
                      setActiveSpecifications(value);
                    }
                  }}
              />
            </div>

          </div>

          <div className="w-full h-[500px]- my-24">
            {product?._id && <OtherSimilarChose
                collections={collections}
                product={product}
            />}
          </div>

          <div 
            className="w-full h-fit fixed bottom-0 left-0 flex justify-center items-center p-2"
            style={{
              backgroundColor: colors.light[100]
            }}
          >
            {screenWidth > 1000 && 
              <div className="mr-10 flex flex-row gap-1">
                {ownerInfo?.socialMedia?.map((media) => (
                <img 
                  key={media.platform}
                  src={media.icon}
                  onClick={() => {
                    media.platform == "Facebook" ? handleShareOnFacebook(window.location.href)
                    : null
                  }}
                  
                  className="w-10 h-10"
                />
              ))}
            </div>}

            <div className="w-[500px] bg-red-500-">
              <ProductActionPanel
                quantity={quantity}
                setQuantity={setQuantity}
                activeSpecifications={activeSpecifications}     
              />
            </div>
          </div>

          <Footer/>

          <SideBar
            isActive={sideBarActive}
            setIsActive={setSideBarActive}
            ownerInfo={ownerInfo}
            setOwnerInfo={() => {}}
          />

        </div>
      {/* </Main> */}
    </>

  );
}
