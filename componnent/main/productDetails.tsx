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
import ProductActionPanel from '../sub/ProductActionPanel/ProductActionPanel';
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
  const [clientCanRate, setClientCanRate] = useState<boolean>(false);

  // 1. مصدر البيانات الأساسي
  const allSpecs = useMemo(() => product.specifications || [], [product.specifications]);

  // 2. القيم الفريدة الكاملة (لكي لا تختفي الأزرار من الواجهة)
  const allSizes = useMemo(() => Array.from(new Set(allSpecs.map(s => s.size).filter(Boolean))), [allSpecs]);
  const allTypes = useMemo(() => Array.from(new Set(allSpecs.map(s => s.type).filter(Boolean))), [allSpecs]);

  // 3. الألوان المتاحة (تختفي الألوان التي لا تملك هذا المقاس أو النوع)
  const dynamicAvailableColors = useMemo(() => {
    return allSpecs
      .filter(s => 
        (!selectedSize || s.size === selectedSize) && 
        (!selectedType || s.type === selectedType) && 
        (s.quantity ?? 0) > 0
      )
      .map(s => s.color);
  }, [selectedSize, selectedType, allSpecs]);

  // 4. المقاسات والأنواع المتاحة (للتنسيق البصري فقط: تبهيت الزر)
  const availableSizesForContext = useMemo(() => 
    allSpecs
      .filter(s => 
        (!selectedColor || s.color === selectedColor) && 
        (!selectedType || s.type === selectedType) && 
        (s.quantity ?? 0) > 0
      )
      .map(s => s.size), 
  [selectedColor, selectedType, allSpecs]);

  const availableTypesForContext = useMemo(() => 
    allSpecs
      .filter(s => 
        (!selectedColor || s.color === selectedColor) && 
        (!selectedSize || s.size === selectedSize) && 
        (s.quantity ?? 0) > 0
      )
      .map(s => s.type), 
  [selectedColor, selectedSize, allSpecs]);

  // --- Handlers ---

  const handleColorSelect = (hex: string | null) => {
    const targetSpec = allSpecs.find(s => s.colorHex === hex);
    if (!targetSpec) return;

    const newColor = targetSpec.color ?? null;
    if (selectedColor === newColor) {
      setSelectedColor(null);
    } else {
      setSelectedColor(newColor);
      // تحديث الفهرس الخاص بالصورة
      const imageIndex = product.images.findIndex(img => (img.specification as ProductSpecification)?.colorHex === hex);
      if (imageIndex !== -1) setCurrentImageIndex(imageIndex);
    }
  };

  const handleSizeSelect = (size: string) => {
    if (selectedSize === size) {
      setSelectedSize(null);
    } else {
      setSelectedSize(size);
      // إذا كان اللون المختار غير متوافق مع المقاس الجديد، يتم إلغاء تحديده ليختفي من السلايدر
      const isColorStillAvailable = allSpecs.some(s => 
        s.size === size && s.color === selectedColor && (s.quantity ?? 0) > 0
      );
      if (!isColorStillAvailable) setSelectedColor(null);
    }
  };

  const handleTypeSelect = (type: string) => {
    if (selectedType === type) {
      setSelectedType(null);
    } else {
      setSelectedType(type);
      const isColorStillAvailable = allSpecs.some(s => 
        s.type === type && s.color === selectedColor && (s.quantity ?? 0) > 0
      );
      if (!isColorStillAvailable) setSelectedColor(null);
    }
  };

  // --- Effects ---
  useEffect(() => {
    // تحديد المواصفة النشطة بناءً على جميع الفلاتر
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

    if (!client?._id) return;
    console.log({ productId: product._id, clientId: client?._id })

    axios.get(`${backEndUrl}/verifyClientPurchase`, { params: { productId: product._id, clientId: client._id } })
      .then(({ data }) => {
        setClientCanRate( (data?.purchaseCount || 0) > 0 ? true : false);
        console.log(data);
      })
      .catch(err => console.error(err));

  }, [product._id, client?._id]);

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
        {clientCanRate && <button onClick={() => setAddEvaluationActive(true)} className='p-1.5 rounded-full transition-transform active:scale-90' style={{ backgroundColor: colors.dark[300] }}>
          <img src={activeTheme === "dark" ? "/icons/add-black.png" : "/icons/add-white.png"} className='w-3 h-3' alt="add" />
        </button>}
      </div>

      {/* اختيار الألوان: تختفي الألوان غير المتاحة للمقاس المختار */}
      {dynamicAvailableColors.length > 0 && (
        <div className='w-full mb-6'>
          <h4 className='font-bold text-sm mb-2' style={{ color: colors.dark[150] }}>{activeLanguage.sideMatter.colors} :</h4>
          <SpecificationsSlider 
            product={product.images} 
            availableColors={dynamicAvailableColors as string[]} 
            onColorSelect={handleColorSelect} 
            importedFrom="productDetails"
          />
        </div>
      )}

      {/* اختيار المقاسات: تظل ظاهرة ولكن تبهت إذا كانت غير متاحة للون الحالي */}
      {allSizes.length > 0 && (
        <div className='mb-6'>
          <h4 className='font-bold text-sm mb-2' style={{ color: colors.dark[150] }}>{activeLanguage.sideMatter.sizes} :</h4>
          <div className='flex flex-wrap gap-2'>
            {allSizes.map(size => {
              const isSelected = selectedSize === size;
              const isAvailable = availableSizesForContext.includes(size!);
              return (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size!)}
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

      {/* اختيار الأنواع */}
      {allTypes.length > 0 && (
        <div className='mb-6'>
          <h4 className='font-bold text-sm mb-2' style={{ color: colors.dark[150] }}>{activeLanguage.sideMatter.types || "Types"} :</h4>
          <div className='flex flex-wrap gap-2'>
            {allTypes.map(type => {
              const isSelected = selectedType === type;
              const isAvailable = availableTypesForContext.includes(type!);
              return (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type!)}
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






      {/* Evaluation Modals */}
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