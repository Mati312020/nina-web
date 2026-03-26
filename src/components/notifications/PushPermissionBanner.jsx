import React from 'react';
import { Bell, X } from 'lucide-react';
import { useWebPush } from '../../hooks/useWebPush';
import { useAuth } from '../../context/AuthContext';

/**
 * Banner que solicita permiso para notificaciones push del browser.
 * Se oculta si ya está concedido, denegado, o el usuario lo descarta.
 */
export const PushPermissionBanner = () => {
    const { profile } = useAuth();
    const { permission, subscribed, subscribe } = useWebPush(profile?.id);
    const [dismissed, setDismissed] = React.useState(
        () => sessionStorage.getItem('push_banner_dismissed') === '1'
    );

    const handleDismiss = () => {
        sessionStorage.setItem('push_banner_dismissed', '1');
        setDismissed(true);
    };

    // No mostrar si: no soportado, ya otorgado, denegado explícitamente, o subscripto
    if (!('Notification' in window)) return null;
    if (permission === 'granted' || permission === 'denied') return null;
    if (subscribed || dismissed) return null;

    return (
        <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <Bell size={18} className="text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">Activar notificaciones</p>
                <p className="text-xs text-gray-500 mt-0.5">
                    Recibí alertas de solicitudes y novedades en este navegador.
                </p>
                <button onClick={subscribe}
                    className="mt-2 text-xs font-semibold text-primary hover:underline">
                    Activar ahora
                </button>
            </div>
            <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <X size={16} />
            </button>
        </div>
    );
};
