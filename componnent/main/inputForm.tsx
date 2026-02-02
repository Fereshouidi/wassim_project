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

    const inputClasses = `
        w-full rounded-xl text-[13px] px-3 transition-colors outline-none
        border focus:border-black placeholder:opacity-40
    `;
    
    const dynamicStyle = {
        borderColor: colors.light[300],
        backgroundColor: activeTheme === 'dark' ? 'transparent' : '#fff',
        color: colors.dark[100],
    };

    return (
        <div className='w-full'>
             <h4 className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-3">
                {activeLanguage.sideMatter.fillOutTheForm}
             </h4>

            <div className='flex flex-col gap-3'>
                <input 
                    type="text" 
                    value={clientForm.fullName}
                    placeholder={activeLanguage.sideMatter.fullName}
                    className={`${inputClasses} h-12`}
                    style={dynamicStyle}
                    onChange={(e) => setClientForm({...clientForm, fullName: e.target.value})}
                />
                <input 
                    type="text" 
                    value={clientForm.address}
                    placeholder={activeLanguage.sideMatter.address}
                    className={`${inputClasses} h-12`}
                    style={dynamicStyle}
                    onChange={(e) => setClientForm({...clientForm, address: e.target.value})}
                />
                <input 
                    type="tel" 
                    value={clientForm.phone}
                    placeholder={activeLanguage.sideMatter.phone}
                    className={`${inputClasses} h-12`}
                    style={dynamicStyle}
                    onChange={(e) => handleInputPhone(e.target.value)}
                />
                <textarea 
                    value={clientForm.note}
                    placeholder={`${activeLanguage.sideMatter.note} (${activeLanguage.recommended})`}
                    className={`${inputClasses} py-2 h-20 resize-none`}
                    style={dynamicStyle}
                    onChange={(e) => setClientForm({...clientForm, note: e.target.value})}
                />
            </div>
        </div>
    )
}

export default InputForm;