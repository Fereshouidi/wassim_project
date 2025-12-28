import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider';
import { ClientFormType } from '@/types';
import React from 'react'

type InputFormType = {
    clientForm: ClientFormType,
    setClientForm: (value: ClientFormType) => void
}
const InputForm = ({
    clientForm,
    setClientForm
}: InputFormType) => {

    const { activeLanguage } = useLanguage();
    const { colors } = useTheme();

    const handleInputPhone = (phone: string) => {
        if (
            phone.length > 8
            || isNaN(Number(phone))
        ) return;

        setClientForm({...clientForm, phone: phone})
    }

  return (
    <div
    // className='border-t-[0.5px]'
        style={{
            // borderTop: `0.5px solid ${colors.light[300]}`,
            // borderTop: `0.5px solid ${colors.light[300]}`
        }}
        
    >

        <h4 
            className='font-bold text-sm mx-2 my-4'
            style={{
                color: colors.dark[400]
            }}
        >{activeLanguage.sideMatter.fillOutTheForm + " :"}</h4>

        <div className='flex flex-wrap justify-center items-center gap-2'>

                <input 
                    type="text" 
                    value={clientForm.fullName}
                    placeholder={activeLanguage.sideMatter.fullName}
                    className='flex flex-1 rounded-sm h-12 p-2 text-[14px]'
                    style={{
                        border: `1px solid ${colors.light[300]}`
                    }}
                    onChange={(e) => setClientForm({...clientForm, fullName: e.target.value})}
                />
                <input 
                    type="text" 
                    value={clientForm.adress}
                    placeholder={activeLanguage.sideMatter.adress}
                    className='flex flex-1 rounded-sm h-12 p-2 text-[14px]'
                    style={{
                        border: `1px solid ${colors.light[300]}`
                    }}
                    onChange={(e) => setClientForm({...clientForm, adress: e.target.value})}
                />
                <input 
                    type="tel" 
                    value={clientForm.phone}
                    placeholder={activeLanguage.sideMatter.phone}
                    className='flex flex-1 rounded-sm h-12 p-2 text-[14px]'
                    style={{
                        border: `1px solid ${colors.light[300]}`
                    }}
                    onChange={(e) => handleInputPhone(e.target.value)}
                />
                <input 
                    type="text" 
                    value={clientForm.note}
                    placeholder={activeLanguage.sideMatter.note + ' (' + activeLanguage.recommended + ' )'}
                    className='flex flex-1 rounded-sm h-12 p-2 text-[14px]'
                    style={{
                        border: `1px solid ${colors.light[300]}`
                    }}
                    onChange={(e) => setClientForm({...clientForm, note: e.target.value})}
                />
        </div>
    </div>
  )
}

export default InputForm
