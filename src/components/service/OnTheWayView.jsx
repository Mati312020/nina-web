import React from 'react';
import { MapPin, AlertCircle, Navigation } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { DirectionsButton } from './DirectionsButton';
import { CallButton } from './CallButton';

/**
 * Vista para la niñera cuando está "en camino".
 * Muestra la dirección de la familia y botón "Llegué".
 */
export const OnTheWayView = ({ booking, onArrived, loading, error }) => {
    const family  = booking?.family ?? {};
    const address = family.address || booking?.family_address;

    return (
        <div className="space-y-4">
            <Card className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                    <Navigation size={16} className="text-primary animate-pulse" />
                    <p className="text-xs text-primary font-semibold uppercase tracking-wide">En camino</p>
                </div>
                <p className="font-bold text-gray-900 font-poppins text-lg">{family.name || 'Familia'}</p>
                {address && <p className="text-sm text-gray-600">{address}</p>}
                {family.phone && (
                    <CallButton phone={family.phone}
                        label={`Llamar a ${family.name?.split(' ')[0] ?? 'la familia'}`} />
                )}
                {address && <DirectionsButton address={address} />}
            </Card>

            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    {error}
                </div>
            )}

            <Button variant="primary" className="w-full" onClick={onArrived} disabled={loading} isLoading={loading}>
                <MapPin size={16} className="mr-2" />
                Llegué
            </Button>
        </div>
    );
};
