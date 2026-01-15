import { backEndUrl } from '@/api'
import { useLanguage } from '@/contexts/languageContext'
import { useTheme } from '@/contexts/themeProvider'
import { EvaluationType } from '@/types'
import axios from 'axios'
import React, { useState } from 'react'

type AddEvaluationCardProps = {
    addEvaluationActive: boolean, 
    setAddEvaluationActive: (value: boolean) => void
    newEvaluation: EvaluationType,
    setNewEvaluation: (value: EvaluationType) => void
    evaluations: EvaluationType[], 
    setEvaluations: (value: EvaluationType[]) => void
    evaluationSectionActive: boolean, 
    setEvaluationSectionActive: (value: boolean) => void
}

const AddEvaluationCard = ({ 
    newEvaluation,
    setNewEvaluation,
    addEvaluationActive,
    setAddEvaluationActive,
    evaluations, 
    setEvaluations,
    evaluationSectionActive,
    setEvaluationSectionActive
 }: AddEvaluationCardProps) => {

    const { colors, activeTheme } = useTheme();
    const { activeLanguage } = useLanguage();
    // const [rating, setRating] = useState(0);
    // const [comment, setComment] = useState("");

    const handleSubmit = async () => {

        if (!newEvaluation.client || !newEvaluation.product || !newEvaluation.number || !newEvaluation.note) return console.log("!newEvaluation.client || !newEvaluation.product || !newEvaluation.number || !newEvaluation.note");

        console.log({ newEvaluation });
        setEvaluations([newEvaluation, ...evaluations])
        setAddEvaluationActive(false);
        setEvaluationSectionActive(true);

        await axios.post( backEndUrl + "/addEvaluation", {
            evaluationData: {
                // @ts-ignore
                client: newEvaluation.client._id,
                ...newEvaluation
            }
        })
        .then(({ data }) => {
            console.log("done");
        })
        .catch(( err ) => {
            console.log({err});
        })

        setNewEvaluation({...newEvaluation, number: 0, note: ""});

    }

    return (
        <div 
            className='fixed top-0 left-0 w-full h-full bg-black/40 backdrop-blur-sm flex justify-center items-center z-[100] p-4'
            onClick={() => setAddEvaluationActive(false)}
        >
            <div 
                className='w-full max-w-[450px] h-fit p-6 rounded-md shadow-2xl transition-all scale-up'
                style={{ 
                    backgroundColor: colors.light[100],
                    border: `1px solid ${colors.light[300]}`
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className='flex justify-between items-center mb-6'>
                    <h3 className='text-xl font-bold' style={{ color: colors.dark[100] }}>
                        {'Add Opinion'}
                    </h3>
                    <button onClick={() => setAddEvaluationActive(false)} className='opacity-50 hover:opacity-100 transition-opacity cursor-pointer'>
                        ✕
                    </button>
                </div>

                <div className='flex flex-col items-center gap-3 mb-6'>
                    <p className='text-sm opacity-70'>
                        {'Rate this product'}
                    </p>
                    <div className='flex gap-2'>
                        {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setNewEvaluation({
                                ...newEvaluation,
                                number: star
                            })}
                            className='text-3xl text-yellow-400 transition-transform active:scale-90 cursor-pointer'
                        >
                            {star <= (newEvaluation.number || 0) ? '★' : '☆'}
                        </button>
                        ))}
                    </div>
                </div>

                <div className='mb-6'>
                    <textarea
                        className='w-full p-3 rounded-sm border outline-none min-h-[120px] text-sm resize-none transition-all focus:ring-1'
                        placeholder={'Write your notes...'}
                        style={{ 
                            backgroundColor: activeTheme === 'dark' ? colors.dark[200] : '#f9f9f9',
                            borderColor: colors.light[300],
                            color: colors.dark[100]
                        }}
                        value={newEvaluation.note}
                        onChange={(e) => setNewEvaluation({
                            ...newEvaluation,
                            note: e.target.value
                        })}
                    />
                </div>

                <div className='flex flex-row-reverse gap-3'>
                    <button
                        className='flex-1 py-3 rounded-sm font-bold transition-all active:scale-95 text-sm'
                        style={{ 
                            backgroundColor: colors.dark[100], 
                            color: colors.light[100] 
                        }}
                        onClick={handleSubmit}
                    >
                        {activeLanguage.sideMatter.confirm}
                    </button>
                    
                    <button
                        className='flex-1 py-3 rounded-sm font-bold border transition-all active:scale-95 text-sm'
                        style={{ 
                            borderColor: colors.light[300],
                            color: colors.dark[100]
                        }}
                        onClick={() => setAddEvaluationActive(false)}
                    >
                        {'Cancel'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddEvaluationCard;