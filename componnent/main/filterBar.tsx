import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { FiltrationType, ProductType } from '@/types'
import React, { useEffect, useState } from 'react'

type FilterBarType = {
    filtration: FiltrationType
    setFiltration: (value: FiltrationType) => void
    mostProductExpensive: number
    productsCount: number
    
}

const FilterBar = ({
    filtration,
    setFiltration,
    mostProductExpensive,
    productsCount
}: FilterBarType) => {

    const { activeLanguage } = useLanguage();
    const { colors, activeTheme } = useTheme();
    // const [min, setMin] = useState<number>(filtration.price.from);
    // const [max, setMax] = useState<number>(mostProductExpensive);
    const [filtrationCopy, setFiltrationCopy] = useState<FiltrationType>(filtration);

    useEffect(() => {
        console.log({filtrationCopy});
        
    }, [filtrationCopy])

    useEffect(() => {
        setFiltrationCopy(filtration)
    }, [filtration])

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
        <div className='w-full min-h-[70px]  flex-row flex-wrap justify-center items-center bg-red-500'>

            <div className='resNum flex sm:w-full items-center justify-center'>
                <span className='m-2'>{productsCount}</span>
                <p>{activeLanguage.sideMatter.resultsFound}</p>
            </div>

            <div className=' resNum h-full flex flex-wrap bg-blue-500'>

                {/* <div className='filter min-w-[200px] bg-green-500 flex flex-3 flex-wrap justify-center '> */}

                    <div className='flex flex-col justify-center '>
                        <h4 className='m-4'>{activeLanguage.sideMatter.priceZone + " : "}</h4>
                        <div className='h-full flex flex-col justify-center items-center mx-2 relative '>
                            
                            <div className='flex flex-rox'>

                                <h5>{activeLanguage.sideMatter.min} </h5>

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
                                    >{filtration.price.to + " D.T"}</span>
                                </div>


                            </div>

                            <div className='flex flex-rox'>

                                <h5>{activeLanguage.sideMatter.max}</h5>

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
                                    >{filtration.price.to + " D.T"}</span>
                                </div>


                            </div>

                        </div>

                    </div>
                    
                {/* </div> */}

                <div className='arrangement flex justify-center items-center gap-4 py-5 text-sm sm:text-md'>

                    <div className='flex flex-row'>
                        <h4>{activeLanguage.sideMatter.price + ' : '}</h4>
                        <select name="" id="">
                            <option value="asc">{activeLanguage.sideMatter.cheapest}</option>
                            <option value="desc">{activeLanguage.sideMatter.mostExpensive}</option>
                        </select>
                    </div>

                    {/* <div className='flex flex-row'>
                        <h4>{activeLanguage.sideMatter.date + ' : '}</h4>
                        <select name="" id="">
                            <option value="Oldest">{activeLanguage.sideMatter.Oldest}</option>
                            <option value="newest">{activeLanguage.sideMatter.newest}</option>
                        </select>
                    </div>

                    <div className='flex flex-row'>
                        <h4>{activeLanguage.sideMatter.name + ' : '}</h4>
                        <select name="" id="">
                            <option value="asc">a-z</option>
                            <option value="desc">z-a</option>
                        </select>
                    </div> */}

                </div>

                <button>validation</button>

                
            </div>

            <button
                onClick={() => setFiltration(filtrationCopy)}
            >validation</button>

        </div>
    )
}

export default FilterBar
