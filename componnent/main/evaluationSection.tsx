"use client";

import { useTheme } from '@/contexts/themeProvider'
import React, { useEffect } from 'react'
import { EvaluationType, ProductType } from '@/types';
import EvaluationItem from '../sub/evaluationItem';
import { useScreen } from '@/contexts/screenProvider';
import { useLanguage } from '@/contexts/languageContext';

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
    clientCanRate: boolean
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
    product,
    clientCanRate
}: EvaluationSectionType) => {

    const { colors, activeTheme } = useTheme();
    const { screenWidth } = useScreen();
    const { activeLanguage } = useLanguage();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setEvaluationSectionActive(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div 
            className='fixed inset-0 w-full h-full backdrop-blur-md bg-black/40 flex justify-center items-center z-[100] p-4 transition-all duration-300'
            onClick={() => setEvaluationSectionActive(false)}
        >
            <div 
                className='relative w-full max-w-[1100px] h-[85vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300'
                style={{
                    backgroundColor: colors.light[100],
                    boxShadow: `0 25px 50px -12px ${activeTheme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.2)'}`
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className='w-full px-6 py-8 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 border-b'
                    style={{ borderColor: colors.light[200] }}
                >
                    {clientCanRate && <button 
                        className='order-2 sm:order-1 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 shadow-lg'
                        style={{
                            backgroundColor: colors.dark[100],
                            color: colors.light[100]
                        }}
                        onClick={() => setAddEvaluationActive(true)}
                    >
                        <img 
                            src={activeTheme == "dark" ? "/icons/add-white.png" : "/icons/add-black.png"} 
                            className='w-3 h-3 invert pointer-events-none' 
                            alt="add" 
                        />
                        <span>{activeLanguage.addEvaluation}</span>
                    </button>}

                    <div className='order-1 sm:order-2 text-center'>
                        <h3 className='text-2xl font-black uppercase tracking-tight' style={{ color: colors.dark[100] }}>
                            {activeLanguage.evaluations}
                        </h3>
                        <p className='text-xs font-medium opacity-50 uppercase tracking-widest'>
                            {evaluations.length} {activeLanguage.reviewsForProduct}
                        </p>
                    </div>

                    <button 
                        onClick={() => setEvaluationSectionActive(false)} 
                        className='order-3 absolute top-6 right-6 sm:static w-10 h-10 flex justify-center items-center rounded-full hover:bg-gray-500/10 transition-colors'
                        style={{ color: colors.dark[100] }}
                    >
                        <span className="text-xl">✕</span>
                    </button>
                </div>

                <div className='flex-1 overflow-y-auto p-6 sm:p-10 scrollbar-thin'>
                    {evaluations.length > 0 ? (
                        <div 
                            className={`
                                grid grid-cols-1 gap-6 items-start
                                ${screenWidth >= 640 ? "sm:grid-cols-2 lg:grid-cols-3" : ""} 
                            `}
                        >
                            {evaluations.map((evaluation, index) => (
                                <div key={index} className="h-full">
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
                    ) : (
                        <div className="w-full h-full flex flex-col justify-center items-center opacity-30 gap-4">
                            <img src="/icons/empty-box.png" className="w-20 h-20 grayscale" alt="empty" />
                            <p className="text-lg font-bold">{activeLanguage.noEvaluationsYet}</p>
                        </div>
                    )}
                </div>

                <div className="px-10 py-4 text-[10px] opacity-20 text-center uppercase tracking-[0.3em]">
                    {activeLanguage.verifiedPurchasesOnly}
                </div>
            </div>
        </div>
    )
}

export default EvaluationSection;