"use client";
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import React, { useEffect, useState } from 'react'
import { CollectionType, FiltrationType, OptionType } from '@/types';
import CustomSelectMany from '../customSelectMany';

type FilterCollectionProps = {
    allCollections: CollectionType[]
    filtrationCopy: FiltrationType
    setFiltrationCopy: (value: FiltrationType) => void
    defaultOptions?: string[]
}

const FilterCollection = ({
    allCollections,
    filtrationCopy,
    setFiltrationCopy,
    defaultOptions
}: FilterCollectionProps) => {

    const { activeLanguage } = useLanguage();
    const { colors } = useTheme();
    const [options, setOptions] = useState<OptionType[]>([]);
    
    const allOption: OptionType = {
        label: `${activeLanguage.sideMatter.all} ${activeLanguage.nav.collections}`, 
        value: "all"
    };

    const [currentOptions, setCurrentOptions] = useState<OptionType[]>([allOption]);

    useEffect(() => {
        const mappedOptions = allCollections.map(collection => ({
            label: collection.name[activeLanguage.language] ?? "", 
            value: collection._id ?? ""
        })) as OptionType[];

        setOptions([allOption, ...mappedOptions]);
    }, [allCollections, activeLanguage]);

    useEffect(() => {
        const hasAll = currentOptions.some(opt => opt.value === "all");
        
        const selectedIds = hasAll 
            ? allCollections.map(col => col._id ?? "") 
            : currentOptions.map(opt => opt.value);

        if (JSON.stringify(filtrationCopy.collections) !== JSON.stringify(selectedIds)) {
            setFiltrationCopy({
                ...filtrationCopy,
                collections: selectedIds
            });
        }
    }, [currentOptions]);

    useEffect(() => {
        if (!defaultOptions || defaultOptions.length === 0 || options.length <= 1) {
            setCurrentOptions([allOption]);
            return;
        }

        const isAllSelected = defaultOptions.length >= allCollections.length;

        if (isAllSelected) {
            setCurrentOptions([allOption]);
        } else {
            const selectedOptions = options.filter(opt => defaultOptions.includes(opt.value));
            if (selectedOptions.length > 0) {
                setCurrentOptions(selectedOptions);
            }
        }
    }, [defaultOptions, options]);

    return (
        <div className="w-full px-4- py-2- border-b" style={{ borderColor: colors.light[200] }}>
            <h4 
                className="text-[13px] font-black uppercase tracking-widest mb-3 opacity-80"
                style={{ color: colors.dark[100] }}
            >
                {activeLanguage.nav.collections}
            </h4>

            <CustomSelectMany
                label={activeLanguage.nav.collections}
                options={options}
                currentOptions={currentOptions}
                setCurrentOptions={setCurrentOptions}
            />
        </div>
    )
}

export default FilterCollection;