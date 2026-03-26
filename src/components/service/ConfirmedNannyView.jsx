import React, { useState } from 'react';
import { Calendar, Clock, Users, DollarSign, AlertCircle } from 'lucide-react';
import { DirectionsButton } from './DirectionsButton';
import { CallButton } from './CallButton';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { markOnTheWay } from '../../services/serviceFlowService';

const fmt = (v) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v);

const fmtDate = (date, time) => {
    const parts = [];
    if (date) parts.push(new Date(date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }));
    if (time) parts.push(`a las ${time.slice(0, 5)}`);
    return parts.join(' ') || 'Fecha a confirmar';
};

/**
 * Vista de servicio confirmado para la niñera.
 * Muestra dirección de la familia + botón "Salir en camino".
 */
export const ConfirmedNannyView = ({ booking, onStatusChange }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);
    const family   = booking?.family ?? {};
    const earnings = booking?.offered_price ? Math.round(booking.offered_price * 0.94) : null;
    const address  = family.address || booking?.family_address;

    const handleOnTheWay = async () => {
        setLoading(true);
        setError(null);
        try {
            await markOnTheWay(booking.id);
            onStatusChange?.('on_the_way');
        } catch {
            setError('No se pudo actualizar el estado. Intentá de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Familia */}
            <Card className="p-5 space-y-3">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Familia</p>
                <p className="font-bold text-gray-900 font-poppins text-lg">{family.name || 'Familia'}</p>
                {address && <p className="text-sm text-gray-600">{address}</p>}
                {family.phone && <CallButton phone={family.phone} label={`Llamar a ${family.name?.split(' ')[0] ?? 'la familia'}`} />}
                {address && <DirectionsButton address={address} />}
            </Card>

            {/* Detalles */}
            <Card className="p-5 space-y-2">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Detalles del servicio</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} className="text-primary" />
                    <span>{fmtDate(booking.scheduled_date, booking.scheduled_time)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={14} className="text-primary" />
                    <span>{booking.duration_hours} hora{booking.duration_hours !== 1 ? 's' : ''}</span>
                </div>
                {booking.children_count > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={14} className="text-primary" />
                        <span>{booking.children_count} niño{booking.children_count !== 1 ? 's' : ''}</span>
                    </div>
                )}
                {earnings && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <DollarSign size={14} />
                        <span>{fmt(earnings)} a cobrar</span>
                    </div>
                )}
            </Card>

            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    {error}
                </div>
            )}

            <Button variant="primary" className="w-full" onClick={handleOnTheWay}
                disabled={loading} isLoading={loading}>
                Salir en camino
            </Button>
        </div>
    );
};
