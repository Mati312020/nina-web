import React, { useState } from 'react';
import { postStatusUpdate } from '../../services/serviceFlowService';

const STATUSES = [
    { type: 'all_good', emoji: '✅', label: 'Todo bien' },
    { type: 'playing',  emoji: '🎮', label: 'Jugando' },
    { type: 'sleeping', emoji: '😴', label: 'Durmiendo' },
    { type: 'eating',   emoji: '🍽️', label: 'Comiendo' },
];

/**
 * 4 botones de reporte de actividad para la niñera durante el servicio.
 * Muestra feedback visual tras el envío.
 */
export const StatusUpdateButtons = ({ bookingId }) => {
    const [sent, setSent]     = useState(null);
    const [loading, setLoad]  = useState(false);

    const handleSend = async (type) => {
        if (loading) return;
        setLoad(true);
        try {
            await postStatusUpdate(bookingId, type);
            setSent(type);
            setTimeout(() => setSent(null), 3000);
        } catch {
            // silencio — el botón simplemente no se marca
        } finally {
            setLoad(false);
        }
    };

    return (
        <div className="space-y-2">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
                Reportar actividad
            </p>
            <div className="grid grid-cols-2 gap-2">
                {STATUSES.map(({ type, emoji, label }) => (
                    <button key={type} onClick={() => handleSend(type)} disabled={loading}
                        className={`flex items-center gap-2 p-3 rounded-2xl border-2 text-sm font-medium transition-all
                            ${sent === type
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-200 text-gray-700 hover:border-primary/50'}`}>
                        <span className="text-lg">{emoji}</span>
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};
