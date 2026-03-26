import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ServiceTimer } from './ServiceTimer';
import { StatusUpdateButtons } from './StatusUpdateButtons';
import { EmergencyButton } from './EmergencyButton';
import { ExtensionModal } from './ExtensionModal';
import { useServiceExtension } from '../../hooks/useServiceExtension';

/**
 * Centro de control durante el servicio para la niñera.
 * Timer + reportes de actividad + modal de extensión + finalizar.
 */
export const ActiveNannyView = ({ booking, remaining, onComplete }) => {
    const { loading, error, accept, reject } = useServiceExtension(booking.id);
    const family       = booking?.family ?? {};
    const extRequested = booking?.extension_requested;
    const extResponded = booking?.extension_accepted != null;

    return (
        <div className="space-y-4">
            {extRequested && !extResponded && (
                <ExtensionModal onAccept={accept} onReject={reject} loading={loading} error={error} />
            )}

            <Card className="p-5">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">
                    Cuidando a
                </p>
                <p className="font-bold text-gray-900 font-poppins">{family.name || 'La familia'}</p>
                <ServiceTimer remaining={remaining} durationHours={booking.duration_hours} />
            </Card>

            <StatusUpdateButtons bookingId={booking.id} />

            <EmergencyButton bookingId={booking.id} />

            <Button variant="primary" className="w-full" onClick={onComplete}>
                Finalizar servicio
            </Button>
        </div>
    );
};
