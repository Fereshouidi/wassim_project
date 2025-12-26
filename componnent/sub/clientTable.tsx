import { useClient } from '@/contexts/client';
import { useLanguage } from '@/contexts/languageContext';
import { useTheme } from '@/contexts/themeProvider';
import React from 'react'

const ClientTable = () => {

    const { client } = useClient();
    const { activeLanguage } = useLanguage();
    const { colors } = useTheme();

    return (
        <div 
            className='w-full'
            onClick={(e) => e.stopPropagation()}
        >
            <h2 className='font-bold text-[12px] m-2'>{"Client details : "}</h2>

            <table className='w-full bord-collapse'>
                <thead>
                    <tr>
                        <th 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[300]}` }}
                        >{activeLanguage.sideMatter.fullName}</th>
                        <th 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[300]}` }}
                        >{activeLanguage.sideMatter.email}</th>
                        <th 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[300]}` }}
                        >{activeLanguage.sideMatter.phone}</th>
                        <th 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[300]}` }}
                        >{activeLanguage.sideMatter.adress}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[300]}` }}
                        >{client?.fullName}</td>
                        <td 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[300]}` }}
                        >{client?.email}</td>
                        <td 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[300]}` }}
                        >{client?.phone}</td>
                        <td 
                            className='p-2 text-[10px] sm:text-[12px] bord text-center'
                            style={{ border: `0.5px solid ${colors.light[300]}` }}
                        >{client?.adress}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ClientTable
