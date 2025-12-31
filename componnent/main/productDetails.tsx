import { backEndUrl } from '@/api'
import { fakeProducts } from '@/constent/data'
import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { CartType, ClientFormType, CollectionType, ProductSpecification, ProductType, PurchaseType } from '@/types'
import axios from 'axios'
import React, { CSSProperties, useEffect, useState } from 'react'
import SkeletonLoading from '../sub/SkeletonLoading'
import InputForm from './inputForm'
import ChoseQuantity from '../sub/choseQuantity'
import { useScreen } from '@/contexts/screenProvider'
import ProductActionPanel from '../sub/ProductActionPanel'
import { handleShareOnFacebook } from '@/lib'
import { useOwner } from '@/contexts/ownerInfo'

type ProductDetailsType = {
  className?: string
  style: CSSProperties
  product: ProductType
  loadingGettingProduct: boolean
  quantity: number,
  setQuantity: (value: number) => void
  activeSpecifications: ProductSpecification | undefined | null
  setActiveSpecifications: (value: ProductSpecification | undefined | null) =>void
  collections: CollectionType[],
  setCollections: (value: CollectionType[]) => void
  loadingGettingCollection: boolean
  setLoadingGettingCollection: (value: boolean) => void
  purchase: PurchaseType
  setPurchase: (value: PurchaseType) => void
  cart: CartType
}

