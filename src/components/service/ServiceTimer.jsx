import React from 'react';
import { Clock } from 'lucide-react';
import { formatHMS } from '../../helpers/timeHelpers';

/**
 * Countdown circular del tiempo restante del servicio.
 * Cambia color según fracción restante.
 */
export const ServiceTimer = ({ remaining, durationHours }) => {
    const total   = (durationHours ?? 1) * 3600;
    const frac    = total > 0 ? remaining / total : 0;
    const color   = frac > 0.5 ? 'text-primary' : frac > 0.25 ? 'text-amber-500' : 'text-red-500';
    const label   = remaining > 0 ? 'Tiempo restante' : 'Tiempo finalizado';

    return (
        <div className="flex flex-col items-center justify-center py-6 space-y-1">
            <div className="flex items-center gap-2">
                <Clock size={18} className={color} />
                <span className={`font-mono font-bold text-4xl tracking-widest ${color}`}>
                    {formatHMS(remaining)}
                </span>
            </div>
            <p className="text-xs text-gray-400">{label}</p>
        </div>
    );
};
