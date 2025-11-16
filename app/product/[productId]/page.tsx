"use client";
import Head from "next/head";
import { backEndUrl } from "@/api";
import Footer from "@/componnent/main/footer";
import Header from "@/componnent/main/header";
import ImagesSwitcher from "@/componnent/main/imagesSwitcher";
import OtherSimilarChose from "@/componnent/main/otherSimilarChose";
import ProductDetails from "@/componnent/main/productDetails";
import SideBar from "@/componnent/main/sideBar";
import AnnouncementBar from "@/componnent/sub/AnnouncementBar";
import ProductActionPanel from "@/componnent/sub/ProductActionPanel";
import { headerHeight } from "@/constent";
import { fakeProducts } from "@/constent/data";
import { useScreen } from "@/contexts/screenProvider";
import { useTheme } from "@/contexts/themeProvider";
import { handleShareOnFacebook, handleShareOnInstagram } from "@/lib";
import { OwnerInfoType, ProductSpecification, ProductType } from "@/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLanguage } from "@/contexts/languageContext";
import SkeletonLoading from "@/componnent/sub/SkeletonLoading";
import { useLoadingScreen } from "@/contexts/loadingScreen";


export default function ProductPage() {

  const params = useParams();
  const { activeLanguage } = useLanguage();
  const productId = params.productId;
  const [sideBarActive, setSideBarActive] = useState<boolean>(false);
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfoType | undefined>(undefined);
  const { screenWidth, screenHeight } = useScreen();
  const [product, setProduct] = useState<ProductType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const { colors } = useTheme();
  const { setLoadingScreen } = useLoadingScreen();
  const [quantity, setQuantity] = useState<number>(1);
  const [activeSpecifications, setActiveSpecifications] = useState<ProductSpecification | null | undefined>(null);

  


  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        await axios.get(backEndUrl + "/getOwnerInfo")
        .then(({ data }) => {
            setOwnerInfo(data.ownerInfo);
            setLoading(false)
        })
        .catch((err) => {
            throw err
        })
    }
    fetchData();
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      await axios.get(backEndUrl + "/getProductById", { params: { productId } })
      .then(({ data }) => setProduct(data.product))
      .catch((err) => {
        console.log(err);
        })  
    }
    fetchProduct(); 
  }, [productId])

  // useEffect(() => {
  //   const socket = io(backEndUrl, {
  //     transports: ["websocket"],
  //     withCredentials: true,
  //   });

  //   socket.on("connect", () => {
  //     console.log("Socket connected:", socket.id);
  //   });

  //   socket.on("connect_error", (err) => {
  //     console.error("Socket connection error:", err.message);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    setLoadingScreen(false);
  }, [])



  return (

    <>
      <Head>
        <title>{product?.name[activeLanguage.language]}</title>
        <meta property="og:title" content={product?.name[activeLanguage.language]?? ""} />
        <meta property="og:description" content={product?.description[activeLanguage.language]?? ""} />
        <meta property="og:image" content={product?.thumbNail?? ""} />
        <meta property="og:url" content={`https://yourdomain.com/product/${product?._id}`} />
        <meta property="og:type" content="product" />
      </Head>

      {/* <Main> */}
        <div 
            className="page bg-transparent pb-16"
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
            setOwnerInfo={setOwnerInfo}
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
              

              { product?.images ?
                <ImagesSwitcher
                    images={product?.images || []}
                    className=""
                    style={{
                        // width: screenWidth > 1000 ? "500px" : "90%",
                        // backgroundColor: 'red'
                    }}
                />
                :
                <div className="w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-sm overflow-hidden">
                  <SkeletonLoading/>
                </div>
              }

              <ProductDetails
                  product={product?? fakeProducts[0]}
                  loadingGettingProduct={loading}
                  style={{
                      // width: screenWidth > 1000 ? "40%" : "90%",
                      height: screenWidth > 1000 ? "" : "100%",
                  }}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  activeSpecifications={activeSpecifications}
                  setActiveSpecifications={setActiveSpecifications}
              />
            </div>

          </div>

          {product?._id && <OtherSimilarChose
            product={product}
          />}

          <div 
            className="w-full h-16 fixed bottom-0 left-0 flex justify-center items-center py-2 px-5"
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
            setOwnerInfo={setOwnerInfo}
          />

        </div>
      {/* </Main> */}
    </>

  );
}