const ProductDetails = ({
  className,
  style,
  product,
  loadingGettingProduct,
  quantity,
  setQuantity,
  activeSpecifications,
  setActiveSpecifications,
  collections,
  setCollections,
  loadingGettingCollection, 
  setLoadingGettingCollection,
  purchase,
  setPurchase,
  cart
}: ProductDetailsType) => {

  const { screenWidth } = useScreen();
  const { activeLanguage } = useLanguage();
  const { colors } = useTheme();
  const [firstRender, setFirstRender] = useState<boolean>(true);
  const { ownerInfo } = useOwner();

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // All possible values (to display)
  const [allColors, setAllColors] = useState<string[]>([]);
  const [allSizes, setAllSizes] = useState<string[]>([]);
  const [allTypes, setAllTypes] = useState<string[]>([]);

  // Available values (for availability check)
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);


  useEffect(() => {

    if (!firstRender) return;
    if (!purchase || !purchase.cart) {
        return;
    }

    const spec = purchase.specification || product.specifications[0];

    // @ts-ignore
    setSelectedColor(spec?.color ?? null);
    // @ts-ignore
    setSelectedSize(spec?.size ?? null);
    // @ts-ignore
    setSelectedType(spec?.type ?? null);

    setFirstRender(false);


  }, [product, purchase])

  useEffect(() => {
    console.log({selectedColor});
    
  }, [selectedColor])

  useEffect(() => {
    if (!product?.specifications) return;

    if (purchase.order) {
      setSelectedColor(null);
      setSelectedSize(null);
      setSelectedType(null)
    }

    const specs = product.specifications;

    // Get ALL possible values (to display all options)
    const allColorsSet = Array.from(
      new Set(
        specs
          .map((s) => s.color ?? "")
          .filter((c) => c !== "")
      )
    );

    const allSizesSet = Array.from(
      new Set(
        specs
          .map((s) => s.size ?? "")
          .filter((sz) => sz !== "")
      )
    );

    const allTypesSet = Array.from(
      new Set(
        specs
          .map((s) => s.type ?? "")
          .filter((t) => t !== "")
      )
    );

    setAllColors(allColorsSet);
    setAllSizes(allSizesSet);
    setAllTypes(allTypesSet);

    // Get AVAILABLE values based on current selection
    const availableColorsSet = Array.from(
      new Set(
        specs
          .filter(
            (s) =>
              (!selectedSize || s.size === selectedSize) &&
              (!selectedType || s.type === selectedType) &&
              (s.quantity ?? 0) > 0
          )
          .map((s) => s.color ?? "")
          .filter((c) => c !== "")
      )
    );

    const availableSizesSet = Array.from(
      new Set(
        specs
          .filter(
            (s) =>
              (!selectedColor || s.color === selectedColor) &&
              (!selectedType || s.type === selectedType) &&
              (s.quantity ?? 0) > 0
          )
          .map((s) => s.size ?? "")
          .filter((sz) => sz !== "")
      )
    );

    const availableTypesSet = Array.from(
      new Set(
        specs
          .filter(
            (s) =>
              (!selectedColor || s.color === selectedColor) &&
              (!selectedSize || s.size === selectedSize) &&
              (s.quantity ?? 0) > 0
          )
          .map((s) => s.type ?? "")
          .filter((t) => t !== "")
      )
    );

    setAvailableColors(availableColorsSet);
    setAvailableSizes(availableSizesSet);
    setAvailableTypes(availableTypesSet);

    const matched = specs.find(
      (s) =>
        (!selectedColor || s.color === selectedColor) &&
        (!selectedSize || s.size === selectedSize) &&
        (!selectedType || s.type === selectedType)
    );

    if (matched) setActiveSpecifications(matched);
  }, [selectedColor, selectedSize, selectedType, product, purchase]);


  return (
    <div
      className={` h-full max-w-[600px]- sm:w-[650px]- min-w-full sm:min-w-[500px] bg-green-500- overflow-y-scroll scrollbar-hidden p-5 ${screenWidth > 1000 ? "overflow-y-scroll scrollbar-hidden max-w-[45%]" : "overflow-y-scroll scrollbar-hidden"} ${className}`}
      style={{
        ...style
      }}
    >
      <div>
        { screenWidth > 1000 ?
          product.name[activeLanguage.language] ?
            <h4 className='font-bold text-lg sm:text-xl'>
              {product.name[activeLanguage.language]}
            </h4>
            : <div className='w-[300px] h-7 rounded-sm'><SkeletonLoading /></div>
          : null
        }

        {
          activeSpecifications?.price ?
            <h2 className='font-extrabold text-2xl sm:text-3xl m-4'>
              {activeSpecifications.price + ' D.T'}
            </h2>
            : <div className='w-[100px] h-10 m-4 rounded-sm'><SkeletonLoading /></div>
        }

        <div className={`w-full flex ${collections.length == 0 ? "flex-row items-center" : "flex-col"}`}>

          <h4 className='font-bold whitespace-nowrap text-md m-1'>{activeLanguage.nav.collections + " : "}</h4>

          <div className='w-full flex flex-wrap gap-1 my-2 pl-2'>
            {
              loadingGettingCollection ?
                [1, 2, 3].map((x) => (
                  <div key={x} className='w-[70px] h-7 m-1- rounded-sm'><SkeletonLoading /></div>
                ))
                : collections?.length > 0 ? collections.map((collection => (
                  <h4
                    key={collection._id}
                    className='p-2 text-sm rounded-sm'
                    style={{
                      backgroundColor: colors.light[250],
                      color: colors.dark[500]
                    }}
                  >
                    {collection.name[activeLanguage.language]}
                  </h4>
                )))
                : <h4>null</h4>
            }
          </div>
        </div>


        <div className='client-select flex flex-col gap-2'>
            
            {
                allColors.length > 0 && <div className={`${allColors.length > 2 ? "flex flex-col" : "flex flex-row"}`}>
                    <h4 className='w-fit bg-red-500- whitespace-nowrap overflow-hidden- text-ellipsis- font-bold text-md m-2'>{activeLanguage.sideMatter.colors + " : "}</h4>
                    <div className='w-full flex flex-wrap gap-2  pl-2'>
                    {
                        !loadingGettingProduct ?
                            allColors.map((color) => {
                                const isAvailable = availableColors.includes(color);
                                const isSelected = selectedColor === color;
                                
                                return (
                                    <h4
                                        key={color}
                                        className='p-2  min-w-14 text-center text-sm rounded-sm cursor-pointer transition-all'
                                        style={{
                                            backgroundColor: isSelected ? colors.dark[150] : 'transparent',
                                            border: `1px solid ${colors.light[250]}`,
                                            color: isSelected ? colors.light[200] : colors.dark[500],
                                            opacity: isAvailable ? 1 : 0.3,
                                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                                            textDecoration: !isAvailable ? 'line-through' : 'none'
                                        }}
                                        onClick={() => {
                                            if (isAvailable) {
                                                selectedColor !== color ? setSelectedColor(color) : setSelectedColor(null);
                                            }
                                        }}
                                    >
                                        {color}
                                    </h4>
                                );
                            })
                        :
                            [1,2,3].map((x) => (<div key={x} className='w-16 h-7'><SkeletonLoading/></div>))
                    }
                    </div>
                </div>
            }

            {
                allSizes.length > 0 && <div className={`${allColors.length > 2 ? "flex flex-col" : "flex flex-row"}`}>
                    <h4 className='font-bold text-md whitespace-nowrap m-2'>{activeLanguage.sideMatter.sizes + " : "}</h4>
                    <div className='w-full flex flex-wrap gap-2  pl-2'>
                    {
                        !loadingGettingProduct ? 
                            allSizes.map((size) => {
                                const isAvailable = availableSizes.includes(size);
                                const isSelected = selectedSize === size;
                                
                                return (
                                    <h4
                                        key={size}
                                        className='p-2 min-w-14 text-center text-sm rounded-sm cursor-pointer transition-all'
                                        style={{
                                            backgroundColor: isSelected ? colors.dark[150] : 'transparent',
                                            border: `1px solid ${colors.light[250]}`,
                                            color: isSelected ? colors.light[200] : colors.dark[500],
                                            opacity: isAvailable ? 1 : 0.3,
                                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                                            textDecoration: !isAvailable ? 'line-through' : 'none'
                                        }}
                                        onClick={() => {
                                            if (isAvailable) {
                                                selectedSize !== size ? setSelectedSize(size) : setSelectedSize(null);
                                            }
                                        }}
                                    >
                                        {size}
                                    </h4>
                                );
                            })
                        :
                            [1,2,3].map((x) => (<div key={x} className='w-16 h-7'><SkeletonLoading/></div>))
                    }
                    </div>
                </div>
            }


            {
                allTypes?.length > 0 && <div className={`${allColors.length > 2 ? "flex flex-col" : "flex flex-row"}`}>
                    <h4 className='font-bold whitespace-nowrap text-md m-2'>{activeLanguage.sideMatter.types + " : "}</h4>
                    <div className='w-full flex flex-wrap gap-2  pl-5'>
                    {
                        !loadingGettingProduct ?
                            allTypes.map((type) => {
                                const isAvailable = availableTypes.includes(type);
                                const isSelected = selectedType === type;
                                
                                return (
                                    <h4
                                        key={type}
                                        className='p-2  min-w-14 text-center text-sm rounded-sm cursor-pointer transition-all'
                                        style={{
                                            backgroundColor: isSelected ? colors.dark[150] : 'transparent',
                                            border: `1px solid ${colors.light[250]}`,
                                            color: isSelected ? colors.light[200] : colors.dark[500],
                                            opacity: isAvailable ? 1 : 0.3,
                                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                                            textDecoration: !isAvailable ? 'line-through' : 'none'
                                        }}
                                        onClick={() => {
                                            if (isAvailable) {
                                                selectedType !== type ? setSelectedType(type) : setSelectedType(null);
                                            }
                                        }}
                                    >
                                        {type}
                                    </h4>
                                );
                            })
                        :
                            [1,2,3].map((x) => (<div key={x} className='w-16 h-7'><SkeletonLoading/></div>))
                    }
                    </div>
                </div>
            }


        </div>

        <p 
            className='p-5 sm:p-5 mt-5 sm:mt-5 text-md opacity-90 whitespace-pre-line'
            style={{
                borderTop: `0.5px solid ${colors.light[300]}`,
                borderBottom: `0.5px solid ${colors.light[300]}`,
            }}
        >{product.description[activeLanguage.language]}</p>

        {/* <InputForm
            clientForm={clientForm}
            setClientForm={setClientForm}
        /> */}

        <div className='my-5'>
          <ProductActionPanel
            quantity={quantity}
            setQuantity={setQuantity}
            activeSpecifications={activeSpecifications}
            purchase={purchase}
            setPurchase={setPurchase}
            cart={cart}
            product={product}
          />
        </div>

              <div className='w-full flex flex-row justify-center items-center gap-2 mt-10'>
                {screenWidth < 1000 && ownerInfo?.socialMedia?.map((media) => (
                  <img 
                    key={media.platform}
                    src={media.icon}
                    onClick={() => {
                      media.platform == "Facebook" ? handleShareOnFacebook(window.location.href)
                      : null
                    }}
                    className="w-8 h-8 cursor-pointer bg-red-500-"
                  />
                ))}
              </div>



      </div>
    </div>
  )
}

export default ProductDetails