import { backEndUrl } from "@/api";
import { EvaluationType } from "@/types";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const ProductRatingForm = ({
    purchaseId,
    productId,
    productName,
    thumb,
    clientId,
    colors,
    activeTheme,
    activeLanguage,
    onDone,
}: {
    purchaseId: string;
    productId: string;
    productName: string;
    thumb: string;
    clientId: string;
    colors: any;
    activeTheme: string;
    activeLanguage: any;
    onDone: (purchaseId: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    const [stars, setStars] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [existingEval, setExistingEval] = useState<EvaluationType | null>(null);
    const [loadingEval, setLoadingEval] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;
        if (!productId || !clientId) {
            setLoadingEval(false);
            return;
        }

        axios.get(`${backEndUrl}/getEvaluationByProduct`, { params: { productId } })
            .then(({ data }) => {
                if (!isMounted) return;
                const evaluations: EvaluationType[] = data.evaluations || [];
                const userEval = evaluations.find(ev => {
                    const cId = typeof ev.client === 'object' ? (ev.client as any)?._id : ev.client;
                    return cId === clientId;
                });
                if (userEval) {
                    setExistingEval(userEval);
                    setStars(userEval.number || 0);
                    setNote(userEval.note || '');
                }
            })
            .catch(err => {
                console.error("Error fetching evaluation:", err);
            })
            .finally(() => {
                if (isMounted) setLoadingEval(false);
            });

        return () => {
            isMounted = false;
        };
    }, [productId, clientId]);

    const handleSubmit = async () => {
        if (!stars || !note.trim()) return;
        setSubmitting(true);
        try {
            if (existingEval && existingEval._id) {
                const { data } = await axios.put(backEndUrl + '/updateEvaluationById', {
                    updatedData: {
                        _id: existingEval._id,
                        client: clientId,
                        product: productId,
                        number: stars,
                        note: note.trim(),
                    }
                });
                if (data?.updatedEvaluation) {
                    setExistingEval(data.updatedEvaluation);
                }
            } else {
                const { data } = await axios.post(backEndUrl + '/addEvaluation', {
                    evaluationData: {
                        client: clientId,
                        product: productId,
                        number: stars,
                        note: note.trim(),
                    }
                });
                if (data?.evaluation) {
                    setExistingEval(data.evaluation);
                }
            }
            setDone(true);
            onDone(purchaseId);
        } catch (e) {
            console.error("Error saving evaluation:", e);
        } finally {
            setSubmitting(false);
        }
    };

    if (done) {
        return (
            <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: '#10b981' }}
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {activeLanguage.language === 'fr' ? 'Noté' : 'Rated'}
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between gap-3">
                {/* Product info */}
                <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 border" style={{ borderColor: colors.light[300] }}>
                        <img src={thumb} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] opacity-70 truncate max-w-[120px]">{productName}</span>
                </div>
                {/* Rate / Edit button */}
                {!open && (
                    <button
                        onClick={() => setOpen(true)}
                        disabled={loadingEval}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold flex-shrink-0 transition-all active:scale-95 hover:opacity-80 disabled:opacity-50"
                        style={{ backgroundColor: 'rgba(99,102,241,0.12)', color: '#6366f1' }}
                    >
                        <span className="text-yellow-400">★</span>
                        {existingEval ? activeLanguage.editEvaluation : activeLanguage.addEvaluation}
                    </button>
                )}
            </div>

            {/* Expandable form */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div
                            className="mt-3 p-4 rounded-xl flex flex-col gap-3"
                            style={{
                                backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                                border: `0.2px solid ${colors.light[300]}`
                            }}
                        >
                            {/* Stars */}
                            <div className="flex items-center gap-1.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        onMouseEnter={() => setHovered(s)}
                                        onMouseLeave={() => setHovered(0)}
                                        onClick={() => setStars(s)}
                                        className="text-2xl transition-transform active:scale-90 cursor-pointer leading-none"
                                        style={{ color: s <= (hovered || stars) ? '#f59e0b' : colors.light[400] }}
                                    >
                                        ★
                                    </button>
                                ))}
                                {stars > 0 && (
                                    <span className="text-[11px] opacity-50 ml-1">{stars}/5</span>
                                )}
                            </div>

                            {/* Note textarea */}
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder={activeLanguage.writeNotes}
                                rows={2}
                                className="w-full text-[12px] p-3 rounded-sm border outline-none resize-none transition-all"
                                style={{
                                    backgroundColor: colors.light[100],
                                    borderColor: colors.light[300],
                                    color: colors.dark[100],
                                }}
                            />

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!stars || !note.trim() || submitting}
                                    className="flex-1 py-2 rounded-lg text-[12px] font-bold transition-all active:scale-95 disabled:opacity-40"
                                    style={{ backgroundColor: colors.dark[100], color: colors.light[100] }}
                                >
                                    {submitting ? '...' : activeLanguage.sideMatter.confirm}
                                </button>
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        setStars(existingEval?.number || 0);
                                        setNote(existingEval?.note || '');
                                    }}
                                    className="px-4 py-2 rounded-lg text-[12px] font-bold border transition-all active:scale-95"
                                    style={{ borderColor: colors.light[300], color: colors.dark[200] }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductRatingForm;