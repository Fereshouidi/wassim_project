"use client";

import React, { useMemo, useState, useEffect, CSSProperties } from 'react';
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
import { calculateRatingStats, handleShareOnFacebook } from '@/lib';

// Sub Components
import SkeletonLoading from '../sub/SkeletonLoading';
import ProductActionPanel from '../sub/ProductActionPanel';
import StarsRatingDisplay from '../sub/StarsRatingDisplay';
import AddEvaluationCard from '../sub/addEvaluationCard';
import EditEvaluationCard from '../sub/editEvaluationCard';
import EvaluationsSection from './evaluationSection';
import InputForm from './inputForm';
import SpecificationsSlider from '../sub/specificationsSlider';
import OrderData from './OrderData';

type ProductDetailsType = {
  className?: string;
  style?: CSSProperties;
  product: ProductType;
  currentImageIndex: number;
  setCurrentImageIndex: (value: number) => void;
  loadingGettingProduct: boolean;
  quantity: number;
  setQuantity: (value: number) => void;
  activeSpecifications: ProductSpecification;
  setActiveSpecifications: (value: ProductSpecification) => void;
  collections: CollectionType[];
  purchase: PurchaseType;
  setPurchase: (value: PurchaseType) => void;
  cart: CartType;
  onSpecificationChange?: (index: number) => void;
  loadingGettingCollection?: boolean;
  clientForm: any, 
  setClientForm: (value: any) => void
};

