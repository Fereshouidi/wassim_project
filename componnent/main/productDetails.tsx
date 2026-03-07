"use client";

import React, { useMemo, useState, useEffect, useRef, CSSProperties } from 'react';
import axios from 'axios';
import { backEndUrl } from '@/api';
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import { useScreen } from '@/contexts/screenProvider';
import { useOwner } from '@/contexts/ownerInfo';
import { useClient } from '@/contexts/client';
import {
  CartType, CollectionType, EvaluationType,
  ProductSpecification, ProductType, PurchaseType
} from '@/types';
import { calculateRatingStats, handleSocialMediaClick } from '@/lib';

// Sub Components
import ProductActionPanel from '../sub/ProductActionPanel/ProductActionPanel';
import StarsRatingDisplay from '../sub/StarsRatingDisplay';
import AddEvaluationCard from '../sub/addEvaluationCard';
import EditEvaluationCard from '../sub/editEvaluationCard';
import EvaluationsSection from './evaluationSection';
import InputForm from './inputForm';
import OrderData from './OrderData';
import SkeletonLoading from '../sub/SkeletonLoading';

type ProductDetailsType = {
  className?: string;
  style?: CSSProperties;
  product: ProductType;
  currentImageIndex: number;
  setCurrentImageIndex: (value: number) => void;
  loadingGettingProduct: boolean;
  quantity: number;
  setQuantity: (value: number) => void;
  activeSpecifications: ProductSpecification | null;
  setActiveSpecifications: (value: ProductSpecification | null) => void;
  collections: CollectionType[];
  purchase: PurchaseType;
  setPurchase: (value: PurchaseType) => void;
  cart: CartType;
  onSpecificationChange?: (index: number) => void;
  loadingGettingCollection?: boolean;
  clientForm: any,
  setClientForm: (value: any) => void;
  isExplicitlySelected?: boolean;
  hasInteracted: boolean;
  setHasInteracted: (value: boolean) => void;
  fromCart?: boolean;
};

