import { supabase } from '../lib/supabase';

/**
 * Suscribe a cambios en la tabla bookings para un usuario dado.
 *
 * @param {'family_id'|'nanny_id'} field  - Columna a filtrar
 * @param {number}                  userId - ID del usuario (profile.id)
 * @param {(booking: object) => void} onUpdate - Callback con el nuevo estado del booking
 * @returns {() => void} Función de limpieza (unsuscribe)
 */
export function subscribeToBooking(field, userId, onUpdate) {
    const channelName = `booking-${field}-${userId}`;

    const channel = supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'bookings',
                filter: `${field}=eq.${userId}`,
            },
            (payload) => onUpdate(payload.new)
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}
