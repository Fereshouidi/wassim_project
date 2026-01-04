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
    // className='rou'
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

        <div 
            className='flex flex-wrap justify-center items-center gap-2'
            style={{
                color: colors.dark[400]
            }}
        >

                <div className='w-full bg-red-400-'>
                    <h4 className='text-[12px] font-semibold mx-2 my-1'>{activeLanguage.sideMatter.fullName} :</h4>
                    <input 
                        type="text" 
                        value={clientForm.fullName}
                        placeholder={activeLanguage.sideMatter.fullName}
                        className='w-full rounded-sm h-12 p-2 text-[13px]'
                        style={{
                            border: `1px solid ${colors.light[300]}`
                        }}
                        onChange={(e) => setClientForm({...clientForm, fullName: e.target.value})}
                    />
                </div>

                <div className='w-full bg-red-400-'>
                    <h4 className='text-[12px] font-semibold mx-2 my-1'>{activeLanguage.sideMatter.address} :</h4>
                    <input 
                        type="text" 
                        value={clientForm.address}
                        placeholder={activeLanguage.sideMatter.address}
                        className='w-full rounded-sm h-12 p-2 text-[13px]'
                        style={{
                            border: `1px solid ${colors.light[300]}`
                        }}
                        onChange={(e) => setClientForm({...clientForm, address: e.target.value})}
                    />
                </div>

                <div className='w-full bg-red-400-'>
                    <h4 className='text-[12px] font-semibold mx-2 my-1'>{activeLanguage.sideMatter.phone} :</h4>
                    <input 
                        type="tel" 
                        value={clientForm.phone}
                        placeholder={activeLanguage.sideMatter.phone}
                        className='w-full rounded-sm h-12 p-2 text-[13px]'
                        style={{
                            border: `1px solid ${colors.light[300]}`
                        }}
                        onChange={(e) => handleInputPhone(e.target.value)}
                    />
                </div>

                <div className='w-full bg-red-400-'>
                    <h4 className='text-[12px] font-semibold mx-2 my-1'>{activeLanguage.sideMatter.note} :</h4>
                    <input 
                        type="text" 
                        value={clientForm.note}
                        placeholder={activeLanguage.sideMatter.note + ' (' + activeLanguage.recommended + ' )'}
                        className='w-full rounded-sm h-12 p-2 text-[13px]'
                        style={{
                            border: `1px solid ${colors.light[300]}`
                        }}
                        onChange={(e) => setClientForm({...clientForm, note: e.target.value})}
                    />
                </div>
        </div>
    </div>
  )
}

export default InputForm