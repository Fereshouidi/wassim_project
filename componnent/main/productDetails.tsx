import { backEndUrl } from '@/api'
import { fakeProducts } from '@/constent/data'
import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { CollectionType, ProductSpecification, ProductType } from '@/types'
import axios from 'axios'
import React, { CSSProperties, use, useEffect, useState } from 'react'
import SkeletonLoading from '../sub/SkeletonLoading'

type ProductDetailsType = {
    className?: string  
    style: CSSProperties
    product: ProductType
}
const ProductDetails = ({
    className,
    style,
    product
}: ProductDetailsType ) => {

    const { activeLanguage } = useLanguage();
    const { colors } = useTheme();

    const [activeSpecifications, setActiveSpecifications] = useState<ProductSpecification>({
        color: product.specifications[0]?.color || "",
        size: product.specifications[0]?.size || "",
        type: product.specifications[0]?.type || "",
        price: product.price || 0,
        quantity: product.specifications[0]?.quantity || 0,
    });

    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("");

    const [colorDispo, setColorDispo] = useState<string[]>([]);
    const [sizeDispo, setSizeDispo] = useState<string[]>([]);
    const [typeDispo, setTypeDispo] = useState<string[]>([]);

    const [collections, setCollections] = useState<CollectionType[]>([]);
    const [loadingGettingCollection, setLoadingGettingCollection] = useState<boolean>(true);

    const refresh = () => {
        let colors: string[] = [];
        let sizes: string[] = [];
        let types: string[] = [];
        product.specifications.forEach((spec) => {
            if (spec.color && !colors.includes(spec.color)) {
                colors.push(spec.color);
            }   
            if (spec.size && !sizes.includes(spec.size)) {
                sizes.push(spec.size);
            }
            if (spec.type && !types.includes(spec.type)) {
                types.push(spec.type);
            }
        });
        setColorDispo(colors);
        setSizeDispo(sizes);
        setTypeDispo(types);
    }

    useEffect(() => {
        setSelectedColor(activeSpecifications.color?? "");
        setSelectedSize(activeSpecifications.size?? "");
        setSelectedType(activeSpecifications.type?? "");
    }, [activeSpecifications])

    useEffect(() => {
        const activeSpecifications_ = product.specifications.find(specification => specification.price == product.price);
        activeSpecifications_ && setActiveSpecifications(activeSpecifications_)
        console.log(activeSpecifications_);
            
    }, [product])

    useEffect(() => {
        refresh();
    }, [product]);

    useEffect(() => {
        refresh();
        let spec = product.specifications.find((spec) => {
            return (
                (selectedColor ? spec.color === selectedColor : true) &&
                (selectedSize ? spec.size === selectedSize : true) &&
                (selectedType ? spec.type === selectedType : true)
            );
        });

        if (spec) {
            setActiveSpecifications(spec);
            // setPrice(spec.price || 0);
        } else {
            setSizeDispo(prev => prev.filter(zise => {
                return product.specifications.find(spec => {
                    return (
                        (selectedColor ? spec.color === selectedColor : true) &&
                        (spec.size === zise) &&
                        (selectedType ? spec.type === selectedType : true)
                    );
                })}));
            setTypeDispo(prev => prev.filter(type => {
                return product.specifications.find(spec => {
                    return (
                        (selectedColor ? spec.color === selectedColor : true) &&
                        (selectedSize ? spec.size === selectedSize : true) &&
                        (spec.type === type)
                    );
                })}));
        }

    }, [selectedColor]);

    useEffect(() => {
        refresh();
        let spec = product.specifications.find((spec) => {
            return (
                (selectedColor ? spec.color === selectedColor : true) &&
                (selectedSize ? spec.size === selectedSize : true) &&
                (selectedType ? spec.type === selectedType : true)
            );
        });

        if (spec) {
            setActiveSpecifications(spec);
            // setPrice(spec.price || 0);
        } else {
            setColorDispo(prev => prev.filter(color => {
                return product.specifications.find(spec => {
                    return (
                        (selectedColor ? spec.size === selectedSize : true) &&
                        (spec.color === color) &&
                        (selectedType ? spec.type === selectedType : true)
                    );
                })}));
            setTypeDispo(prev => prev.filter(type => {
                return product.specifications.find(spec => {
                    return (
                        (selectedColor ? spec.color === selectedColor : true) &&
                        (selectedSize ? spec.size === selectedSize : true) &&
                        (spec.type === type)
                    );
                })}));
        }

    }, [selectedSize]);

    useEffect(() => {
        refresh();
        let spec = product.specifications.find((spec) => {
            return (
                (selectedColor ? spec.color === selectedColor : true) &&
                (selectedSize ? spec.size === selectedSize : true) &&
                (selectedType ? spec.type === selectedType : true)
            );
        });

        if (spec) {
            setActiveSpecifications(spec);
            // setPrice(spec.price || 0);
        } else {
            setSizeDispo(prev => prev.filter(zise => {
                return product.specifications.find(spec => {
                    return (
                        (selectedColor ? spec.color === selectedColor : true) &&
                        (spec.size === zise) &&
                        (selectedType ? spec.type === selectedType : true)
                    );
                })}));
            setColorDispo(prev => prev.filter(color => {
                return product.specifications.find(spec => {
                    return (
                        (selectedColor ? spec.type === selectedType : true) &&
                        (selectedSize ? spec.size === selectedSize : true) &&
                        (spec.color === color)
                    );
                })}));
        }
    }, [selectedType]);


    useEffect(() => {
        const fetchCollections = async () => {
            try {
            setLoadingGettingCollection(true);

            const { data } = await axios.get(`${backEndUrl}/getCollectionsByProduct`, {
                params: { productId: product._id },
            });

            const filtered = data.collections.filter(
                (collection: CollectionType) =>
                collection.type === "public" || collection.type === "private"
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
        console.log({activeSpecifications});
        
    }, [activeSpecifications])

  return (
    <div 
        className={` p-5 ${className}`}
        style={{
            ...style
        }}
    >
      
      <div>
        {
            product.name[activeLanguage.language] ? 
                <h4 
                    className='font-bold text-lg sm:text-xl'
                >
                    {product.name[activeLanguage.language]}
                </h4>
            : <div className='w-[300px] h-7'><SkeletonLoading/></div>
        }

        {
            activeSpecifications.price ? 
                <h2 
                    className='font-extrabold text-2xl sm:text-3xl m-4'
                >
                    {activeSpecifications.price + ' D.T'}
                </h2>
            : <div className='w-[100px] h-10 m-4'><SkeletonLoading/></div>
        }

        <h4 className='font-bold text-lg sm:text-xl mx-2 my-4'>{activeLanguage.nav.collections + " :"}</h4>
        <div className='w-full flex flex-row gap-2'>{
            loadingGettingCollection ?
            [1,2,3,].map((x) => (
                <div key={x} className='w-[70px] h-7 m-1'><SkeletonLoading/></div>
            ))
            :collections.map((collection => (
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
        }</div>

        <h4 className='font-bold text-lg sm:text-xl mx-2 my-4'>{activeLanguage.sideMatter.colors}</h4>
        <div className='w-full flex flex-row gap-2'>{
            !product.specifications ?
                [1,2,3,].map((x) => (
                    <div key={x} className='w-[70px] h-7 m-1'><SkeletonLoading/></div>
                ))
            :colorDispo.map((color => (
                    <h4
                        key={color}
                        className='p-2 text-sm rounded-sm cursor-pointer'
                        style={{
                            backgroundColor: selectedColor == color ? colors.dark[150] : 'transparent' ,
                            border: `1px solid ${colors.light[250]}`,
                            color: selectedColor == color ? colors.light[200] : colors.dark[500] ,
                        }}
                        onClick={() => setSelectedColor(color)}
                    >
                        {color}
                    </h4>
                )))
        }</div>

        <h4 className='font-bold text-lg sm:text-xl mx-2 my-4'>{activeLanguage.sideMatter.sizes}</h4>
        <div className='w-full flex flex-row gap-2'>{
            !product.specifications ?
                [1,2,3,].map((x) => (
                    <div key={x} className='w-[70px] h-7 m-1'><SkeletonLoading/></div>
                ))
            :sizeDispo.map((size => (
                    <h4
                        key={size}
                        className='p-2 text-sm rounded-sm cursor-pointer'
                        style={{
                            backgroundColor: selectedSize == size ? colors.dark[150] : 'transparent' ,
                            border: `1px solid ${colors.light[250]}`,
                            color: selectedSize == size ? colors.light[200] : colors.dark[500] ,
                        }}
                        onClick={() => setSelectedSize(size)}
                    >
                        {size}
                    </h4>
                )))
        }</div>

        <h4 className='font-bold text-lg sm:text-xl mx-2 my-4'>{activeLanguage.sideMatter.types}</h4>
        <div className='w-full flex flex-row gap-2'>{
            !product.specifications ?
                [1,2,3,].map((x) => (
                    <div key={x} className='w-[70px] h-7 m-1'><SkeletonLoading/></div>
                ))
            :typeDispo.map((type => (
                    <h4
                        key={type}
                        className='p-2 text-sm rounded-sm cursor-pointer'
                        style={{
                            backgroundColor: selectedType == type ? colors.dark[150] : 'transparent' ,
                            border: `1px solid ${colors.light[250]}`,
                            color: selectedType == type ? colors.light[200] : colors.dark[500] ,
                        }}
                        onClick={() => setSelectedSize(type)}
                    >
                        {type}
                    </h4>
                )))
        }</div>

      </div>

    </div>
  )
}

export default ProductDetails