const ProductDetails = ({
  className, style, product, currentImageIndex, setCurrentImageIndex,
  quantity, setQuantity, activeSpecifications, setActiveSpecifications,
  collections, purchase, setPurchase, cart, onSpecificationChange,
  loadingGettingCollection, clientForm, setClientForm, isExplicitlySelected,
  hasInteracted, setHasInteracted, fromCart
}: ProductDetailsType) => {

  const { screenWidth } = useScreen();
  const { activeLanguage } = useLanguage();
  const { colors, activeTheme } = useTheme();
  const { client } = useClient();

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const cartSyncDone = useRef(false);

  const [evaluations, setEvaluations] = useState<EvaluationType[]>([]);
  const [evaluationSectionActive, setEvaluationSectionActive] = useState(false);
  const [addEvaluationActive, setAddEvaluationActive] = useState(false);
  const [editEvaluationActive, setEditEvaluationActive] = useState(false);
  const [newEvaluation, setNewEvaluation] = useState<EvaluationType>({});
  const [clientCanRate, setClientCanRate] = useState<boolean>(false);
  const { ownerInfo } = useOwner();

  const allSpecs = useMemo(() => product.specifications || [], [product.specifications]);

  const allColors = useMemo(() => Array.from(new Set(allSpecs.map(s => s.color).filter(Boolean))), [allSpecs]);
  const allSizes = useMemo(() => Array.from(new Set(allSpecs.map(s => s.size).filter(Boolean))), [allSpecs]);
  const allTypes = useMemo(() => Array.from(new Set(allSpecs.map(s => s.type).filter(Boolean))), [allSpecs]);

  const availableColorsForContext = useMemo(() =>
    allSpecs.filter(s => (!selectedSize || s.size === selectedSize) && (!selectedType || s.type === selectedType)).map(s => s.color),
    [selectedSize, selectedType, allSpecs]);

  const availableSizesForContext = useMemo(() =>
    allSpecs.filter(s => (!selectedColor || s.color === selectedColor) && (!selectedType || s.type === selectedType)).map(s => s.size),
    [selectedColor, selectedType, allSpecs]);

  const availableTypesForContext = useMemo(() =>
    allSpecs.filter(s => (!selectedColor || s.color === selectedColor) && (!selectedSize || s.size === selectedSize)).map(s => s.type),
    [selectedColor, selectedSize, allSpecs]);

  const findAndSetSpec = (color: string | null, size: string | null, type: string | null) => {
    // Find the best matching spec based on whatever is selected so far
    // Filter specs that match all the selected (non-null) attributes
    const candidates = allSpecs.filter(s =>
      (!color || s.color === color) &&
      (!size || s.size === size) &&
      (!type || s.type === type)
    );

    // Use first matching candidate, or fallback to first spec overall
    const matched = candidates[0] || allSpecs[0];

    if (matched) {
      setActiveSpecifications(matched as ProductSpecification);
    }
  };

  const handleColorSelect = (color: string) => {
    setHasInteracted(true);
    const newColor = selectedColor === color ? null : color;
    setSelectedColor(newColor);

    if (newColor) {
      const specWithColor = allSpecs.find(s => s.color === newColor);
      if (specWithColor) {
        // Try matching by colorHex first
        let imageIndex = -1;
        if (specWithColor.colorHex) {
          imageIndex = product.images.findIndex(img => {
            const imgSpec = img.specification as ProductSpecification;
            return imgSpec?.colorHex === specWithColor.colorHex;
          });
        }
        // Fallback: match by color name
        if (imageIndex === -1) {
          imageIndex = product.images.findIndex(img => {
            const imgSpec = img.specification as ProductSpecification;
            return imgSpec?.color === newColor;
          });
        }
        if (imageIndex !== -1) setCurrentImageIndex(imageIndex);
      }
    }

    findAndSetSpec(newColor, selectedSize, selectedType);
  };

  const handleSizeSelect = (size: string) => {
    setHasInteracted(true);
    const newSize = selectedSize === size ? null : size;
    setSelectedSize(newSize);

    // Check if current color is still valid with this size
    if (newSize && selectedColor) {
      const isStillAvailable = allSpecs.some(s => s.size === newSize && s.color === selectedColor);
      if (!isStillAvailable) {
        setSelectedColor(null);
        findAndSetSpec(null, newSize, selectedType);
        return;
      }
    }

    findAndSetSpec(selectedColor, newSize, selectedType);
  };

  const handleTypeSelect = (type: string) => {
    setHasInteracted(true);
    const newType = selectedType === type ? null : type;
    setSelectedType(newType);

    if (newType && selectedColor) {
      const isStillAvailable = allSpecs.some(s => s.type === newType && s.color === selectedColor);
      if (!isStillAvailable) {
        setSelectedColor(null);
        findAndSetSpec(null, selectedSize, newType);
        return;
      }
    }

    findAndSetSpec(selectedColor, selectedSize, newType);
  };

  // Sync image when activeSpecifications changes (e.g. coming from cart)
  useEffect(() => {
    if (activeSpecifications?.colorHex && hasInteracted) {
      const imageIndex = product.images.findIndex(img =>
        (img.specification as ProductSpecification)?.colorHex === activeSpecifications.colorHex
      );
      if (imageIndex !== -1 && imageIndex !== currentImageIndex) {
        setCurrentImageIndex(imageIndex);
      }
    }
  }, [activeSpecifications, hasInteracted]);

  // One-time sync: when opening from cart, highlight the saved selections
  useEffect(() => {
    if (fromCart && activeSpecifications && !cartSyncDone.current) {
      cartSyncDone.current = true;
      setSelectedColor(activeSpecifications.color || null);
      setSelectedSize(activeSpecifications.size || null);
      setSelectedType(activeSpecifications.type || null);
    }
  }, [fromCart, activeSpecifications]);

  useEffect(() => {
    if (!product._id) return;

    axios.get(`${backEndUrl}/getEvaluationByProduct`, { params: { productId: product._id } })
      .then(({ data }) => {
        const fetchedEvaluations = data.evaluations || [];
        setEvaluations(fetchedEvaluations);

        if (client?._id) {
          axios.get(`${backEndUrl}/verifyClientPurchase`, { params: { productId: product._id, clientId: client._id } })
            .then(({ data: purchaseData }) => {
              const hasPurchased = (purchaseData.purchaseCount || 0) > 0;
              const hasAlreadyRated = fetchedEvaluations.some((e: any) => (e.client?._id || e.client) === client._id);
              setClientCanRate(hasPurchased && !hasAlreadyRated);
            })
            .catch(err => console.error(err));

          //@ts-ignore
          setNewEvaluation(prev => ({ ...prev, client: client?._id, product: product?._id }));
        }
      })
      .catch(err => console.error(err));

  }, [product?._id, client?._id]);

  return (
    <div className={`h-full overflow-y-auto scrollbar-hidden px-6 pt-8 ${screenWidth > 1000 ? "w-[50%]" : "w-full"} ${className}`} style={style}>

      {/* Product Title & Price Section */}
      <section className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {collections.map((collection) => (
            <span key={collection._id} className="text-[10px] font-black uppercase tracking-widest opacity-30">
              {collection.name[activeLanguage.language]}
            </span>
          ))}
        </div>
        <h1 className='font-bold text-2xl sm:text-3xl tracking-tight mb-2' style={{ color: colors.dark[150] }}>
          {product.name[activeLanguage.language]}
        </h1>
        <div className="flex items-baseline gap-3">
          <span className='font-black text-4xl' style={{ color: colors.dark[150] }}>
            {activeSpecifications?.price || (!hasInteracted && product.specifications?.[0]?.price) || product.price || 0}
            <span className="text-sm font-bold opacity-40 ml-1">D.T</span>
          </span>
          {product.oldPrice && product.oldPrice > (activeSpecifications?.price || (!hasInteracted && product.specifications?.[0]?.price) || product.price || 0) && (
            <span className="text-xl font-bold line-through opacity-20">
              {product.oldPrice} DT
            </span>
          )}
        </div>
      </section>

      {/* Ratings Quick View */}
      <div className='flex items-center gap-4 py-4 border-y border-black/5 mb-8'>
        <div className='flex items-center gap-2 cursor-pointer' onClick={() => setEvaluationSectionActive(true)}>
          <StarsRatingDisplay rating={calculateRatingStats(evaluations).average} />
          <p className='text-[12px] font-bold opacity-50 underline underline-offset-4'>
            {evaluations.length} {activeLanguage?.opinion}
          </p>
        </div>
        {clientCanRate && (
          <button
            onClick={() => setAddEvaluationActive(true)}
            className='flex items-center gap-2 px-4 py-2 rounded-xl transition-all active:scale-95 shadow-sm'
            style={{ backgroundColor: colors.dark[100], color: colors.light[100] }}
          >
            <span className="text-[11px] font-black uppercase tracking-wider">{activeLanguage.addEvaluation}</span>
            <span className="text-lg leading-none">+</span>
          </button>
        )}
      </div>

      {/* Attributes Selection */}
      <div className="space-y-8 mb-10">
        {[
          { label: activeLanguage.sideMatter.colors, items: allColors, selected: selectedColor, handler: handleColorSelect, available: availableColorsForContext },
          { label: activeLanguage.sideMatter.sizes, items: allSizes, selected: selectedSize, handler: handleSizeSelect, available: availableSizesForContext },
          { label: activeLanguage.sideMatter.types || "Types", items: allTypes, selected: selectedType, handler: handleTypeSelect, available: availableTypesForContext }
        ].map((attr, idx) => attr.items.length > 1 && (
          <div key={idx}>
            <h4 className='text-[11px] font-black uppercase tracking-widest mb-4 opacity-40'>{attr.label}</h4>
            <div className='flex flex-wrap gap-2'>
              {attr.items.map(val => {
                const isSelected = hasInteracted && attr.selected === val;
                const isAvailable = attr.available.includes(val!);
                return (
                  <button
                    key={val}
                    disabled={!isAvailable}
                    onClick={() => attr.handler(val!)}
                    className={`px-[14px] py-[10px] text-[13px] font-semibold rounded-xl border-2 transition-all duration-300 ${isSelected ? 'scale-105' : 'hover:border-black/20'}`}
                    style={{
                      backgroundColor: isSelected ? colors.dark[100] : 'transparent',
                      color: isSelected ? colors.light[150] : colors.dark[150],
                      borderColor: isSelected ? colors.dark[100] : colors.light[300],
                      // Only dim if at least one selection has been made and this specific value is unavailable
                      opacity: (isAvailable || (!selectedColor && !selectedSize && !selectedType)) ? 1 : 0.2,
                    }}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Description Article */}
      <article className='mb-10 p-6 rounded-xl bg-black/[0.02] border border-black/5'>
        <p className='text-[14px] leading-relaxed font-medium opacity-70 whitespace-pre-line' style={{ color: colors.dark[250] }}>
          {product.description[activeLanguage.language]}
        </p>
      </article>

      {screenWidth < 1000 && (
        <div className="w-full flex gap-3 justify-center items-center opacity-80 backdrop-opacity-75 mb-10">
          {ownerInfo?.socialMedia
            ?.filter((media) =>
              media.platform && ["facebook", "whatsapp"].includes(media.platform.toLowerCase())
            )
            .map((media) => {
              const isFacebook = media.platform?.toLowerCase() === "facebook";
              // تحديد الألوان الرسمية (أزرق للفيس، أخضر للواتساب)
              const platformColor = isFacebook ? "#1877F2" : "#25D366";

              return (
                <div
                  key={media.platform}
                  onClick={() => handleSocialMediaClick(media)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer transition-transform active:scale-95 shadow-sm"
                  style={{ backgroundColor: platformColor }}
                >
                  <img
                    src={media.icon}
                    alt={media.platform}
                    className="w-5 h-5 brightness-0- invert-" // لجعل الأيقونة بيضاء لتتناسب مع الخلفية الملونة
                  />
                  <span className="text-[12px] font-black uppercase tracking-wider text-white">
                    {media.platform}
                  </span>
                </div>
              );
            })
          }
        </div>
      )}

      {/* Order & Form Section */}
      <div className='space-y-8 mb-20'>
        <OrderData
          purchases={[{
            product: product._id,
            quantity: quantity,
            client: client?._id,
            specification: hasInteracted ? activeSpecifications : (product.specifications[0] || null)
          }]}
        />

        <div className='sm:pr-4'>
          <InputForm clientForm={clientForm} setClientForm={setClientForm} />
        </div>

        <ProductActionPanel
          quantity={quantity} setQuantity={setQuantity}
          activeSpecifications={hasInteracted ? activeSpecifications : product.specifications[0]}
          purchase={purchase} setPurchase={setPurchase}
          cart={cart} product={product}
          clientForm={clientForm}
          setClientForm={setClientForm}
        />
      </div>

      {/* Modals & Overlays */}
      {evaluationSectionActive && (
        <EvaluationsSection
          evaluations={evaluations} setEvaluations={setEvaluations}
          newEvaluation={newEvaluation} setNewEvaluation={setNewEvaluation}
          evaluationSectionActive={evaluationSectionActive} setEvaluationSectionActive={setEvaluationSectionActive}
          product={product} addEvaluationActive={addEvaluationActive} setAddEvaluationActive={setAddEvaluationActive}
          editEvaluationActive={editEvaluationActive} setEditEvaluationActive={setEditEvaluationActive}
          clientCanRate={clientCanRate}
        />
      )}

      {addEvaluationActive && (
        <AddEvaluationCard
          addEvaluationActive={addEvaluationActive} setAddEvaluationActive={setAddEvaluationActive}
          newEvaluation={newEvaluation} setNewEvaluation={setNewEvaluation}
          evaluations={evaluations} setEvaluations={setEvaluations}
          evaluationSectionActive={evaluationSectionActive} setEvaluationSectionActive={setEvaluationSectionActive}
        />
      )}

      {editEvaluationActive && (
        <EditEvaluationCard
          editEvaluationActive={editEvaluationActive} setEditEvaluationActive={setEditEvaluationActive}
          evaluationToEdit={newEvaluation} setEvaluationToEdit={setNewEvaluation}
          evaluations={evaluations} setEvaluations={setEvaluations}
          evaluationSectionActive={evaluationSectionActive} setEvaluationSectionActive={setEvaluationSectionActive}
        />
      )}
    </div>
  );
};

export default ProductDetails;