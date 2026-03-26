import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

/**
 * Cuenta regresiva para el timeout de la candidata actual.
 * Recibe el timeout en segundos. No conoce el tiempo de inicio exacto,
 * así que muestra un countdown desde cascade_timeout_seconds al montar.
 *
 * @param {{ seconds: number }} props
 */
export const CascadeTimer = ({ seconds }) => {
    const [remaining, setRemaining] = useState(seconds);

    useEffect(() => {
        setRemaining(seconds);
    }, [seconds]);

    useEffect(() => {
        if (remaining <= 0) return;
        const id = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
        return () => clearInterval(id);
    }, [remaining]);

    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    const pct  = seconds > 0 ? (remaining / seconds) * 100 : 0;

    const color = pct > 50 ? 'text-primary' : pct > 25 ? 'text-amber-500' : 'text-red-500';

    return (
        <div className="flex items-center gap-2">
            <Clock size={14} className={color} />
            <span className={`text-sm font-bold font-mono ${color}`}>
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
            <span className="text-xs text-gray-400">para responder</span>
        </div>
    );
};
