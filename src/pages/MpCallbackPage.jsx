import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useMpConnect } from '../hooks/useMpConnect';
import { useAuth } from '../context/AuthContext';

const REDIRECT_DELAY = 3500; // ms

const ERROR_MESSAGES = {
    rejected:             'Cancelaste la autorización de MercadoPago.',
    missing_params:       'Faltan parámetros en la respuesta de MercadoPago.',
    invalid_state:        'La sesión de autorización no es válida.',
    user_not_found:       'No se encontró tu perfil. Intentá de nuevo.',
    token_exchange_failed:'No se pudo obtener el token de acceso.',
    save_failed:          'No se pudo guardar la vinculación. Intentá de nuevo.',
};

/**
 * Landing page del callback OAuth de MercadoPago para niñeras que usan nina-web.
 *
 * El backend redirige aquí tras completar (o fallar) el OAuth:
 *   /mp-conectado?success=true
 *   /mp-conectado?success=false&reason=rejected
 *
 * No hace llamadas API — el backend ya guardó los tokens.
 * Refresca el status MP del hook y redirige al dashboard en 3.5s.
 */
export const MpCallbackPage = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { refresh } = useMpConnect(profile?.id);

    const params  = new URLSearchParams(window.location.search);
    const success = params.get('success') === 'true';
    const reason  = params.get('reason') || '';

    const [countdown, setCountdown] = useState(Math.ceil(REDIRECT_DELAY / 1000));

    useEffect(() => {
        if (success) refresh(); // actualizar estado en cache si estamos en el dashboard

        const interval = setInterval(() => {
            setCountdown(c => c - 1);
        }, 1000);

        const timer = setTimeout(() => {
            navigate('/dashboard/nanny', { replace: true });
        }, REDIRECT_DELAY);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [navigate, refresh, success]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-sm w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-8 text-center space-y-5">
                {/* Icono */}
                <div className="flex justify-center">
                    {success
                        ? <CheckCircle size={56} className="text-green-500" />
                        : <XCircle    size={56} className="text-red-500"   />
                    }
                </div>

                {/* Título */}
                <div>
                    <h1 className="text-xl font-bold text-gray-900 font-poppins mb-2">
                        {success ? '¡Cuenta vinculada!' : 'No se pudo vincular'}
                    </h1>
                    <p className="text-sm text-gray-600">
                        {success
                            ? 'Tu cuenta de MercadoPago fue conectada exitosamente. Ya podés recibir pagos directamente en tu cuenta.'
                            : (ERROR_MESSAGES[reason] || 'Ocurrió un error durante la vinculación.')
                        }
                    </p>
                </div>

                {/* Redirección automática */}
                <p className="text-xs text-gray-400">
                    Redirigiendo al dashboard en {countdown}s…
                </p>

                <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => navigate('/dashboard/nanny', { replace: true })}
                >
                    Ir al Dashboard
                </Button>
            </div>
        </div>
    );
};
