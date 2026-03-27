import React from 'react';
import { Star, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { formatARS } from '../../helpers/currencyHelpers';

/**
 * Tarjeta de resumen: total de ganancias, rating promedio y servicios completados.
 */
export const EarningsSummary = ({ data }) => {
    const { total_earnings = 0, rating_avg = 0, completed_services = 0 } = data ?? {};
    const average_rating = rating_avg;

    return (
        <Card className="p-5 space-y-4">
            <div className="text-center">
                <p className="text-3xl font-bold text-primary font-poppins">{formatARS(total_earnings)}</p>
                <p className="text-xs text-gray-400 mt-0.5">Ganancias totales</p>
            </div>
            <div className="flex justify-around border-t border-gray-100 pt-4">
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-gray-800">{average_rating.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-gray-400">Calificación</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                        <CheckCircle2 size={14} className="text-green-500" />
                        <span className="font-bold text-gray-800">{completed_services}</span>
                    </div>
                    <p className="text-xs text-gray-400">Servicios</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                        <TrendingUp size={14} className="text-primary" />
                        <span className="font-bold text-gray-800">
                            {completed_services > 0 ? formatARS(total_earnings / completed_services) : '—'}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400">Promedio</p>
                </div>
            </div>
        </Card>
    );
};
