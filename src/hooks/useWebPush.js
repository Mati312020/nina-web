import { useState, useEffect } from 'react';
import { subscribeWebPush, unsubscribeWebPush } from '../services/webPushService';

/**
 * Gestiona el estado del permiso de notificaciones push en el browser.
 * @param {number|null} userId - profile.id del usuario autenticado
 * @returns {{ permission, subscribed, subscribe, unsubscribe }}
 */
export function useWebPush(userId) {
    const [permission, setPermission] = useState(
        'Notification' in window ? Notification.permission : 'denied'
    );
    const [subscribed, setSubscribed] = useState(false);

    // Verificar si ya hay subscripción activa
    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.ready.then(async (reg) => {
            const sub = await reg.pushManager.getSubscription();
            setSubscribed(!!sub);
        }).catch(() => {});
    }, []);

    const subscribe = async () => {
        if (!userId) return;
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === 'granted') {
            const sub = await subscribeWebPush(userId);
            setSubscribed(!!sub);
        }
    };

    const unsubscribe = async () => {
        await unsubscribeWebPush();
        setSubscribed(false);
    };

    return { permission, subscribed, subscribe, unsubscribe };
}
