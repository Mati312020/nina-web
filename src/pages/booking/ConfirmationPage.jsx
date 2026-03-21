import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Users, Clock, Calendar, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { CostBreakdown } from '../../components/booking/CostBreakdown';
import { Button } from '../../components/ui/Button';

const fmt = (val) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

/**
 * Paso 3 (final) del wizard — confirmar reserva y pagar.
 *
 * Flujo:
 *   1. POST /bookings/  → crea el booking con estado pending_payment
 *   2. POST /payments/create-link/{id}?is_web=true → obtiene checkout_url de MP
 *   3. window.location.href = checkout_url  (MP redirige a /booking/payment/*)
 */
export const ConfirmationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state    = location.state;
    const { profile } = useAuth();

    if (!state?.selectedNannies || !state?.totalAmount) {
        navigate('/booking/search', { replace: true });
        return null;
    }

    const {
        selectedNannies,
        scheduledDate,
        scheduledTime,
        durationHours,
        hourlyRate,
        offeredPrice,
        appFee,
        totalAmount,
        pricingMode,
    } = state;

    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);

    // Evitar crear el booking dos veces si el usuario hace doble click
    const bookingCreatedRef = useRef(null);

    const handlePay = async () => {
        if (loading) return;
        setLoading(true);
        setError(null);

        try {
            // Paso 1: crear booking (idempotente: si ya lo creamos, reusar el id)
            let bookingId = bookingCreatedRef.current;
            if (!bookingId) {
                const bookingData = await api.post('/bookings/', {
                    family_id:           profile.id,   // int DB, NO el UUID de Supabase
                    selected_candidates: selectedNannies.map(n => n.id),
                    scheduled_date:      scheduledDate  ?? null,
                    scheduled_time:      scheduledTime  ?? null,
                    duration_hours:      durationHours,
                    hourly_rate:         hourlyRate,
                    offered_price:       offeredPrice,
                    app_fee:             appFee,
                    total_amount:        totalAmount,
                    pricing_mode:        pricingMode,
                });
                bookingId = bookingData.booking_id ?? bookingData.id;
                bookingCreatedRef.current = bookingId;
            }

            // Paso 2: obtener checkout URL (back_urls apuntan a /booking/payment/*)
            const paymentData = await api.post(`/payments/create-link/${bookingId}?is_web=true`);
            const checkoutUrl = paymentData.checkout_url;

            if (!checkoutUrl) throw new Error('No se recibió la URL de pago');

            // Paso 3: redirigir a MercadoPago
            window.location.href = checkoutUrl;

        } catch (err) {
            console.error('[ConfirmationPage] Error:', err);
            setError('Hubo un problema al procesar la solicitud. Intentá de nuevo.');
            setLoading(false);
        }
    };

    const children = profile?.children ?? [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="font-bold text-gray-900 font-poppins">Confirmar Reserva</h1>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 py-6 space-y-5 pb-32">
                {/* Resumen de candidatas */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Candidatas seleccionadas</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedNannies.map(n => (
                            <span key={n.id} className="text-sm bg-gray-100 text-gray-700 rounded-full px-3 py-1">
                                {n.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Detalles del servicio */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Detalles del servicio</p>

                    {scheduledDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Calendar size={15} className="text-primary flex-shrink-0" />
                            <span>
                                {new Date(scheduledDate + 'T12:00:00').toLocaleDateString('es-AR', {
                                    weekday: 'long', day: 'numeric', month: 'long'
                                })}
                                {scheduledTime && ` · ${scheduledTime}`}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock size={15} className="text-primary flex-shrink-0" />
                        <span>{durationHours} hora{durationHours !== 1 ? 's' : ''} de servicio</span>
                    </div>

                    {children.length > 0 && (
                        <div className="flex items-start gap-2 text-sm text-gray-700">
                            <Users size={15} className="text-primary flex-shrink-0 mt-0.5" />
                            <span>
                                {children.map(c => `${c.nickname} (${c.age} años)`).join(' · ')}
                            </span>
                        </div>
                    )}
                </div>

                {/* Desglose de costos */}
                <CostBreakdown durationHours={durationHours} hourlyRate={hourlyRate} />

                {/* Aviso de notificación por email */}
                <div className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-2xl p-4">
                    <Mail size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-teal-800">
                            Te notificaremos cuando una niñera acepte
                        </p>
                        <p className="text-xs text-teal-700 mt-0.5">
                            Recibirás un email en <strong>{profile?.notification_email || profile?.email}</strong>{' '}
                            cuando se confirme la reserva o si ninguna candidata esté disponible.
                        </p>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
                        <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
                <div className="max-w-lg mx-auto">
                    <Button
                        variant="primary"
                        className="w-full text-base font-semibold"
                        onClick={handlePay}
                        isLoading={loading}
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : `Pagar ${fmt(totalAmount)} con MercadoPago`}
                    </Button>
                    <p className="text-xs text-center text-gray-400 mt-2">
                        Serás redirigido/a a MercadoPago de forma segura
                    </p>
                </div>
            </div>
        </div>
    );
};
