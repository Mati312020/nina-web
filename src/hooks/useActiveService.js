import { useState, useEffect } from 'react';
import { useRealtimeBooking } from './useRealtimeBooking';
import { calcRemaining } from '../helpers/timeHelpers';

/**
 * Hook para el servicio en progreso.
 * Combina Realtime del booking con countdown ticker de 1s.
 * Solo expone el booking cuando status === 'in_progress'.
 *
 * @returns {{ booking, loading, remaining: number }}
 */
export function useActiveService(role, profileId) {
    const { booking: live, loading } = useRealtimeBooking(role, profileId);
    const [remaining, setRemaining] = useState(0);

    const booking = live?.status === 'in_progress' ? live : null;

    useEffect(() => {
        if (!booking?.started_at) return;
        const tick = () => setRemaining(calcRemaining(booking.started_at, booking.duration_hours));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [booking?.started_at, booking?.duration_hours]);

    return { booking, loading, remaining };
}
