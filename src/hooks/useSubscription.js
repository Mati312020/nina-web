import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

/**
 * Hook para gestionar el estado de suscripción del usuario.
 *
 * Retorna:
 *   isSubscribed  — true si tiene suscripción activa y no vencida
 *   expiresAt     — fecha de vencimiento de la suscripción
 *   loading       — true mientras se verifica el estado
 *   subscribe()   — crea el checkout de MP y abre la URL en nueva pestaña
 *   refetch()     — re-verifica el estado (útil post-pago)
 */
export const useSubscription = () => {
    const { user } = useAuth();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [expiresAt, setExpiresAt] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkStatus = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const data = await api.get(`/long-term/subscription/status?auth_id=${user.id}`);
            setIsSubscribed(data.is_subscribed);
            setExpiresAt(data.expires_at);
        } catch (err) {
            console.error('[useSubscription] Error verificando suscripción:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    const subscribe = async () => {
        if (!user) throw new Error('No hay usuario autenticado');
        const data = await api.post('/long-term/subscribe', { auth_id: user.id });
        if (data.checkout_url) {
            window.open(data.checkout_url, '_blank', 'noopener,noreferrer');
        }
        return data;
    };

    return {
        isSubscribed,
        expiresAt,
        loading,
        subscribe,
        refetch: checkStatus,
    };
};
