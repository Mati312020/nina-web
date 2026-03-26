import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { subscribeToBooking } from '../services/realtimeService';

const ACTIVE_STATUSES = [
    'searching', 'confirmed', 'on_the_way', 'arrived', 'in_progress',
];

/**
 * Mantiene el booking activo del usuario sincronizado via Supabase Realtime.
 * Hace fetch inicial via API REST y luego escucha cambios en tiempo real.
 *
 * @param {'family'|'nanny'} role
 * @param {number|null}       profileId  - profile.id (int)
 * @returns {{ booking: object|null, loading: boolean, refresh: () => void }}
 */
export function useRealtimeBooking(role, profileId) {
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    const endpoint = role === 'nanny'
        ? `/bookings/focus/nanny/${profileId}`
        : `/bookings/focus/family/${profileId}`;

    const dbField = role === 'nanny' ? 'nanny_id' : 'family_id';

    const fetchBooking = useCallback(async () => {
        if (!profileId) return;
        try {
            const data = await api.get(endpoint);
            const isActive = data && ACTIVE_STATUSES.includes(data.status);
            setBooking(isActive ? data : null);
        } catch {
            setBooking(null);
        } finally {
            setLoading(false);
        }
    }, [profileId, endpoint]);

    // Fetch inicial
    useEffect(() => {
        fetchBooking();
    }, [fetchBooking]);

    // Realtime: actualiza el booking cuando el servidor lo modifica
    useEffect(() => {
        if (!profileId) return;

        const unsub = subscribeToBooking(dbField, profileId, (updated) => {
            const isActive = ACTIVE_STATUSES.includes(updated.status);
            setBooking(isActive ? updated : null);
        });

        return unsub;
    }, [profileId, dbField]);

    return { booking, loading, refresh: fetchBooking };
}
