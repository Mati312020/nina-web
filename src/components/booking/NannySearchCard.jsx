import React from 'react';
import { Star, MapPin, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...args) => twMerge(clsx(...args));

const formatCurrency = (val) =>
    val != null
        ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val)
        : null;

/**
 * Tarjeta de niñera seleccionable en el flujo de reserva last-minute.
 * A diferencia de NannyCard (largo plazo), aquí el foco es la selección múltiple.
 *
 * Props:
 *   nanny    — { id, name, age, neighborhood, hourlyRate, rating, imageUrl }
 *   selected — boolean
 *   onToggle — (nannyId) => void
 */
export const NannySearchCard = ({ nanny, selected, onToggle }) => {
    const initials = nanny.name
        ? nanny.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    return (
        <button
            type="button"
            onClick={() => onToggle(nanny.id)}
            className={cn(
                'relative w-full text-left rounded-2xl border-2 p-4 transition-all duration-200',
                'hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                selected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-gray-200 bg-white hover:border-primary/40'
            )}
        >
            {/* Checkmark badge */}
            {selected && (
                <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
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
                    'text-xs font-semibold mt-auto',
                    selected ? 'text-primary' : 'text-gray-700'
                )}>
                    {formatCurrency(nanny.hourlyRate)}/hr
                </p>
            )}
        </button>
    );
};
