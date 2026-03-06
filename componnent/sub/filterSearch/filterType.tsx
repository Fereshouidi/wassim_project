"use client";
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import React, { useEffect, useState, useMemo } from 'react'
import { FiltrationType, OptionType } from '@/types';
import CustomSelectMany from '../customSelectMany';

type FilterTypeProps = {
    availableType: string[]
    filtrationCopy: FiltrationType
    setFiltrationCopy: (value: FiltrationType) => void
    defaultOptions?: string[]
}

const FilterType = ({
    availableType,
    filtrationCopy,
    setFiltrationCopy,
    defaultOptions
}: FilterTypeProps) => {

    const { activeLanguage } = useLanguage();
    const { colors } = useTheme();

    // إنشاء الخيارات مع خيار "الكل" بشكل ثابت في البداية
    const options: OptionType[] = useMemo(() => [
        {
            label: `${activeLanguage.sideMatter.all} ${activeLanguage.sideMatter.types}`, 
            value: "all"
        },
        ...availableType.map(type => ({
            label: type ?? "",
            value: type ?? ""
        }))
    ], [availableType, activeLanguage]);

    const [currentOptions, setCurrentOptions] = useState<OptionType[]>([]);

    // مزامنة الحالة مع الخيارات الافتراضية عند تحميل المكون
    useEffect(() => {
        if (!defaultOptions || defaultOptions.length === 0 || options.length <= 1) {
            setCurrentOptions([options[0]]);
            return;
        }

        const isAllSelected = defaultOptions.includes("all") || defaultOptions.length === availableType.length;

        if (isAllSelected) {
            setCurrentOptions([options[0]]);
        } else {
            const mapped = options.filter(opt => defaultOptions.includes(opt.value));
            setCurrentOptions(mapped.length > 0 ? mapped : [options[0]]);
        }
    }, [defaultOptions, options]);

    // تحديث الحالة في المكون الأب عند تغيير الاختيارات
    useEffect(() => {
        const hasAll = currentOptions.some(opt => opt.value === "all");
        
        /**
         * لضمان ظهور المنتجات بشكل صحيح:
         * إذا اختار المستخدم "all"، نرسل مصفوفة فارغة [].
         * السيرفر سيفهم أن الفلتر غير نشط ولن يطبق أي قيود إضافية.
         */
        const selectedValues = hasAll ? [] : currentOptions.map(opt => opt.value);
        
        if (JSON.stringify(selectedValues) !== JSON.stringify(filtrationCopy.types)) {
            setFiltrationCopy({
                ...filtrationCopy,
                types: selectedValues
            });
        }
    }, [currentOptions]);

    return (
        <div className="w-full py-2 border-b" style={{ borderColor: colors.light[200] }}>
            <h4 
                className="text-[13px] font-black uppercase tracking-widest mb-3 opacity-80"
                style={{ color: colors.dark[100] }}
            >
                {activeLanguage.sideMatter.types}
            </h4>

            <CustomSelectMany
                label={activeLanguage.sideMatter.types}
                options={options}
                currentOptions={currentOptions}
                setCurrentOptions={setCurrentOptions}
            />
        </div>
    )
}

export default FilterType;