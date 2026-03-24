import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, CheckCircle2, Star, Smartphone } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const POLL_INTERVAL = 15000;

const fmt = (val) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

const fmtDate = (date, time) => {
    const parts = [];
    if (date) parts.push(new Date(date + 'T12:00:00').toLocaleDateString('es-AR', {
        weekday: 'long', day: 'numeric', month: 'long'
    }));
    if (time) parts.push(`a las ${time.slice(0, 5)}`);
    return parts.join(' ') || 'Fecha a confirmar';
};

/**
 * Calcula si ya pasó 1 hora desde el inicio pactado del servicio.
 * Si no hay hora pactada, habilita review apenas esté confirmado.
 */
const isReviewTime = (booking) => {
    if (!booking?.scheduled_date) return true;
    const timeStr = booking.scheduled_time ?? '00:00';
    const start = new Date(`${booking.scheduled_date}T${timeStr}:00`);
    const reviewFrom = new Date(start.getTime() + (booking.duration_hours ?? 1) * 60 * 60 * 1000);
    return new Date() >= reviewFrom;
};

/**
 * Card de reserva activa (confirmada) para familia y niñera.
 * - Muestra detalles del servicio mientras status = confirmed
 * - Pasada 1 hora del inicio: muestra formulario de rating
 * - Al enviar review: desaparece del dashboard
 *
 * Props:
 *   role: "family" | "nanny"
 */
export const ActiveBookingCard = ({ role }) => {
    const { profile } = useAuth();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading]  = useState(true);
    const [canReview, setCanReview] = useState(false);

    // Review form state
    const [stars, setStars]     = useState(0);
    const [hover, setHover]     = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone]       = useState(false);

    const fetchBooking = useCallback(async () => {
        if (!profile?.id) return;
        try {
            const endpoint = role === 'nanny'
                ? `/bookings/focus/nanny/${profile.id}`
                : `/bookings/focus/family/${profile.id}`;
            const data = await api.get(endpoint);
            // Solo mostrar si está confirmado (no in_progress, etc. — esos los maneja la app)
            if (data?.status === 'confirmed') {
                setBooking(data);
                setCanReview(isReviewTime(data));
            } else {
                setBooking(null);
            }
        } catch {
            // silenciar
        } finally {
            setLoading(false);
        }
    }, [profile?.id, role]);

    useEffect(() => {
        fetchBooking();
        const id = setInterval(() => {
            fetchBooking();
            // También re-evaluar si ya es hora de review
            if (booking) setCanReview(isReviewTime(booking));
        }, POLL_INTERVAL);
        return () => clearInterval(id);
    }, [fetchBooking, booking]);

    const handleSubmitReview = async () => {
        if (stars === 0 || submitting) return;
        setSubmitting(true);
        try {
            // reviewer = quien escribe, reviewed = el otro
            const reviewerId = profile.id;
            const reviewedId = role === 'family'
                ? booking.nanny?.id
                : booking.family?.id ?? booking.family_id;

            await api.post('/reviews/', {
                booking_id:  booking.id,
                reviewer_id: reviewerId,
                reviewed_id: reviewedId,
                stars,
                comment: comment.trim() || null,
            });
            setDone(true);
            // Sacar el card después de un momento para dar feedback visual
            setTimeout(() => setBooking(null), 2000);
        } catch (err) {
            console.error('[ActiveBookingCard] Review error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !booking) return null;

    const otherPerson = role === 'family' ? booking.nanny : booking.family;
    const otherName   = otherPerson?.name || (role === 'family' ? 'Niñera' : 'Familia');
    const earnings    = booking.offered_price ? Math.round(booking.offered_price * 0.94) : null;

    return (
        <div className="mb-6">
            <h3 className="font-semibold text-gray-800 font-poppins text-sm mb-3 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-green-600" />
                Reserva Confirmada
            </h3>

            <Card className={`border-l-4 p-4 space-y-3 ${canReview ? 'border-l-amber-400' : 'border-l-green-500'}`}>
                {/* Contraparte */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-gray-900 font-poppins text-sm">{otherName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{fmtDate(booking.scheduled_date, booking.scheduled_time)}</p>
                    </div>
                    {role === 'nanny' && earnings && (
                        <div className="text-right">
                            <p className="font-bold text-primary text-sm">{fmt(earnings)}</p>
                            <p className="text-xs text-gray-400">a cobrar</p>
                        </div>
                    )}
                </div>

                {/* Detalles */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    {booking.duration_hours && (
                        <span className="flex items-center gap-1">
                            <Clock size={12} className="text-primary" />
                            {booking.duration_hours} hora{booking.duration_hours !== 1 ? 's' : ''}
                        </span>
                    )}
                    {booking.scheduled_date && (
                        <span className="flex items-center gap-1">
                            <Calendar size={12} className="text-primary" />
                            {new Date(booking.scheduled_date + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                        </span>
                    )}
                </div>

                {/* ── Estado: esperando hora de review ── */}
                {!canReview && !done && (
                    <div className="flex items-start gap-2 bg-teal-50 border border-teal-100 rounded-xl px-3 py-2.5">
                        <Smartphone size={13} className="text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-teal-700">
                            Para seguir el servicio en tiempo real, abrí la app Nina. Esta sección se actualizará al finalizar.
                        </p>
                    </div>
                )}

                {/* ── Formulario de review ── */}
                {canReview && !done && (
                    <div className="border-t border-gray-100 pt-3 space-y-3">
                        <p className="text-sm font-semibold text-gray-800">
                            ¿Cómo fue el servicio? Dejá tu opinión
                        </p>

                        {/* Estrellas */}
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(n => (
                                <button
                                    key={n}
                                    onClick={() => setStars(n)}
                                    onMouseEnter={() => setHover(n)}
                                    onMouseLeave={() => setHover(0)}
                                    className="p-0.5 transition-transform hover:scale-110"
                                >
                                    <Star
                                        size={28}
                                        className={`transition-colors ${
                                            n <= (hover || stars)
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Comentario */}
                        <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Contanos tu experiencia (opcional)"
                            rows={3}
                            maxLength={500}
                            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        />
                        <p className="text-right text-xs text-gray-400">{comment.length}/500</p>

                        <Button
                            variant="primary"
                            className="w-full"
                            onClick={handleSubmitReview}
                            disabled={stars === 0 || submitting}
                            isLoading={submitting}
                        >
                            Enviar opinión
                        </Button>
                    </div>
                )}

                {/* ── Enviado ── */}
                {done && (
                    <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2.5">
                        <CheckCircle2 size={14} className="text-green-600" />
                        <p className="text-sm text-green-700 font-medium">¡Gracias por tu opinión!</p>
                    </div>
                )}
            </Card>
        </div>
    );
};
