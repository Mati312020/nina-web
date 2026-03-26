import { useEffect } from 'react';
import { useRealtimeBooking } from './useRealtimeBooking';

/**
 * Hook para la pantalla de servicio confirmado.
 * Mantiene el booking sincronizado via Realtime.
 * Expone helper `needsRedirect` para que la página redirija
 * cuando el estado ya no sea 'confirmed'.
 *
 * @param {'family'|'nanny'} role
 * @param {number}           profileId
 * @returns {{ booking, loading, nextStatus }}
 *   nextStatus — el nuevo status cuando ya no es confirmed (para redirigir)
 */
export function useConfirmedService(role, profileId) {
    const { booking, loading } = useRealtimeBooking(role, profileId);

    // Si el booking existe pero ya no es "confirmed", el componente
    // puede leer "booking.status" para saber adónde redirigir.
    const isConfirmed = booking?.status === 'confirmed';
    const nextStatus  = !isConfirmed && booking?.status ? booking.status : null;

    return { booking: isConfirmed ? booking : null, loading, nextStatus };
}
