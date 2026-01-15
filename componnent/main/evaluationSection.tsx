import { useTheme } from '@/contexts/themeProvider'
import React, { useEffect, useState } from 'react'
import AddEvaluationCard from '../sub/addEvaluationCard';
import { EvaluationType, ProductType } from '@/types';
import EvaluationItem from '../sub/evaluationItem';
import { headerHeight } from '@/constent';
import { useScreen } from '@/contexts/screenProvider';
import axios from 'axios';
import { backEndUrl } from '@/api';

type EvaluationSectionType = {
    addEvaluationActive: boolean
    setAddEvaluationActive: (value: boolean) => void
    editEvaluationActive: boolean, 
    setEditEvaluationActive: (value: boolean) => void
    newEvaluation: EvaluationType
    setNewEvaluation: (value: EvaluationType) => void
    evaluations: EvaluationType[]
    setEvaluations: (value: EvaluationType[]) => void
    evaluationSectionActive: boolean, 
    setEvaluationSectionActive: (value: boolean) => void
    product: ProductType
}

const EvaluationSection = ({
    addEvaluationActive,
    setAddEvaluationActive,
    editEvaluationActive,
    setEditEvaluationActive,
    newEvaluation,
    setNewEvaluation,
    evaluations,
    setEvaluations,
    evaluationSectionActive, 
    setEvaluationSectionActive,
    product
}: EvaluationSectionType) => {

    const { colors, activeTheme } = useTheme();
    const { screenWidth } = useScreen();

    useEffect(() => {
        console.log({evaluations});
        
    }, [evaluations])


    return (

        <div 
            className='fixed top-0 left-0 w-full h-full backdrop-blur-sm flex justify-center items-center z-50'
            style={{
                // top: headerHeight * 1
            }}
        >
            <div 
                className='relative w-[90%] sm:w-[1000px] h-[90%] rounded-sm pt-7 pb-2 sm:pt-7 sm:px-32- my-10- p-0 flex flex-col justify-center- items-center '
                style={{
                    // top: headerHeight * 1
                    backgroundColor: colors.light[100],
                    boxShadow: `0 0 15px ${colors.dark[900]}`
                }}
            >
                <div className='w-full flex flex-row justify-center items-start px-5 sm:px-10'>

                    <div 
                        className='w-fit absolute top-7 left-7 flex justify-center items-center gap-1 px-2 py-2 rounded-sm text-sm cursor-pointer'
                        style={{
                            // border: `1px solid ${colors.dark[200]}`,
                            backgroundColor: colors.dark[300],
                            color: colors.light[200]
                        }}
                        onClick={() => setAddEvaluationActive(true)}
                    >
                        <img 
                            src={activeTheme == "dark" ? "/icons/add-dark.png" : "/icons/add-white.png"} 
                            className='w-3 h-3 flex-shrink-0'
                            alt="" 
                        />
                        { screenWidth > 1000 && <h6 className='text-[12px] whitespace-nowrap leading-none'>add your option</h6>}
                    </div> 

                    <div className='w-full flex flex-col justify-center items-center mb-6'>
                        <h3 className='text-lg sm:text-xl font-bold sm:mb-2' style={{ color: colors.dark[100] }}>
                            {'Opinions'}
                        </h3>
                        <p className='text-[12px]' style={{ color: colors.dark[800] }}>{"( " + evaluations.length + " opinion )"}</p>
                    </div>

                    <button 
                        onClick={() => setEvaluationSectionActive(false)} 
                        className='absolute top-7 right-7 font-bold opacity-50 hover:opacity-100 transition-opacity cursor-pointer'
                    >
                        ✕
                    </button>
                </div>

                <div 
                    className={`
                        w-full h-full p-5 
                        overflow-y-auto overflow-x-hidden
                        grid grid-cols-1 
                        ${screenWidth >= 700 ? "md:grid-cols-2 lg:grid-cols-3" : ""} 
                        gap-4 items-start
                    `}
                >
                    {evaluations?.map((evaluation, index) => (
                        <div key={index} className="h-fit">
                            <EvaluationItem 
                                evaluation={evaluation} 
                                addEvaluationActive={addEvaluationActive}
                                setAddEvaluationActive={setAddEvaluationActive}
                                editEvaluationActive={editEvaluationActive}
                                setEditEvaluationActive={setEditEvaluationActive}
                                newEvaluation={newEvaluation}
                                setNewEvaluation={setNewEvaluation}
                            />
                        </div>
                    ))}
                </div>

            </div>
        </div>

    )
}

export default EvaluationSection
