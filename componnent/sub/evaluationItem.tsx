import { useClient } from '@/contexts/client';
import { useTheme } from '@/contexts/themeProvider'
import { EvaluationType, ClientType } from '@/types'
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { timeAgo } from '@/lib';
import { useLanguage } from '@/contexts/languageContext';

type Props = {
    addEvaluationActive: boolean,
    setAddEvaluationActive: (value: boolean) => void
    evaluation: EvaluationType
    editEvaluationActive: boolean,
    setEditEvaluationActive: (value: boolean) => void
    newEvaluation: EvaluationType,
    setNewEvaluation: (value: EvaluationType) => void
    onDelete?: (id: string) => void
}
const EvaluationItem = ({
    addEvaluationActive,
    setAddEvaluationActive,
    evaluation,
    editEvaluationActive,
    setEditEvaluationActive,
    newEvaluation,
    setNewEvaluation,
    onDelete
}: Props) => {

    const { colors } = useTheme();
    const { client } = useClient();
    const { activeLanguage } = useLanguage();

    return (
        <div
            className='sm:w-[300px]- w-[100%]- w-full h-full p-5 mb-4- rounded-xl transition-all'
            style={{
                backgroundColor: colors.light[100],
                border: `0.5px solid ${colors.light[250]}`,
                boxShadow: `0 2px 10px ${colors.light[200]}`
            }}
        >
            <div className='flex justify-between items-start mb-3'>
                <div className={`flex flex-col gap-1 `}>

                    <div className={`flex ${evaluation.client?._id === client?._id ? " flex-col" : " flex-row justify-center items-center " }`}>
                        <h4 className='font-bold text-sm bg-red-500-' style={{ color: colors.dark[100] }}>
                            {
                                //@ts-ignore
                                evaluation?.client?.fullName
                            }
                        </h4>
                        {
                            evaluation.createdAt &&
                            <span
                                className={`text-[10px] opacity-45 bg-red-500- ${evaluation.client?._id !== client?._id && " ml-2 "}`}
                            >{
                                    "" + timeAgo(evaluation.createdAt, activeLanguage.language) + ""
                                }</span>
                        }
                    </div>


                    <div className='flex gap-0.5'>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className='text-md text-yellow-400 transition-transform active:scale-90'>
                                {star <= (evaluation.number || 0) ? '★' : '☆'}
                            </span>
                        ))}
                    </div>
                </div>

                {
                    //@ts-ignore
                    evaluation.client?._id === client?._id && (
                        <div className='flex items-center gap-3'>
                            <div
                                className='flex items-center gap-1 cursor-pointer transition-all hover:opacity-100 opacity-40'
                                style={{ color: colors.dark[100] }}
                                onClick={() => {
                                    setEditEvaluationActive(true);
                                    setNewEvaluation(evaluation)
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faPencilAlt}
                                    className="text-[10px]"
                                />
                                <span className='text-[10px] italic underline-offset-2 hover:underline'>
                                    {activeLanguage.edit}
                                </span>
                            </div>

                            <div
                                className='flex items-center gap-1 cursor-pointer transition-all hover:opacity-100 opacity-40 text-red-500'
                                onClick={() => {
                                    if (evaluation._id && window.confirm(activeLanguage.areYouSure)) {
                                        onDelete?.(evaluation._id)
                                    }
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="text-[10px]"
                                />
                                <span className='text-[10px] italic underline-offset-2 hover:underline'>
                                    {activeLanguage.delete}
                                </span>
                            </div>
                        </div>
                    )}
            </div>

            {evaluation.note && (
                <p
                    className='text-[12px] leading-relaxed opacity-75'
                    style={{ color: colors.dark[200] }}
                >
                    {evaluation.note}
                </p>
            )}
        </div>
    )
}

export default EvaluationItem;