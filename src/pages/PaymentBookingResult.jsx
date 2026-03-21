import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';

const OUTCOMES = {
    success: {
        icon:    <CheckCircle size={56} className="text-green-500" />,
        title:   '¡Pago recibido!',
        message: 'Estamos buscando tu niñera entre las candidatas seleccionadas.',
        note:    'Te enviaremos un email cuando una niñera acepte la solicitud, o si ninguna está disponible.',
        color:   'text-green-700 bg-green-50 border-green-200',
        cta:     'Ir al Dashboard',
    },
    failure: {
        icon:    <XCircle size={56} className="text-red-500" />,
        title:   'El pago no pudo procesarse',
        message: 'No se realizó ningún cargo. Podés intentar nuevamente.',
        note:    null,
        color:   'text-red-700 bg-red-50 border-red-200',
        cta:     'Volver al Dashboard',
    },
    pending: {
        icon:    <Clock size={56} className="text-amber-500" />,
        title:   'Pago en verificación',
        message: 'Tu pago está siendo procesado por MercadoPago.',
        note:    'Te notificaremos por email cuando se confirme.',
        color:   'text-amber-700 bg-amber-50 border-amber-200',
        cta:     'Ir al Dashboard',
    },
};

/**
 * Página de resultado del pago de una reserva last-minute.
 * Separada de PaymentResult (que es para suscripciones).
 *
 * No hace polling — el waterfall corre en background y notifica por email.
 * La familia puede ver el estado actualizado en el dashboard.
 */
export const PaymentBookingResult = () => {
    const navigate = useNavigate();
    const { outcome: outcomeParam } = useParams();

    // Determinar outcome desde la URL: /booking/payment/success | failure | pending
    const outcome = OUTCOMES[outcomeParam] ? outcomeParam : 'pending';
    const config  = OUTCOMES[outcome];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-sm w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-8 text-center space-y-6">
                {/* Icono */}
                <div className="flex justify-center">
                    {config.icon}
                </div>

                {/* Título */}
                <div>
                    <h1 className="text-xl font-bold text-gray-900 font-poppins mb-2">
                        {config.title}
                    </h1>
                    <p className="text-sm text-gray-600">
                        {config.message}
                    </p>
                </div>

                {/* Nota con email */}
                {config.note && (
                    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left ${config.color}`}>
                        <Mail size={16} className="flex-shrink-0 mt-0.5" />
                        <p className="text-xs">{config.note}</p>
                    </div>
                )}

                {/* CTA */}
                <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => navigate('/dashboard/family')}
                >
                    {config.cta}
                </Button>

                {outcome === 'failure' && (
                    <button
                        onClick={() => navigate('/booking/search')}
                        className="text-sm text-primary underline"
                    >
                        Intentar nueva búsqueda
                    </button>
                )}
            </div>
        </div>
    );
};
