import React, { useState } from 'react';
import { Star, MapPin, Check, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ReviewsModal } from '../dashboard/ReviewsModal';

const cn = (...args) => twMerge(clsx(...args));

const formatCurrency = (val) =>
    val != null
        ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val)
        : null;

/**
 * Tarjeta de niñera seleccionable en el flujo de reserva last-minute.
 * El área principal selecciona/deselecciona la niñera.
 * El botón "Valoración y comentarios" abre un modal con sus reseñas.
 *
 * Props:
 *   nanny    — { id, name, age, neighborhood, hourlyRate, rating, imageUrl }
 *   selected — boolean
 *   onToggle — (nannyId) => void
 */
export const NannySearchCard = ({ nanny, selected, onToggle }) => {
    const [showReviews, setShowReviews] = useState(false);

    const initials = nanny.name
        ? nanny.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    return (
        <>
            <div
                className={cn(
                    'relative w-full rounded-2xl border-2 transition-all duration-200 overflow-hidden',
                    selected
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-gray-200 bg-white hover:border-primary/40 hover:shadow-md'
                )}
            >
                {/* Área clickeable principal — selecciona/deselecciona */}
                <button
                    type="button"
                    onClick={() => onToggle(nanny.id)}
                    className="w-full text-left p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-transform hover:-translate-y-0.5"
                >
                    {/* Checkmark badge */}
                    {selected && (
                        <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10">
                            <Check size={13} className="text-white" strokeWidth={3} />
                        </span>
                    )}

                    {/* Avatar + nombre */}
                    <div className="flex items-center gap-3 mb-3">
                        {nanny.imageUrl ? (
                            <img
                                src={nanny.imageUrl}
                                alt={nanny.name}
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                        ) : (
                            <div className={cn(
                                'w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold font-poppins flex-shrink-0',
                                selected ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-600'
                            )}>
                                {initials}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="font-bold text-gray-900 font-poppins truncate text-sm">
                                {nanny.name}
                            </p>
                            {nanny.age && (
                                <p className="text-xs text-gray-400">{nanny.age} años</p>
                            )}
                        </div>
                    </div>

                    {/* Rating */}
                    {nanny.rating != null && !isNaN(parseFloat(nanny.rating)) && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                            <Star size={12} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                            <span className="font-medium">{parseFloat(nanny.rating).toFixed(1)}</span>
                        </div>
                    )}

                    {/* Barrio */}
                    {nanny.neighborhood && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                            <MapPin size={12} className="flex-shrink-0 text-secondary" />
                            <span className="truncate">{nanny.neighborhood}</span>
                        </div>
                    )}

                    {/* Tarifa */}
                    {nanny.hourlyRate != null && (
                        <p className={cn(
                            'text-xs font-semibold',
                            selected ? 'text-primary' : 'text-gray-700'
                        )}>
                            {formatCurrency(nanny.hourlyRate)}/hr
                        </p>
                    )}
                </button>

                {/* Botón de reseñas — separado para no interferir con la selección */}
                <div className="px-4 pb-3 border-t border-gray-100 pt-2">
                    <button
                        type="button"
                        onClick={() => setShowReviews(true)}
                        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                        <MessageSquare size={12} />
                        Valoración y comentarios
                    </button>
                </div>
            </div>

            {showReviews && (
                <ReviewsModal
                    userId={nanny.id}
                    userName={nanny.name || 'Niñera'}
                    viewerRole="family"
                    onClose={() => setShowReviews(false)}
                />
            )}
        </>
    );
};
