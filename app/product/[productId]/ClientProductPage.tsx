"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProductType, OwnerInfoType, ProductSpecification, CollectionType, PurchaseType, CartType, LikeType } from "@/types";
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
import { getUniqueImagesByColor, handleShareOnFacebook } from "@/lib";
import { headerHeight, productActionPanelHeight } from "@/constent";
import { fakeProducts } from "@/constent/data";
import { useLoadingScreen } from "@/contexts/loadingScreen";
import { useSocket } from "@/contexts/soket";
import axios from "axios";
import { backEndUrl } from "@/api";
import { useClient } from "@/contexts/client";
import { useStatusBanner } from "@/contexts/StatusBanner";
import { useOwner } from "@/contexts/ownerInfo";
import LoadingScreen from "@/componnent/sub/loading/loadingScreen";
import SkeletonLoading from "@/componnent/sub/SkeletonLoading";
import { useLanguage } from "@/contexts/languageContext";

interface Props {
  product: ProductType;
}

export default function ClientProductPage({ product }: Props) {
    const { screenWidth, screenHeight } = useScreen();
    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();
    const socket = useSocket();
    const { client } = useClient()
    const { setLoadingScreen } = useLoadingScreen();
    const { ownerInfo } = useOwner();

    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [sideBarActive, setSideBarActive] = useState(false);
    
    const [activeSpecifications, setActiveSpecifications] = useState<ProductSpecification | null>(null);
    const [purchase, setPurchase] = useState<PurchaseType | null>(null); 
    
    const [collections, setCollections] = useState<CollectionType[]>([]);
    const [loadingGettingCollection, setLoadingGettingCollection] = useState<boolean>(true);
    const [cart, setCart] = useState<CartType>({});
    const [like, setLike] = useState<boolean | null>(null);
    const [clientForm, setClientForm] = useState({ fullName: "", address: "", phone: "", note: "" });

    // --- الحل هنا: إجبار الصفحة على الصعود للأعلى عند الدخول ---
    useEffect(() => {
        window.scrollTo(0, 0);
        setLoadingScreen(false);
    }, [product._id]); // يتم التنفيذ عند تحميل الصفحة أو تغير المنتج

    useEffect(() => {
      if (!purchase?._id) {
        axios.get(backEndUrl + "/getPurchaseByClientAndProduct", {
            params: {
                productId: product._id,
                clientId: client?._id
            }
        })
        .then(({data}) => {
            setPurchase(data.purchase)
            // alert(data.purchase._id)
        })
        .catch(( err ) => {
            alert(err)
        })
        // setPurchase({
        //     client: client?._id ?? undefined,
        //     product: product._id ?? undefined,
        //     specification: null, 
        //     quantity: 1,
        //     like: false
        // })
      }
    }, [client, product])

    useEffect(() => {
        if (activeSpecifications && purchase) {
            setPurchase(prev => prev ? ({
              ...prev,
              specification: activeSpecifications
            }) : null);
        }
    }, [activeSpecifications])

    useEffect(() => {
        const fetchData = async () => {
            if (!product?._id || product._id.length <= fakeProducts.length) return;

            try {
                setLoadingGettingCollection(true);
                const { data } = await axios.get(`${backEndUrl}/getCollectionsByProduct`, { params: { productId: product._id } });
                const filtered = data.collections.filter((c: CollectionType) => c.type === "public");
                setCollections(filtered.map((c: CollectionType) => ({ ...c, display: "horizental" })));
            } catch (err) { console.error(err); } 
            finally { setLoadingGettingCollection(false); }

            if (client?._id) {
                axios.get(`${backEndUrl}/getLikeByClientAndProduct`, { params: { clientId: client._id, productId: product._id } })
                    .then(({ data }) => setLike(!!data.like));

                axios.get(`${backEndUrl}/getCartByClient`, { params: { clientId: client._id } })
                    .then(({ data }) => setCart(data.cart));
                
                const purchaseId = localStorage.getItem('purchaseId');
                if (purchaseId) {
                    axios.get(`${backEndUrl}/getPurchaseById`, { params: { purchaseId } })
                        .then(({ data }) => { if(data.purchase) setPurchase(data.purchase); });
                }
            }
        };
        fetchData();
    }, [product?._id, client?._id]);

    const handlePurchaseQuantity = (quantity: number) => {
        if (purchase) setPurchase({ ...purchase, quantity });
    }

    const handleLike = async () => {
        if (!product || !client || like == null) return;
        const currentLike = like;
        setLike(!currentLike);
        try {
            if (!currentLike) {
                await axios.post(`${backEndUrl}/addLike`, { likeData: { client: client._id, product: product._id } });
            } else {
                await axios.delete(`${backEndUrl}/deleteLike`, { data: { clientId: client._id, productId: product._id } });
            }
        } catch (err) { setLike(currentLike); }
    }

    const uniqueImages = useMemo(() => getUniqueImagesByColor(product?.images), [product?.images]);
    
    if (!ownerInfo) return <LoadingScreen/>

    return (
        <div className="page bg-transparent" style={{ backgroundColor: colors.light[100], color: colors.dark[150], paddingBottom: productActionPanelHeight }}>
            <AnnouncementBar/>
            <Header isSideBarActive={sideBarActive} setIsSideBarActive={setSideBarActive} ownerInfo={ownerInfo} setOwnerInfo={() => {}} />

            <div className={`w-full relative flex ${screenWidth > 1200 ? 'h-[90vh] flex-row justify-center' : 'flex-col justify-start items-center'} pt-5`} style={{ minHeight: screenHeight - (headerHeight * 1.5) }}>
                
                {screenWidth > 1200 && (
                    <div className="w-24 flex flex-col gap-4 justify-center items-center mr-4">
                        {ownerInfo?.socialMedia?.map((media) => (
                            <img key={media.platform} src={media.icon} className="w-8 h-8 cursor-pointer opacity-70 hover:opacity-100" onClick={() => media.platform === "Facebook" && handleShareOnFacebook(window.location.href)} />
                        ))}
                    </div>
                )}
                
                <div className={`max-w-full flex flex-1 ${screenWidth > 1200 ? 'min-h-[90vh] flex-row justify-center items-start' : 'flex-col items-center'}`}>
                    {screenWidth < 1200 && (
                        <h4 className='font-bold text-lg sm:text-xl px-10 my-3'>
                            {product.name[activeLanguage.language] || <SkeletonLoading />}
                        </h4>
                    )}

                    <ImagesSwitcher 
                        images={product?.images || []} 
                        currentImageIndex={currentImageIndex} 
                        setCurrentImageIndex={setCurrentImageIndex} 
                        like={like ?? false} 
                        setLike={handleLike} 
                    />

                    <ProductDetails
                        product={product}
                        currentImageIndex={currentImageIndex}
                        setCurrentImageIndex={setCurrentImageIndex}
                        loadingGettingProduct={false}
                        quantity={purchase?.quantity ?? 1}
                        setQuantity={handlePurchaseQuantity}
                        activeSpecifications={activeSpecifications?? product.specifications[0]}
                        collections={collections}
                        loadingGettingCollection={loadingGettingCollection}
                        setActiveSpecifications={setActiveSpecifications}
                        purchase={purchase!}
                        setPurchase={setPurchase}
                        cart={cart}
                        clientForm={clientForm}
                        setClientForm={setClientForm}
                    />
                </div>
            </div>

            <div className="my-10 sm:my-24">
                {product?._id && <OtherSimilarChose collections={collections} product={product} />}
            </div>

            <div className="w-full fixed bottom-0 left-0 flex flex-row justify-center items-center p-2 z-20" style={{ backgroundColor: colors.light[100], boxShadow: `0 -2px 10px rgba(0,0,0,0.1)`, height: productActionPanelHeight }}>
                <div className="w-full flex flex-row justify-center items-center gap-10 sm:w-[600px]">
                    {screenWidth > 1000 && <div>
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
                    </div>}
                    <ProductActionPanel
                        quantity={purchase?.quantity ?? 1}
                        setQuantity={handlePurchaseQuantity}
                        activeSpecifications={activeSpecifications}
                        purchase={purchase!}
                        setPurchase={setPurchase}
                        cart={cart}
                        product={product}
                        clientForm={clientForm}
                        setClientForm={setClientForm}
                    />
                </div>
            </div>

            <Footer/>
            <SideBar isActive={sideBarActive} setIsActive={setSideBarActive} ownerInfo={ownerInfo} setOwnerInfo={() => {}} />
        </div>
    );
}