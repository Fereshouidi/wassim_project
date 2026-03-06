"use client";

import { useTheme } from '@/contexts/themeProvider';
import React, { useEffect, useState } from 'react';
import { EvaluationType, ProductType } from '@/types';
import EvaluationItem from '../sub/evaluationItem';
import { backEndUrl } from '@/api';

import { useScreen } from '@/contexts/screenProvider';
import { useLanguage } from '@/contexts/languageContext';
import { useClient } from '@/contexts/client';

type EvaluationSectionType = {
    addEvaluationActive: boolean;
    setAddEvaluationActive: (value: boolean) => void;
    editEvaluationActive: boolean;
    setEditEvaluationActive: (value: boolean) => void;
    newEvaluation: EvaluationType;
    setNewEvaluation: (value: EvaluationType) => void;
    evaluations: EvaluationType[];
    setEvaluations: (value: EvaluationType[]) => void;
    evaluationSectionActive: boolean;
    setEvaluationSectionActive: (value: boolean) => void;
    product: ProductType;
    clientCanRate: boolean;
};

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

    const { colors } = useTheme();
    const { activeLanguage } = useLanguage();
    const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
    const { client } = useClient();

    const hasEvaluated = evaluations.some(e => {
        const evaluationClientId = typeof e.client === 'object' ? (e.client as any)?._id : e.client;
        return evaluationClientId === client?._id;
    });

    const toggleExpand = (index: number) => {
        setExpandedComments(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handleDeleteEvaluation = async (id: string) => {
        try {
            const response = await fetch(`${backEndUrl}/deleteEvaluationById?id=${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setEvaluations(evaluations.filter(e => e._id !== id));
            }
        } catch (error) {
            console.error("Error deleting evaluation:", error);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setEvaluationSectionActive(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div
            className='fixed inset-0 w-full h-full backdrop-blur-md bg-black/40 flex justify-center items-center z-[100] p-0 sm:p-4 animate-in fade-in duration-300'
            onClick={() => setEvaluationSectionActive(false)}
        >
            <div
                className='relative w-full max-w-[1100px] h-full sm:h-[80vh] sm:rounded-[2rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300'
                style={{ backgroundColor: colors.light[100] }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* --- Compact Top Bar --- */}
                <div className='w-full px-6 py-6 sm:px-10 flex justify-between items-center border-b border-black/5'>
                    <div className='flex flex-col'>
                        <h3 className='text-xl sm:text-2xl font-black uppercase tracking-tight' style={{ color: colors.dark[100] }}>
                            {activeLanguage.evaluations}
                        </h3>
                        <p className='text-[9px] font-bold opacity-30 uppercase tracking-[0.2em]'>
                            {evaluations.length} {activeLanguage.reviewsForProduct}
                        </p>
                    </div>

                    <div className='flex items-center gap-3'>
                        {clientCanRate && !hasEvaluated && (
                            <button
                                className='flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all hover:opacity-80 active:scale-95'
                                style={{ backgroundColor: colors.dark[100], color: colors.light[100] }}
                                onClick={() => setAddEvaluationActive(true)}
                            >
                                <span>+</span>
                                <span>{activeLanguage.addEvaluation}</span>
                            </button>
                        )}
                        <button
                            onClick={() => setEvaluationSectionActive(false)}
                            className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors'
                            style={{ color: colors.dark[100] }}
                        >
                            <span className="text-xl">✕</span>
                        </button>
                    </div>
                </div>

                {/* --- Compact Masonry Content --- */}
                <div className='flex-1 overflow-y-auto p-6 sm:p-10 scrollbar-hide'>
                    {evaluations.length > 0 ? (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                            {evaluations.map((evaluation, index) => {
                                const isExpanded = expandedComments[index];
                                //@ts-ignore
                                const isLongComment = evaluation?.note?.length > 120;

                                return (
                                    <div
                                        key={index}
                                        className="break-inside-avoid animate-in fade-in duration-500"
                                    >
                                        <EvaluationItem
                                            evaluation={evaluation}
                                            addEvaluationActive={addEvaluationActive}
                                            setAddEvaluationActive={setAddEvaluationActive}
                                            editEvaluationActive={editEvaluationActive}
                                            setEditEvaluationActive={setEditEvaluationActive}
                                            newEvaluation={newEvaluation}
                                            setNewEvaluation={setNewEvaluation}
                                            onDelete={handleDeleteEvaluation}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                    ) : (
                        <div className="w-full h-full flex flex-col justify-center items-center opacity-20 py-20">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">{activeLanguage.noEvaluationsYet}</p>
                        </div>
                    )}
                </div>

                {/* --- Slim Footer --- */}
                <div className="px-10 py-4 flex justify-center bg-black/[0.02] border-t border-black/5">
                    <p className="text-[8px] font-bold opacity-30 uppercase tracking-[0.3em]">
                        {activeLanguage.verifiedPurchasesOnly}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EvaluationSection;