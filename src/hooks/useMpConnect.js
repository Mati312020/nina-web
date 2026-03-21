import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Hook para gestionar la vinculación de cuenta MercadoPago de una niñera.
 *
 * Parámetros:
 *   nannyId — ID de la niñera (profile.id, int)
 *
 * Retorna:
 *   status   — { connected, needs_reconnect, mp_account_email, expires_at } | null
 *   loading  — true durante el fetch inicial o acciones
 *   connect()    — inicia el flujo OAuth de MP (redirección completa)
 *   disconnect() — desvincula la cuenta MP
 *   refresh()    — re-consulta el estado
 */
export const useMpConnect = (nannyId) => {
    const [status, setStatus]   = useState(null);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        if (!nannyId) return;
        setLoading(true);
        try {
            const data = await api.get(`/nanny/mp/status/${nannyId}`);
            setStatus(data);
        } catch (err) {
            console.error('[useMpConnect] Error consultando estado MP:', err);
        } finally {
            setLoading(false);
        }
    }, [nannyId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const connect = useCallback(() => {
        if (!nannyId) return;
        // El redirect_to lleva a la página de callback web.
        // Se codifica en el state del OAuth para no alterar la redirect_uri registrada en MP.
        const redirectTo = `${window.location.origin}/mp-conectado`;
        const url = `${API_URL}/nanny/mp/connect?nanny_id=${nannyId}&redirect_to=${encodeURIComponent(redirectTo)}`;
        window.location.href = url;
    }, [nannyId]);

    const disconnect = useCallback(async () => {
        if (!nannyId) return;
        setLoading(true);
        try {
            await api.delete(`/nanny/mp/disconnect/${nannyId}`);
            setStatus(prev => ({ ...prev, connected: false, needs_reconnect: true, mp_account_email: null }));
        } catch (err) {
            console.error('[useMpConnect] Error desconectando MP:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [nannyId]);

    return { status, loading, connect, disconnect, refresh };
};
