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

  return (
    <div>

        <h4 
            className='font-bold text-md mx-2 my-4'
            style={{
                color: colors.dark[400]
            }}
        >{activeLanguage.sideMatter.fillOutTheForm + " :"}</h4>

        <div className='flex flex-wrap justify-center items-center gap-4'>

                <input 
                    type="text" 
                    placeholder={activeLanguage.sideMatter.fullName}
                    className='flex flex-1 rounded-sm h-12 p-2 text-[14px]'
                    style={{
                        border: `1px solid ${colors.light[300]}`
                    }}
                    onChange={(e) => setClientForm({...clientForm, fullName: e.target.value})}
                />
                <input 
                    type="text" 
                    placeholder={activeLanguage.sideMatter.adress}
                    className='flex flex-1 rounded-sm h-12 p-2 text-[14px]'
                    style={{
                        border: `1px solid ${colors.light[300]}`
                    }}
                    onChange={(e) => setClientForm({...clientForm, adress: e.target.value})}
                />
                <input 
                    type="text" 
                    placeholder={activeLanguage.sideMatter.phone}
                    className='flex flex-1 rounded-sm h-12 p-2 text-[14px]'
                    style={{
                        border: `1px solid ${colors.light[300]}`
                    }}
                    onChange={(e) => setClientForm({...clientForm, phone: Number(e.target.value)})}
                />
                <input 
                    type="text" 
                    placeholder={activeLanguage.sideMatter.note}
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
