import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { PinDisplay } from './PinDisplay';
import { CallButton } from './CallButton';
import { Card } from '../ui/Card';

const fmtDate = (date, time) => {
    const parts = [];
    if (date) parts.push(new Date(date + 'T12:00:00').toLocaleDateString('es-AR', {
        weekday: 'long', day: 'numeric', month: 'long',
    }));
    if (time) parts.push(`a las ${time.slice(0, 5)}`);
    return parts.join(' ') || 'Fecha a confirmar';
};

/**
 * Vista de servicio confirmado para la familia.
 * Muestra datos de la niñera asignada + PIN de check-in.
 */
export const ConfirmedFamilyView = ({ booking }) => {
    const nanny = booking?.nanny ?? {};

    return (
        <div className="space-y-4">
            {/* Cabecera niñera */}
            <Card className="p-5 space-y-3">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Niñera asignada</p>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-poppins flex-shrink-0">
                        {(nanny.name || 'N').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 font-poppins">{nanny.name || 'Niñera asignada'}</p>
                        <p className="text-xs text-gray-500">{nanny.neighborhood}</p>
                    </div>
                </div>
                {nanny.phone && <CallButton phone={nanny.phone} label={`Llamar a ${nanny.name?.split(' ')[0] ?? 'la niñera'}`} />}
            </Card>

            {/* Detalles del servicio */}
            <Card className="p-5 space-y-2">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Detalles del servicio</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} className="text-primary flex-shrink-0" />
                    <span>{fmtDate(booking.scheduled_date, booking.scheduled_time)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={14} className="text-primary flex-shrink-0" />
                    <span>{booking.duration_hours} hora{booking.duration_hours !== 1 ? 's' : ''}</span>
                </div>
                {booking.children_count > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={14} className="text-primary flex-shrink-0" />
                        <span>{booking.children_count} niño{booking.children_count !== 1 ? 's' : ''}</span>
                    </div>
                )}
            </Card>

            {/* PIN */}
            <PinDisplay pin={booking?.check_in_code ?? booking?.pin_code} />
        </div>
    );
};
