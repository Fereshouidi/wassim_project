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
import ProductActionPanel from "@/componnent/sub/ProductActionPanel/ProductActionPanel";
import { useScreen } from "@/contexts/screenProvider";
import { useTheme } from "@/contexts/themeProvider";
import {
    getUniqueImagesByColor,
    handleShareOnFacebook,
    handleShareOnInstagram,
    handleShareOnTwitter,
    handleShareOnWhatsApp,
    handleShareOnLinkedIn,
    handleSocialMediaClick
} from "@/lib";
import { headerHeight, productActionPanelHeight } from "@/constent";
import { fakeProducts } from "@/constent/data";
import { useLoadingScreen } from "@/contexts/loadingScreen";
// import { useSocket } from "@/contexts/soket";
import axios from "axios";
import { backEndUrl } from "@/api";
import { useClient } from "@/contexts/client";
import { useStatusBanner } from "@/contexts/StatusBanner";
import { useOwner } from "@/contexts/ownerInfo";
import LoadingScreen from "@/componnent/sub/loading/loadingScreen";
import SkeletonLoading from "@/componnent/sub/SkeletonLoading";
import { useLanguage } from "@/contexts/languageContext";
import { useSearchParams } from "next/navigation";

interface Props {
    product: ProductType;
}

export default function ClientProductPage({ product }: Props) {
    const { screenWidth, screenHeight } = useScreen();
    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();
    // const socket = useSocket();
    const { client } = useClient()
    const { setLoadingScreen } = useLoadingScreen();
    const { ownerInfo } = useOwner();
    const searchParams = useSearchParams();
    const fromCart = searchParams.get('fromCart') === 'true';

    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [sideBarActive, setSideBarActive] = useState(false);

    const [activeSpecifications, setActiveSpecifications] = useState<ProductSpecification | null>(null);
    const [purchase, setPurchase] = useState<PurchaseType | null>(null);

    const [collections, setCollections] = useState<CollectionType[]>([]);
    const [loadingGettingCollection, setLoadingGettingCollection] = useState<boolean>(true);
    const [cart, setCart] = useState<CartType>({});
    const [like, setLike] = useState<boolean | null>(null);
    const [clientForm, setClientForm] = useState({ fullName: "", address: "", phone: "", note: "" });
    const [hasInteracted, setHasInteracted] = useState<boolean>(false);

    // --- الحل هنا: إجبار الصفحة على الصعود للأعلى عند الدخول ---
    useEffect(() => {
        window.scrollTo(0, 0);
        setLoadingScreen(false);

    }, [product._id]); // يتم التنفيذ عند تحميل الصفحة أو تغير المنتج

    useEffect(() => {

        if (!client || !product._id) return;

        if (!purchase?._id) {
            axios.get(backEndUrl + "/getPurchaseByClientAndProduct", {
                params: {
                    productId: product._id,
                    clientId: client?._id
                }
            })
                .then(({ data }) => {
                    // Clear cart so button always starts as "Add to Cart"
                    if (data?.purchase) {
                        setPurchase({ ...data.purchase, cart: null });
                    } else {
                        // Initialize a default purchase if none exists on the server
                        setPurchase({
                            client: client?._id,
                            product: product._id,
                            quantity: 1,
                            status: 'viewed',
                            specification: null,
                            like: false
                        } as any);
                    }
                })
                .catch((err) => {
                    console.error("Error fetching purchase:", err);
                    // Initialize default even on error to allow interaction
                    setPurchase({
                        client: client?._id,
                        product: product._id,
                        quantity: 1,
                        status: 'viewed',
                        specification: null,
                        like: false
                    } as any);
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
        if (purchase) {
            const max = activeSpecifications?.unlimited ? 1000 : (activeSpecifications?.quantity ?? 0);
            const currentQuantity = purchase.quantity || 1;
            const newQuantity = currentQuantity > max ? Math.max(1, max) : currentQuantity;

            setPurchase(prev => prev ? ({
                ...prev,
                specification: activeSpecifications,
                quantity: newQuantity
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
                        .then(({ data }) => {
                            if (data.purchase) {
                                setPurchase({ ...data.purchase, cart: null });
                                if (data.purchase.specification) {
                                    setActiveSpecifications(data.purchase.specification || null);
                                    if (fromCart) {
                                        setHasInteracted(true);
                                    }
                                }
                                localStorage.removeItem('purchaseId');
                            }
                        });
                }
            }
        };
        fetchData();
    }, [product?._id, client?._id]);

    const handlePurchaseQuantity = (newQuantity: number) => {
        setPurchase(prev => prev ? { ...prev, quantity: newQuantity } : ({
            client: client?._id,
            product: product._id,
            quantity: newQuantity,
            status: 'viewed',
            specification: null,
            like: false
        } as any));
    };

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

    if (!ownerInfo) return <LoadingScreen />

    return (
        <div className="page bg-transparent" style={{ backgroundColor: colors.light[100], color: colors.dark[150], paddingBottom: productActionPanelHeight }}>
            <AnnouncementBar />
            <Header isSideBarActive={sideBarActive} setIsSideBarActive={setSideBarActive} ownerInfo={ownerInfo} setOwnerInfo={() => { }} />

            <div className={`w-full relative flex ${screenWidth > 1200 ? 'h-[90vh] bg-red-500- flex-row justify-center' : 'flex-col justify-start items-center'} pt-5 mb-24-`} style={{ minHeight: screenHeight - (headerHeight * 1.5) }}>

                {screenWidth > 1200 && (
                    <div className="w-24 flex flex-col gap-4 justify-center items-center mb-20 mr-4-">
                        {ownerInfo?.socialMedia
                            ?.filter((media) =>
                                //@ts-ignore
                                ["facebook", "whatsapp"].includes(media?.platform?.toLowerCase())
                            )
                            .map((media) => (
                                <img
                                    key={media.platform}
                                    src={media.icon}
                                    alt={media.platform}
                                    className="w-8 h-8 cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
                                    onClick={() => handleSocialMediaClick(media)}
                                />
                            ))
                        }
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
                        activeSpecifications={activeSpecifications}
                        isExplicitlySelected={activeSpecifications !== null}
                        collections={collections}
                        loadingGettingCollection={loadingGettingCollection}
                        setActiveSpecifications={setActiveSpecifications}
                        purchase={purchase!}
                        setPurchase={setPurchase}
                        cart={cart}
                        clientForm={clientForm}
                        setClientForm={setClientForm}
                        hasInteracted={hasInteracted}
                        setHasInteracted={setHasInteracted}
                        fromCart={fromCart}
                    />
                </div>
            </div>

            <div className="my-0 sm:my-24">
                {product?._id && <OtherSimilarChose collections={collections} product={product} />}
            </div>

            <div className="w-full fixed bottom-0 left-0 flex flex-row justify-center items-center p-2 z-20" style={{ backgroundColor: colors.light[100], boxShadow: `0 -2px 10px rgba(0,0,0,0.1)`, height: productActionPanelHeight }}>
                <div className="w-full flex flex-row justify-center items-center gap-10 sm:w-[800px]">
                    {screenWidth > 1000 && (
                        <div className="mr-10- flex flex-row gap-3">
                            {ownerInfo?.socialMedia
                                //@ts-ignore
                                ?.filter((media) =>
                                    //@ts-ignore
                                    ["facebook", "whatsapp"].includes(media?.platform?.toLowerCase())
                                )
                                .map((media) => {
                                    const isFacebook = media?.platform?.toLowerCase() === "facebook";
                                    const platformColor = isFacebook ? "#1877F2" : "#25D366";

                                    return (
                                        <div
                                            key={media.platform}
                                            onClick={() => handleSocialMediaClick(media)}
                                            className="flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
                                            style={{ backgroundColor: platformColor }}
                                        >
                                            <img
                                                src={media.icon}
                                                alt={media.platform}
                                                className="w-5 h-5 brightness-0- invert-"
                                            />
                                            <span className="text-[11px] font-black uppercase tracking-widest text-white">
                                                {media.platform}
                                            </span>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    )}
                    <ProductActionPanel
                        quantity={purchase?.quantity ?? 1}
                        setQuantity={handlePurchaseQuantity}
                        activeSpecifications={hasInteracted ? activeSpecifications : product.specifications[0]}
                        purchase={purchase!}
                        setPurchase={setPurchase}
                        cart={cart}
                        product={product}
                        clientForm={clientForm}
                        setClientForm={setClientForm}
                        activeButton='putInCart'
                    />
                </div>
            </div>

            <Footer />
            <SideBar isActive={sideBarActive} setIsActive={setSideBarActive} ownerInfo={ownerInfo} setOwnerInfo={() => { }} />
        </div>
    );
}