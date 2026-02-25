import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
 * Props: outcome — "success" | "failure" | "pending"
 *
 * En caso exitoso, hace polling de hasta 3 intentos para verificar
 * que el webhook ya activó la suscripción.
 */
export const PaymentResult = ({ outcome }) => {
    const config = RESULT_CONFIG[outcome] ?? RESULT_CONFIG.pending;
    const { Icon } = config;
    const { profile } = useAuth();
    const { refetch } = useSubscription();
    const [checking, setChecking] = useState(outcome === 'success');

    useEffect(() => {
        if (outcome !== 'success') return;

        let attempts = 0;
        const MAX_ATTEMPTS = 4;

        const poll = async () => {
            await refetch();
            attempts++;
            if (attempts < MAX_ATTEMPTS) {
                setTimeout(poll, 3000);
            } else {
                setChecking(false);
            }
        };

        // Primer intento con delay para dar tiempo al webhook
        setTimeout(poll, 2000);
    }, [outcome, refetch]);

    const dashPath = profile?.role === 'family'
        ? '/dashboard/family'
        : '/dashboard/nanny';

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

                {outcome === 'success' && checking && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Verificando suscripción...</span>
                    </div>
                )}

                <Link to={dashPath}>
                    <Button className="w-full">
                        Volver al Dashboard
                    </Button>
                </Link>
            </Card>
        </div>
    );
};
