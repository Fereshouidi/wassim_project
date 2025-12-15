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

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [colorsDispo, setColorsDispo] = useState<string[]>([]);
  const [sizessDispo, setSizesDispo] = useState<string[]>([]);
  const [typesDispo, setTypesDispo] = useState<string[]>([]);

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

    const colors = Array.from(
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

    const sizes = Array.from(
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


    const types = Array.from(
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


    setAvailableColors(colors);
    setAvailableSizes(sizes);
    setAvailableTypes(types);

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
        {
          product.name[activeLanguage.language] ?
            <h4 className='font-bold text-lg sm:text-xl'>
              {product.name[activeLanguage.language]}
            </h4>
            : <div className='w-[300px] h-7 rounded-sm'><SkeletonLoading /></div>
        }

        {
          activeSpecifications?.price ?
            <h2 className='font-extrabold text-2xl sm:text-3xl m-4'>
              {activeSpecifications.price + ' D.T'}
            </h2>
            : <div className='w-[100px] h-10 m-4 rounded-sm'><SkeletonLoading /></div>
        }

        <h4 className='font-bold text-md m-2'>{activeLanguage.nav.collections + " :"}</h4>

        <div className='w-full flex flex-wrap gap-2'>
          {
            loadingGettingCollection ?
              [1, 2, 3].map((x) => (
                <div key={x} className='w-[70px] h-7 m-1 rounded-sm'><SkeletonLoading /></div>
              ))
              : collections.map((collection => (
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
          }
        </div>

        <div className='client-select'>
            
            {
                availableColors.length > 0 && <div>
                    <h4 className='font-bold text-md m-2'>{activeLanguage.sideMatter.colors}</h4>
                    <div className='w-full flex flex-wrap gap-2'>
                    {
                        !loadingGettingProduct ?
                            availableColors.map((color) => (
                            <h4
                                key={color}
                                className='p-2 text-sm rounded-sm cursor-pointer'
                                style={{
                                backgroundColor: selectedColor === color ? colors.dark[150] : 'transparent',
                                border: `1px solid ${colors.light[250]}`,
                                color: selectedColor === color ? colors.light[200] : colors.dark[500],
                                opacity: availableColors.includes(color) ? 1 : 0.3,
                                }}
                                onClick={() => selectedColor != color ? setSelectedColor(color) : setSelectedColor('')}
                            >
                                {color}
                            </h4>
                            ))
                        :
                            [1,2,3].map((x) => (<div key={x} className='w-16 h-7'><SkeletonLoading/></div>))
                    }
                    </div>
                </div>
            }

            {
                availableSizes.length > 0 && <div>
                    <h4 className='font-bold text-md m-2'>{activeLanguage.sideMatter.sizes}</h4>
                    <div className='w-full flex flex-wrap gap-2'>
                    {
                        !loadingGettingProduct ? 
                            availableSizes.map((size) => (
                            <h4
                                key={size}
                                className='p-2 text-sm rounded-sm cursor-pointer'
                                style={{
                                backgroundColor: selectedSize === size ? colors.dark[150] : 'transparent',
                                border: `1px solid ${colors.light[250]}`,
                                color: selectedSize === size ? colors.light[200] : colors.dark[500],
                                opacity: availableSizes.includes(size) ? 1 : 0.3,
                                }}
                                onClick={() => selectedSize != size ? setSelectedSize(size) : setSelectedSize('')}
                            >
                                {size}
                            </h4>
                            ))
                        :
                            [1,2,3].map((x) => (<div key={x} className='w-16 h-7'><SkeletonLoading/></div>))
                    }
                    </div>
                </div>
            }


            {
                availableTypes?.length > 0 && <div>
                    <h4 className='font-bold text-md m-2'>{activeLanguage.sideMatter.types}</h4>
                    <div className='w-full flex flex-wrap gap-2'>
                    {
                        !loadingGettingProduct ?
                            availableTypes.map((type) => (
                            <h4
                                key={type}
                                className='p-2 text-sm rounded-sm cursor-pointer'
                                style={{
                                backgroundColor: selectedType === type ? colors.dark[150] : 'transparent',
                                border: `1px solid ${colors.light[250]}`,
                                color: selectedType === type ? colors.light[200] : colors.dark[500],
                                opacity: availableTypes.includes(type) ? 1 : 0.3,
                                }}
                                onClick={() => selectedType != type ? setSelectedType(type) : setSelectedType('')}
                            >
                                {type}
                            </h4>
                            ))
                        :
                            [1,2,3].map((x) => (<div key={x} className='w-16 h-7'><SkeletonLoading/></div>))
                    }
                    </div>
                </div>
            }


        </div>

        <p 
            className='p-2 sm:p-5 mt-2 sm:mt-5 text-md opacity-90 whitespace-pre-line'
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
          />
        </div>



      </div>
    </div>
  )
}

export default ProductDetails
