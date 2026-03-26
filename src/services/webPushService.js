import { api } from '../lib/api';

const VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

/**
 * Convierte una clave VAPID base64url a Uint8Array.
 */
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw     = window.atob(base64);
    return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

/**
 * Registra la subscripción Web Push para el usuario dado.
 * Requiere que el Service Worker esté activo y que haya permiso de notificaciones.
 * @param {number} userId - profile.id
 * @returns {PushSubscription|null}
 */
export async function subscribeWebPush(userId) {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
    if (!VAPID_KEY) return null;

    try {
        const reg  = await navigator.serviceWorker.ready;
        const sub  = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_KEY),
        });
        await api.post('/notifications/register-web-subscription', {
            user_id: userId,
            subscription: sub.toJSON(),
        });
        return sub;
    } catch (e) {
        console.warn('[webPush] subscribe error:', e);
        return null;
    }
}

/**
 * Desuscribe al usuario del canal Web Push.
 */
export async function unsubscribeWebPush() {
    if (!('serviceWorker' in navigator)) return;
    try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) await sub.unsubscribe();
    } catch (e) {
        console.warn('[webPush] unsubscribe error:', e);
    }
}
