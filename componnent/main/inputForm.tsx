"use client";

import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider';
import { ClientFormType } from '@/types';
import React from 'react'

type InputFormType = {
    clientForm: ClientFormType,
    setClientForm: (value: ClientFormType) => void
}

const InputForm = ({ clientForm, setClientForm }: InputFormType) => {
    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();

    const handleInputPhone = (phone: string) => {
        if (phone.length > 8 || isNaN(Number(phone))) return;
        setClientForm({...clientForm, phone: phone})
    }

    // أزلنا w-full من هنا لنتمكن من التحكم في العرض عبر الحاوية
    const inputClasses = `
        rounded-xl text-[13px] px-3 transition-colors outline-none
        border focus:border-black placeholder:opacity-70 flex-1
    `;
    
    const dynamicStyle = {
        borderColor: colors.light[350],
        backgroundColor: activeTheme === 'dark' ? 'transparent' : '#fff',
        color: colors.dark[100],
    };

    return (
        <div className='w-full'>
             <h4 className="text-[10px] uppercase font-black tracking-widest opacity-70 mb-3">
                {activeLanguage.sideMatter.fillOutTheForm}
             </h4>

            {/* تم تغيير flex-col إلى flex-row مع flex-wrap */}
            <div className='flex flex-row flex-wrap gap-3'>
                <input 
                    type="text" 
                    value={clientForm.fullName}
                    placeholder={activeLanguage.sideMatter.fullName}
                    className={`${inputClasses} h-14 min-w-[200px]`}
                    style={dynamicStyle}
                    onChange={(e) => setClientForm({...clientForm, fullName: e.target.value})}
                />
                <input 
                    type="tel" 
                    value={clientForm.phone}
                    placeholder={activeLanguage.sideMatter.phone}
                    className={`${inputClasses} h-14 min-w-[150px]`}
                    style={dynamicStyle}
                    onChange={(e) => handleInputPhone(e.target.value)}
                />
                <input 
                    type="text" 
                    value={clientForm.address}
                    placeholder={activeLanguage.sideMatter.address}
                    className={`${inputClasses} h-14 w-full min-w-full`} // العنوان غالباً يحتاج عرضاً كاملاً
                    style={dynamicStyle}
                    onChange={(e) => setClientForm({...clientForm, address: e.target.value})}
                />
                <textarea 
                    value={clientForm.note}
                    placeholder={`${activeLanguage.sideMatter.note} (${activeLanguage.recommended})`}
                    className={`${inputClasses} py-2 h-32 resize-none w-full min-w-full`}
                    style={dynamicStyle}
                    onChange={(e) => setClientForm({...clientForm, note: e.target.value})}
                />
            </div>
        </div>
    )
}

export default InputForm;