const ProductDetails = ({
  className, style, product, currentImageIndex, setCurrentImageIndex,
  quantity, setQuantity, activeSpecifications, setActiveSpecifications,
  collections, purchase, setPurchase, cart, onSpecificationChange,
  loadingGettingCollection, clientForm, setClientForm
}: ProductDetailsType) => {

  const { screenWidth } = useScreen();
  const { activeLanguage } = useLanguage();
  const { colors, activeTheme } = useTheme();
  const { ownerInfo } = useOwner();
  const { client } = useClient();

  // --- States ---
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const [evaluations, setEvaluations] = useState<EvaluationType[]>([]);
  const [evaluationSectionActive, setEvaluationSectionActive] = useState(false);
  const [addEvaluationActive, setAddEvaluationActive] = useState(false);
  const [editEvaluationActive, setEditEvaluationActive] = useState(false);
  const [newEvaluation, setNewEvaluation] = useState<EvaluationType>({});

  // 1. استخدام المواصفات من المنتج مباشرة
  const allSpecs = useMemo(() => product.specifications || [], [product.specifications]);

  // 2. تجميع القيم الفريدة
  const allColors = useMemo(() => Array.from(new Set(allSpecs.map(s => s.color).filter(Boolean))), [allSpecs]);
  const allSizes = useMemo(() => Array.from(new Set(allSpecs.map(s => s.size).filter(Boolean))), [allSpecs]);
  const allTypes = useMemo(() => Array.from(new Set(allSpecs.map(s => s.type).filter(Boolean))), [allSpecs]);

  // 3. منطق التوافر الذكي
  const availableColors = useMemo(() => allSpecs
    .filter(s => (!selectedSize || s.size === selectedSize) && (!selectedType || s.type === selectedType) && (s.quantity ?? 0) > 0)
    .map(s => s.color), [selectedSize, selectedType, allSpecs]);

  const availableSizes = useMemo(() => allSpecs
    .filter(s => (!selectedColor || s.color === selectedColor) && (!selectedType || s.type === selectedType) && (s.quantity ?? 0) > 0)
    .map(s => s.size), [selectedColor, selectedType, allSpecs]);

  const availableTypes = useMemo(() => allSpecs
    .filter(s => (!selectedColor || s.color === selectedColor) && (!selectedSize || s.size === selectedSize) && (s.quantity ?? 0) > 0)
    .map(s => s.type), [selectedColor, selectedSize, allSpecs]);

  // --- Effects ---
  useEffect(() => {
    if (purchase?.specification) {
      // @ts-ignore
      setSelectedColor(purchase?.specification?.color ?? null);
      // @ts-ignore
      setSelectedSize(purchase?.specification?.size ?? null);
      // @ts-ignore
      setSelectedType(purchase?.specification?.type ?? null);
    }
  }, [product._id]);

  useEffect(() => {
    const matched = allSpecs.find(s => 
      (!selectedColor || s.color === selectedColor) && 
      (!selectedSize || s.size === selectedSize) &&
      (!selectedType || s.type === selectedType)
    ) as ProductSpecification;
    setActiveSpecifications(matched || null);
  }, [selectedColor, selectedSize, selectedType, allSpecs, setActiveSpecifications]);

  useEffect(() => {
    if (!product._id) return;
    axios.get(`${backEndUrl}/getEvaluationByProduct`, { params: { productId: product._id } })
      .then(({ data }) => setEvaluations(data.evaluations || []))
      .catch(err => console.error(err));
  }, [product._id]);

  return (
    <div className={`h-full overflow-y-auto scrollbar-hidden p-5 ${screenWidth > 1000 ? "w-[50%]" : "w-full"} ${className}`} style={style}>
      
      <section>
        <h1 className='font-bold text-xl sm:text-2xl opacity-90' style={{ color: colors.dark[150] }}>
          {product.name[activeLanguage.language]}
        </h1>
        <h2 className='font-semibold text-3xl my-3' style={{ color: colors.dark[150] }}>
          {activeSpecifications?.price || product.price || 0} <span className="text-sm font-medium opacity-60">D.T</span>
        </h2>
      </section>

      <div className='flex items-center gap-4 py-2 mb-4'>
        <div className='flex items-center gap-1 cursor-pointer' onClick={() => setEvaluationSectionActive(true)}>
          <StarsRatingDisplay rating={calculateRatingStats(evaluations).average} />
          <p className='text-xs opacity-50 underline'>( {evaluations.length} {activeLanguage?.opinion} )</p>
        </div>
        <button onClick={() => setAddEvaluationActive(true)} className='p-1.5 rounded-full transition-transform active:scale-90' style={{ backgroundColor: colors.dark[300] }}>
          <img src={activeTheme === "dark" ? "/icons/add-black.png" : "/icons/add-white.png"} className='w-3 h-3' alt="add" />
        </button>
      </div>

      <div className="mb-6">
        <h4 className='font-bold text-sm mb-2' style={{ color: colors.dark[150] }}>{activeLanguage.nav.collections} :</h4>
        <div className='flex flex-wrap gap-2'>
          {loadingGettingCollection ? [1, 2].map(i => <SkeletonLoading key={i}/>) :
            collections?.map(c => (
              <span key={c._id} className="px-3 py-1 text-xs rounded-full border" style={{ backgroundColor: colors.light[250], color: colors.dark[500], borderColor: colors.dark[500] + '20' }}>
                {c.name[activeLanguage.language]}
              </span>
            ))
          }
        </div>
      </div>

      {availableColors.length > 1 && <div className='w-full mb-6'>
        <h4 className='font-bold text-sm mb-2' style={{ color: colors.dark[150] }}>{activeLanguage.sideMatter.colors} :</h4>
        <SpecificationsSlider 
          product={product.images} 
          // selectedColor={selectedColor}
          availableColors={availableColors as string[]} 
          onColorSelect={(hex) => {
            const targetSpec = allSpecs.find(s => s.colorHex === hex);
            if (targetSpec) {
                const newColor = targetSpec.color ?? null;
                if (selectedColor === newColor) {
                    setSelectedColor(null);
                    setCurrentImageIndex(0); 
                } else {
                    setSelectedColor(newColor);
                    const imageIndex = product.images.findIndex(img => (img.specification as ProductSpecification)?.colorHex === hex);
                    if (imageIndex !== -1) setCurrentImageIndex(imageIndex);
                }
            } else {
                setSelectedColor(null);
                setCurrentImageIndex(0);
            }
          }} 
          importedFrom="productDetails"
        />
      </div>}

      {allSizes.length > 0 && (
        <div className='mb-6'>
          <h4 className='font-bold text-sm mb-2' style={{ color: colors.dark[150] }}>{activeLanguage.sideMatter.sizes} :</h4>
          <div className='flex flex-wrap gap-2'>
            {allSizes.map(size => {
              const isAvailable = availableSizes.includes(size!);
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  disabled={!isAvailable}
                  onClick={() => setSelectedSize(isSelected ? null : size!)}
                  className={`px-4 py-2 text-xs font-bold rounded border transition-all duration-300 ${isSelected ? 'scale-105' : ''}`}
                  style={{ 
                      backgroundColor: isSelected ? colors.dark[150] : 'transparent',
                      color: isSelected ? colors.light[100] : colors.dark[150],
                      borderColor: colors.dark[150],
                      opacity: isAvailable ? 1 : 0.3,
                      textDecoration: isAvailable ? 'none' : 'line-through'
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {allTypes.length > 0 && (
        <div className='mb-6'>
          <h4 className='font-bold text-sm mb-2' style={{ color: colors.dark[150] }}>{activeLanguage.sideMatter.types || "Types"} :</h4>
          <div className='flex flex-wrap gap-2'>
            {allTypes.map(type => {
              const isAvailable = availableTypes.includes(type!);
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  disabled={!isAvailable}
                  onClick={() => setSelectedType(isSelected ? null : type!)}
                  className={`px-4 py-2 text-xs font-bold rounded border transition-all duration-300 ${isSelected ? 'scale-105' : ''}`}
                  style={{ 
                      backgroundColor: isSelected ? colors.dark[150] : 'transparent',
                      color: isSelected ? colors.light[100] : colors.dark[150],
                      borderColor: colors.dark[150],
                      opacity: isAvailable ? 1 : 0.3,
                      textDecoration: isAvailable ? 'none' : 'line-through' 
                  }}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <article className='my-6 py-6 border-t border-b' style={{ borderColor: colors.dark[150] + '20' }}>
        <p className='text-sm opacity-80 whitespace-pre-line' style={{ color: colors.dark[150] }}>
          {product.description[activeLanguage.language]}
        </p>
      </article>

      <div className='flex flex-col gap-6 my-5'>
        <OrderData
          purchases={[{
            product: product._id,
            quantity: quantity,
            client: client?._id,
            specification: activeSpecifications
          }]}
        />
        <InputForm clientForm={clientForm} setClientForm={setClientForm} />
      </div>

      <ProductActionPanel
        quantity={quantity} setQuantity={setQuantity}
        activeSpecifications={activeSpecifications}
        purchase={purchase} setPurchase={setPurchase}
        cart={cart} product={product}
        clientForm={clientForm}
        setClientForm={setClientForm}
      />

      <div className='flex justify-center gap-4 mt-8'>
        {ownerInfo?.socialMedia?.map((media) => (
          <img 
            key={media.platform} 
            src={media.icon} 
            className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform opacity-80 hover:opacity-100"
            onClick={() => media.platform === "Facebook" && handleShareOnFacebook(window.location.href)}
            alt={media.platform}
          />
        ))}
      </div>

      {/* Evaluation Modals */}
      {evaluationSectionActive && (
        <EvaluationsSection
          evaluations={evaluations} setEvaluations={setEvaluations}
          newEvaluation={newEvaluation} setNewEvaluation={setNewEvaluation}
          evaluationSectionActive={evaluationSectionActive} setEvaluationSectionActive={setEvaluationSectionActive}
          product={product} addEvaluationActive={addEvaluationActive} setAddEvaluationActive={setAddEvaluationActive}
          editEvaluationActive={editEvaluationActive} setEditEvaluationActive={setEditEvaluationActive}
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