import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

/**
 * Hook de bandeja de notificaciones.
 *
 * Combina dos fuentes:
 *  1. `notifications`          — personales del usuario (booking events, mensajes admin)
 *  2. `broadcast_notifications` — del sistema para todos o por rol (anuncios, mejoras)
 *
 * Devuelve:
 *   items       — array unificado ordenado por created_at DESC
 *   unreadCount — cantidad de no leídas
 *   loading
 *   markAllRead()   — marca todas las personales como leídas
 *   dismiss(id)     — descarta un broadcast (inserta en notification_dismissals)
 *   refresh()
 */
export const useNotifications = () => {
    const { user, profile } = useAuth();
    const [personal, setPersonal]     = useState([]);
    const [broadcasts, setBroadcasts] = useState([]);
    const [dismissed, setDismissed]   = useState(new Set());
    const [loading, setLoading]       = useState(true);

    const fetchAll = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            // 1. Notificaciones personales (propias + no expiradas)
            const { data: personalData } = await supabase
                .from('notifications')
                .select('*')
                .eq('auth_id', user.id)
                .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
                .order('created_at', { ascending: false })
                .limit(50);

            // 2. Broadcasts activos para el rol del usuario (o todos)
            const role = profile?.role ?? 'all';
            const { data: broadcastData } = await supabase
                .from('broadcast_notifications')
                .select('*')
                .eq('is_active', true)
                .in('target_role', ['all', role])
                .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
                .order('created_at', { ascending: false })
                .limit(20);

            // 3. Qué broadcasts ya descartó este usuario
            const { data: dismissalData } = await supabase
                .from('notification_dismissals')
                .select('notification_id')
                .eq('auth_id', user.id);

            const dismissedIds = new Set((dismissalData ?? []).map(d => d.notification_id));

            setPersonal(personalData ?? []);
            setBroadcasts(broadcastData ?? []);
            setDismissed(dismissedIds);
        } catch (err) {
            console.error('[useNotifications] Error:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.id, profile?.role]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // Unificar: broadcasts no descartados + personales, ordenados por fecha
    const activeBroadcasts = broadcasts
        .filter(b => !dismissed.has(b.id))
        .map(b => ({ ...b, _source: 'broadcast', is_read: false }));

    const personalMapped = personal.map(n => ({ ...n, _source: 'personal' }));

    const items = [...activeBroadcasts, ...personalMapped].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    const unreadCount = items.filter(n => !n.is_read).length;

    const markAllRead = useCallback(async () => {
        if (!user?.id || personal.filter(n => !n.is_read).length === 0) return;
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('auth_id', user.id)
            .eq('is_read', false);
        setPersonal(prev => prev.map(n => ({ ...n, is_read: true })));
    }, [user?.id, personal]);

    const dismiss = useCallback(async (broadcastId) => {
        if (!user?.id) return;
        await supabase
            .from('notification_dismissals')
            .insert({ auth_id: user.id, notification_id: broadcastId })
            .select();
        setDismissed(prev => new Set([...prev, broadcastId]));
    }, [user?.id]);

    return { items, unreadCount, loading, markAllRead, dismiss, refresh: fetchAll };
};
