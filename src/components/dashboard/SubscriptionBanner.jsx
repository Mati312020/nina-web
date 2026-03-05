import React from 'react';
import { AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Banner que muestra el estado de la suscripción cuando está próxima a vencer o ya venció.
 *
 * - Ningún banner: suscripción activa con más de 7 días restantes, o sin suscripción previa.
 * - Amarillo: vence dentro de 1-7 días → "Renovar antes de que venza"
 * - Rojo: ya venció → "Tu suscripción venció. Renová para seguir accediendo."
 *
 * Props:
 *   isSubscribed  — boolean del hook useSubscription
 *   expiresAt     — string ISO o null del hook useSubscription
 *   onRenew       — función que abre el checkout (subscribe del hook)
 */
export const SubscriptionBanner = ({ isSubscribed, expiresAt, onRenew }) => {
    if (!expiresAt) return null;

    const now = Date.now();
    const expiry = new Date(expiresAt).getTime();
    const msLeft = expiry - now;
    const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));

    // Más de 7 días: sin banner
    if (isSubscribed && daysLeft > 7) return null;

    const isExpired = msLeft <= 0;

    if (isExpired) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <XCircle size={18} className="text-danger flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-red-800 font-poppins">Suscripción vencida</p>
                        <p className="text-xs text-red-600 font-nunito mt-0.5">
                            Tu suscripción venció. Renovála para seguir viendo contactos y acceder al mercado.
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="flex-shrink-0 text-danger border-danger/40 hover:bg-red-50 gap-1.5 text-sm"
                    onClick={onRenew}
                >
                    <RefreshCw size={14} />
                    Renovar
                </Button>
            </div>
        );
    }

    // Dentro de 1-7 días: warning
    return (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-amber-800 font-poppins">
                        Tu suscripción vence {daysLeft === 1 ? 'mañana' : `en ${daysLeft} días`}
                    </p>
                    <p className="text-xs text-amber-700 font-nunito mt-0.5">
                        Renová ahora para no perder el acceso al mercado de largo plazo.
                    </p>
                </div>
            </div>
            <Button
                variant="outline"
                className="flex-shrink-0 text-amber-700 border-amber-300 hover:bg-amber-50 gap-1.5 text-sm"
                onClick={onRenew}
            >
                <RefreshCw size={14} />
                Renovar
            </Button>
        </div>
    );
};
