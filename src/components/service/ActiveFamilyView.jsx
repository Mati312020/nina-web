import React from 'react';
import { Users } from 'lucide-react';
import { Card } from '../ui/Card';
import { ServiceTimer } from './ServiceTimer';
import { EmergencyButton } from './EmergencyButton';
import { Button } from '../ui/Button';
import { useServiceExtension } from '../../hooks/useServiceExtension';

const STATUS_LABELS = {
    all_good: '✅ Todo bien',
    playing:  '🎮 Jugando',
    sleeping: '😴 Durmiendo',
    eating:   '🍽️ Comiendo',
};

/**
 * Centro de control durante el servicio para la familia.
 * Muestra timer, último reporte de la niñera y botón de extensión.
 */
export const ActiveFamilyView = ({ booking, remaining }) => {
    const { loading, error, request } = useServiceExtension(booking.id);
    const nanny     = booking?.nanny ?? {};
    const lastReport = booking?.last_status_type;
    const extRequested = booking?.extension_requested;

    return (
        <div className="space-y-4">
            <Card className="p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-poppins flex-shrink-0">
                        {(nanny.name || 'N').slice(0, 2).toUpperCase()}
                    </div>
                    <p className="font-bold text-gray-900 font-poppins">{nanny.name || 'Tu niñera'}</p>
                </div>
                <ServiceTimer remaining={remaining} durationHours={booking.duration_hours} />
                {lastReport && (
                    <p className="text-center text-sm text-gray-500">
                        Último reporte: {STATUS_LABELS[lastReport] ?? lastReport}
                    </p>
                )}
            </Card>

            {!extRequested && (
                <Button variant="outline" className="w-full flex items-center gap-2"
                    onClick={request} disabled={loading} isLoading={loading}>
                    <Users size={16} />
                    Solicitar +1 hora
                </Button>
            )}
            {extRequested && (
                <p className="text-center text-sm text-amber-600 font-medium py-2">
                    ⏳ Solicitud de extensión enviada…
                </p>
            )}
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <EmergencyButton bookingId={booking.id} />
        </div>
    );
};
