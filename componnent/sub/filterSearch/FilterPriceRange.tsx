import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider';
import { FiltrationType } from '@/types';
import React from 'react'

type FilterPriceRangeType = {
    filtration: FiltrationType
    mostProductExpensive: number
    filtrationCopy: FiltrationType, 
    setFiltrationCopy: (value: FiltrationType) => void
}

const FilterPriceRange = ({
    filtration,
    mostProductExpensive,
    filtrationCopy,
    setFiltrationCopy
}: FilterPriceRangeType) => {

    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();


    const minRangeStyle: React.CSSProperties = {
        height: "0.5rem",
        WebkitAppearance: "none",
        MozAppearance: "none",
        borderRadius: 9999,
        cursor: "pointer",
        background: `
            linear-gradient(to right, 
            ${colors.dark[250]} ${(filtrationCopy.price.from * 100) / mostProductExpensive}%, 
            ${colors.light[250]} ${(filtrationCopy.price.from * 100) / mostProductExpensive}%)
        `,
    };

    const maxRangeStyle: React.CSSProperties = {
        height: "0.5rem",
        WebkitAppearance: "none",
        MozAppearance: "none",
        borderRadius: 9999,
        cursor: "pointer",
        background: `
            linear-gradient(to right, 
            ${colors.dark[250]} ${(filtrationCopy.price.to * 100) / mostProductExpensive}%, 
            ${colors.light[250]} ${(filtrationCopy.price.to * 100) / mostProductExpensive}%)
        `,
    };

  return (
    // <div>
        <div className='sm:h-full- flex flex-1- flex-col justify-center w-fit mx-2 px-2'>

            <h4 className='m-5 font-extrabold'>{activeLanguage.sideMatter.priceZone + " : "}</h4>
            
            <div className='h-full flex flex-col justify-center items-center mx-2 relative '>
                
                <div className='flex flex-rox my-[8px]'>

                    <h5>{activeLanguage.sideMatter.min + " : "} </h5>

                    <div className=' w-[300px] flex flex-row justify-center items-center'>
                        <span 
                            className='text-[12px] w-[70px] text-center'
                            style={{
                                color: colors.dark[300]
                            }}
                        >{0 + " D.T"}</span>
                        <div className='relative w-full'>

                            <input 
                                min={0}
                                max={mostProductExpensive}
                                value={filtrationCopy.price.from}
                                type="range" 
                                color='red'
                                onChange={(e) => {
                                    setFiltrationCopy({
                                        ...filtrationCopy,
                                        price: {
                                            ...filtrationCopy.price,
                                            from: parseFloat(e.target.value)
                                        }
                                    })
                                }}
                                className={`${activeTheme == "light" ? "range-input-light" : "range-input-dark"} flex flex-1 w-full`}
                                style={minRangeStyle}
                            />
                            <span 
                                className='absolute top-[-300%] whitespace-nowrap px-1 -translate-x-1 text-center text-sm rounded-full z-10'
                                style={{
                                    left: (filtrationCopy.price.from * 100) / mostProductExpensive + "%",
                                    backgroundColor: colors.dark[100],
                                    color: colors.light[100]
                                }}
                            >{filtrationCopy.price.from + ' D.T'}</span>

                        </div>
                        <span 
                            className='text-[12px] w-[100px] text-center'
                            style={{
                                color: colors.dark[300]
                            }}
                        >{mostProductExpensive + " D.T"}</span>
                    </div>


                </div>

                <div className='flex flex-rox my-[8px]'>

                    <h5>{activeLanguage.sideMatter.max + ' : '}</h5>

                    <div className=' w-[300px] flex flex-row justify-center items-center'>
                        <span 
                            className='text-[12px] w-[70px] text-center'
                            style={{
                                color: colors.dark[300]
                            }}
                        >{0 + " D.T"}</span>                                    
                        <div className='relative w-full'>


                            <input 
                                min={0}
                                max={mostProductExpensive + 1}
                                value={filtrationCopy.price.to}
                                type="range" 
                                onChange={(e) => {
                                    setFiltrationCopy({
                                        ...filtrationCopy,
                                        price: {
                                            ...filtrationCopy.price,
                                            to: parseFloat(e.target.value)
                                        }
                                    })
                                }}                                            
                                className={`${activeTheme == "light" ? "range-input-light" : "range-input-dark"} flex flex-1 w-full`}
                                style={maxRangeStyle}
                            />
                            <span 
                                className='absolute top-[-300%] whitespace-nowrap px-1 -translate-x-1 text-center text-sm rounded-full z-10'
                                style={{
                                    left: (filtrationCopy.price.to * 100) / mostProductExpensive + "%",
                                    backgroundColor: colors.dark[100],
                                    color: colors.light[100]
                                }}
                            >{filtrationCopy.price.to + ' D.T'}</span>

                        </div>
                        <span 
                            className='text-[12px] w-[100px] text-center'
                            style={{
                                color: colors.dark[300]
                            }}
                        >{mostProductExpensive + " D.T"}</span>
                    </div>


                </div>

            </div>

        </div>
    // </div>
  )
}

export default FilterPriceRange
