import { backEndUrl } from '@/api'
import { fakeProducts } from '@/constent/data'
import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { ClientFormType, CollectionType, ProductSpecification, ProductType } from '@/types'
import axios from 'axios'
import React, { CSSProperties, useEffect, useState } from 'react'
import SkeletonLoading from '../sub/SkeletonLoading'
import InputForm from './inputForm'
import ChoseQuantity from '../sub/choseQuantity'

type ProductDetailsType = {
  className?: string
  style: CSSProperties
  product: ProductType
  loadingGettingProduct: boolean
}

const ProductDetails = ({
  className,
  style,
  product,
  loadingGettingProduct
}: ProductDetailsType) => {

  const { activeLanguage } = useLanguage();
  const { colors } = useTheme();

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [activeSpecifications, setActiveSpecifications] = useState<ProductSpecification | null>(null);

  const [colorsDispo, setColorsDispo] = useState<string[]>([]);
  const [sizessDispo, setSizesDispo] = useState<string[]>([]);
  const [typesDispo, setTypesDispo] = useState<string[]>([]);

  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [loadingGettingCollection, setLoadingGettingCollection] = useState<boolean>(true);

  const [quantity, setQuantity] = useState<number>(1);

  const [clientForm, setClientForm] = useState<ClientFormType>({
    fullName: '',
    phone: NaN,
    adress: '',
    note: ''
  });

  useEffect(() => {
    if (
        product?.specifications &&
        product?.specifications?.length > 1
    ) return;
    setSelectedColor(product.specifications[0]?.color || null);
    setSelectedSize(product.specifications[0]?.size || null);
    setSelectedType(product.specifications[0]?.type || null);
  }, [product])

  useEffect(() => {
    if (!product?.specifications) return;

    const specs = product.specifications;

    const colors = Array.from(
      new Set(
        specs
          .filter(
            (s) =>
              (!selectedSize || s.size === selectedSize) &&
              (!selectedType || s.type === selectedType) &&
              s.quantity! > 0
          )
          .map((s) => s.color!)
      )
    );

    const sizes = Array.from(
      new Set(
        specs
          .filter(
            (s) =>
              (!selectedColor || s.color === selectedColor) &&
              (!selectedType || s.type === selectedType) &&
              s.quantity! > 0
          )
          .map((s) => s.size!)
      )
    );

    const types = Array.from(
      new Set(
        specs
          .filter(
            (s) =>
              (!selectedColor || s.color === selectedColor) &&
              (!selectedSize || s.size === selectedSize) &&
              s.quantity! > 0
          )
          .map((s) => s.type!)
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
  }, [selectedColor, selectedSize, selectedType, product]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoadingGettingCollection(true);
        const { data } = await axios.get(`${backEndUrl}/getCollectionsByProduct`, {
          params: { productId: product._id },
        });

        const filtered = data.collections.filter(
          (collection: CollectionType) =>
            collection.type === "public"
        );

        setCollections(filtered);
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
    console.log({ activeSpecifications });
  }, [activeSpecifications]);

  useEffect(() => {
    console.log({product});
    
  }, [product])

  return (
    <div
      className={`h-full p-5 overflow-y-scroll scrollbar-hidden ${className}`}
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
        <div className='w-full flex flex-row gap-2'>
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
                    <div className='w-full flex flex-row gap-2'>
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
                    <div className='w-full flex flex-row gap-2'>
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
                availableTypes.length > 0 && <div>
                    <h4 className='font-bold text-md m-2'>{activeLanguage.sideMatter.types}</h4>
                    <div className='w-full flex flex-row gap-2'>
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
            className='p-2 sm:p-5 mt-2 sm:mt-5 text-md opacity-90'
            style={{
                borderTop: `0.5px solid ${colors.light[300]}`,
                borderBottom: `0.5px solid ${colors.light[300]}`,
            }}
        >{product.description[activeLanguage.language]}</p>

        <InputForm
            clientForm={clientForm}
            setClientForm={setClientForm}
        />

        <div className='flex flex-row my-5 mx-2 gap-4'>

            <ChoseQuantity
                quantity={quantity}
                setQuantity={setQuantity}
                max={activeSpecifications?.quantity?? 1}
            />

            <button 
                className='flex flex-1 justify-center items-center w-12 h-12 rounded-sm cursor-pointer'
                style={{
                    backgroundColor: colors.dark[100],
                    color: colors.light[200]
                }}
            >acheter</button>

        </div>


      </div>
    </div>
  )
}

export default ProductDetails
