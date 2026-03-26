import { useState, useEffect, useCallback } from 'react';
import { getSearchingDetail } from '../services/searchingService';
import { subscribeToBooking } from '../services/realtimeService';

const POLL_MS = 4000; // fallback poll mientras status = searching

/**
 * Mantiene el detalle de un booking en cascada actualizado.
 * Combina poll + Realtime para detectar transiciones de estado al instante.
 *
 * @param {number} bookingId
 * @param {number} familyId  - profile.id de la familia (para Realtime filter)
 * @returns {{ detail: object|null, loading: boolean, terminated: boolean }}
 *   terminated = true cuando status ya no es 'searching'
 */
export function useSearchingBooking(bookingId, familyId) {
    const [detail, setDetail]         = useState(null);
    const [loading, setLoading]       = useState(true);
    const [terminated, setTerminated] = useState(false);

    const fetch = useCallback(async () => {
        if (!bookingId) return;
        try {
            const data = await getSearchingDetail(bookingId);
            if (data?.status !== 'searching') {
                setTerminated(true);
                setDetail(data);
            } else {
                setDetail(data);
            }
        } catch {
            // silenciar errores de red
        } finally {
            setLoading(false);
        }
    }, [bookingId]);

    // Fetch inicial + poll
    useEffect(() => {
        fetch();
        if (terminated) return;
        const id = setInterval(fetch, POLL_MS);
        return () => clearInterval(id);
    }, [fetch, terminated]);

    // Realtime: cuando la fila cambia (ej: nanny acepta → confirmed), fetch inmediato
    useEffect(() => {
        if (!familyId) return;
        const unsub = subscribeToBooking('family_id', familyId, (updated) => {
            if (updated.id === bookingId) fetch();
        });
        return unsub;
    }, [familyId, bookingId, fetch]);

    return { detail, loading, terminated };
}
