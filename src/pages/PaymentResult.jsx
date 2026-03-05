import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const RESULT_CONFIG = {
    success: {
        Icon: CheckCircle,
        iconClass: 'text-success',
        bgClass: 'bg-green-50',
        title: '¡Pago exitoso!',
        message: 'Tu suscripción fue activada. Ya podés ver los datos de contacto de niñeras y familias.',
    },
    failure: {
        Icon: XCircle,
        iconClass: 'text-danger',
        bgClass: 'bg-red-50',
        title: 'Pago fallido',
        message: 'No pudimos procesar tu pago. Podés intentarlo de nuevo desde el dashboard.',
    },
    pending: {
        Icon: Clock,
        iconClass: 'text-yellow-500',
        bgClass: 'bg-yellow-50',
        title: 'Pago pendiente',
        message: 'Tu pago está siendo procesado. Te notificaremos cuando se confirme.',
    },
};

/**
 * Página de resultado de pago de suscripción.
 *
 * Fixes v2:
 * - useRef para refetch evita relanzar el polling cuando user cambia async
 * - cancelled flag en cleanup evita llamadas post-unmount
 * - Auto-navega al dashboard cuando isSubscribed cambia a true (no espera al botón)
 * - navigate() en vez de <Link> para evitar depender de profile en el render
 * - dashPath fallback a 'family' si profile aún no cargó (family es el caso más común)
 */
export const PaymentResult = ({ outcome }) => {
    const config  = RESULT_CONFIG[outcome] ?? RESULT_CONFIG.pending;
    const { Icon } = config;

    const navigate  = useNavigate();
    const { profile } = useAuth();
    const { isSubscribed, refetch } = useSubscription();

    const [checking, setChecking] = useState(outcome === 'success');

    // Fallback a 'family' si profile todavía no cargó al montar el componente.
    // En RoleDashboard, si el rol no coincide con la ruta, redirige al correcto.
    const dashPath = profile?.role === 'nanny' ? '/dashboard/nanny' : '/dashboard/family';

    // ─────────────────────────────────────────────────────────────────────────
    // Ref para acceder siempre a la versión más nueva de refetch sin incluirlo
    // en los deps del polling (evita reiniciar la cadena cuando user cambia).
    // ─────────────────────────────────────────────────────────────────────────
    const refetchRef = useRef(refetch);
    useEffect(() => { refetchRef.current = refetch; }, [refetch]);

    // ─────────────────────────────────────────────────────────────────────────
    // Auto-navegar en cuanto isSubscribed cambia a true durante el polling.
    // El timeout de 1.5s permite que el usuario lea "¡Suscripción activa!".
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!isSubscribed || outcome !== 'success') return;
        const t = setTimeout(() => navigate(dashPath, { replace: true }), 1500);
        return () => clearTimeout(t);
    }, [isSubscribed, outcome, navigate, dashPath]);

    // ─────────────────────────────────────────────────────────────────────────
    // Polling: una sola cadena, arranca una vez, cleanup con cancelled flag.
    // Deps: solo [outcome] → nunca se reinicia por cambios de user/refetch.
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (outcome !== 'success') return;
        let cancelled = false;
        let attempts  = 0;
        const MAX_ATTEMPTS = 4;

        const poll = async () => {
            if (cancelled) return;
            await refetchRef.current();
            attempts++;
            if (cancelled) return;
            if (attempts < MAX_ATTEMPTS) {
                setTimeout(poll, 3000);
            } else {
                setChecking(false);
            }
        };

        const t = setTimeout(poll, 2000); // primer intento: dar tiempo al webhook
        return () => { cancelled = true; clearTimeout(t); };
    }, [outcome]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
            <Card className={`max-w-md w-full text-center p-10 border-none shadow-xl ${config.bgClass}`}>

                <Icon size={60} className={`${config.iconClass} mx-auto mb-5`} />

                <h2 className="text-2xl font-bold text-gray-900 font-poppins mb-3">
                    {config.title}
                </h2>
                <p className="text-gray-600 font-nunito mb-8 leading-relaxed">
                    {config.message}
                </p>

                {/* Estado: verificando */}
                {outcome === 'success' && checking && !isSubscribed && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Verificando suscripción...</span>
                    </div>
                )}

                {/* Estado: suscripción confirmada → redirigiendo */}
                {outcome === 'success' && isSubscribed && (
                    <div className="flex items-center justify-center gap-2 text-sm text-success mb-6 font-medium">
                        <CheckCircle size={14} />
                        <span>¡Suscripción activa! Redirigiendo...</span>
                    </div>
                )}

                {/* Botón: siempre visible en failure/pending; en success aparece si polling agotó */}
                {(outcome !== 'success' || (!checking && !isSubscribed)) && (
                    <Button
                        className="w-full"
                        onClick={() => navigate(dashPath, { replace: true })}
                    >
                        Volver al Dashboard
                    </Button>
                )}

            </Card>
        </div>
    );
};
