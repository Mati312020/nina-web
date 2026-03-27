import React from 'react';
import { Calendar } from 'lucide-react';
import { formatARS } from '../../helpers/currencyHelpers';

/**
 * Fila de un servicio completado en el historial de ganancias.
 */
export const EarningsHistoryItem = ({ item }) => {
    const date = item.date ?? '—';
    const earned = item.net_amount ?? 0;

    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar size={14} className="text-primary" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-800">
                        {typeof item.family === 'string' ? item.family : (item.family?.name || 'Familia')}
                    </p>
                    <p className="text-xs text-gray-400">
                        {date}{item.duration_hours ? ` · ${item.duration_hours}h` : ''}
                    </p>
                </div>
            </div>
            <p className="font-semibold text-primary text-sm">{formatARS(earned)}</p>
        </div>
    );
};
