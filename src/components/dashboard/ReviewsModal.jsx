import React, { useState, useEffect } from 'react';
import { Star, X, MessageSquare, User } from 'lucide-react';
import { api } from '../../lib/api';

/**
 * Modal que muestra las valoraciones y comentarios de un usuario.
 *
 * Props:
 *   userId     — int (profile.id del usuario a consultar)
 *   userName   — string (nombre para el título)
 *   viewerRole — "family" | "nanny"
 *                "family"  → muestra reseñas escritas por familias (sobre una niñera)
 *                "nanny"   → muestra reseñas escritas por niñeras (sobre una familia)
 *   onClose    — () => void
 */
export const ReviewsModal = ({ userId, userName, viewerRole = 'family', onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const res = await api.get(`/reviews/${userId}?viewer_role=${viewerRole}`);
                if (!cancelled) setData(res);
            } catch (err) {
                if (!cancelled) setError('No se pudieron cargar las reseñas.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, [userId, viewerRole]);

    const avg = data?.average_rating ?? 0;
    const count = data?.reviews_count ?? 0;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
                    <div>
                        <h3 className="font-bold text-gray-900 font-poppins text-base">
                            {userName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {viewerRole === 'family' ? 'Reseñas de familias' : 'Reseñas de niñeras'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-xl hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Resumen */}
                {!loading && !error && (
                    <div className="px-5 py-4 flex items-center gap-4 bg-amber-50/60 border-b border-gray-100 flex-shrink-0">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-gray-900 font-poppins leading-none">
                                {avg > 0 ? avg.toFixed(1) : '—'}
                            </p>
                            <div className="flex items-center justify-center gap-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <Star
                                        key={n}
                                        size={14}
                                        className={n <= Math.round(avg)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-200 fill-gray-200'}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{count} {count === 1 ? 'reseña' : 'reseñas'}</p>
                        </div>

                        {/* Barras de distribución */}
                        <div className="flex-1 space-y-1">
                            {[5, 4, 3, 2, 1].map(star => {
                                const starCount = data?.reviews?.filter(r => r.stars === star).length ?? 0;
                                const pct = count > 0 ? Math.round((starCount / count) * 100) : 0;
                                return (
                                    <div key={star} className="flex items-center gap-2 text-xs">
                                        <span className="w-3 text-gray-500 text-right">{star}</span>
                                        <Star size={10} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="w-7 text-gray-400 text-right">{pct}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Lista de reseñas */}
                <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
                    {loading && (
                        <div className="flex justify-center py-8">
                            <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {error && (
                        <p className="text-center text-sm text-gray-500 py-6">{error}</p>
                    )}

                    {!loading && !error && count === 0 && (
                        <div className="text-center py-8">
                            <MessageSquare size={32} className="text-gray-200 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Todavía no hay reseñas</p>
                        </div>
                    )}

                    {!loading && !error && data?.reviews?.map((review, i) => (
                        <div key={i} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <User size={14} className="text-primary" />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 font-poppins">
                                        {review.reviewer_name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-0.5 flex-shrink-0">
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <Star
                                            key={n}
                                            size={12}
                                            className={n <= review.stars
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-200 fill-gray-200'}
                                        />
                                    ))}
                                </div>
                            </div>
                            {review.comment && (
                                <p className="text-sm text-gray-600 font-nunito leading-relaxed pl-9">
                                    {review.comment}
                                </p>
                            )}
                            {review.created_at && (
                                <p className="text-xs text-gray-400 pl-9 mt-1">{review.created_at}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
