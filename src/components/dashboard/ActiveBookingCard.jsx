import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRealtimeBooking } from '../../hooks/useRealtimeBooking';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const fmt = (val) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

const fmtDate = (date, time) => {
    const parts = [];
    if (date) parts.push(new Date(date + 'T12:00:00').toLocaleDateString('es-AR', {
        weekday: 'long', day: 'numeric', month: 'long',
    }));
    if (time) parts.push(`a las ${time.slice(0, 5)}`);
    return parts.join(' ') || 'Fecha a confirmar';
};

const isReviewTime = (b) => {
    if (!b?.scheduled_date) return true;
    const timeStr = b.scheduled_time ?? '00:00';
    const start = new Date(`${b.scheduled_date}T${timeStr}:00`);
    const end = new Date(start.getTime() + (b.duration_hours ?? 1) * 3600000);
    return new Date() >= end;
};

/** Card de reserva activa para familia y niñera. Usa Realtime en lugar de polling. */
export const ActiveBookingCard = ({ role }) => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const { booking: liveBooking, loading } = useRealtimeBooking(role, profile?.id);

    // Solo mostrar cuando está confirmado (review state)
    const booking = liveBooking?.status === 'confirmed' ? liveBooking : null;

    const [stars, setStars]       = useState(0);
    const [hover, setHover]       = useState(0);
    const [comment, setComment]   = useState('');
    const [submitting, setSubmit] = useState(false);
    const [done, setDone]         = useState(false);
    const [canReview, setCanReview] = useState(false);

    useEffect(() => {
        if (!booking) return;
        setCanReview(isReviewTime(booking));
        const id = setInterval(() => setCanReview(isReviewTime(booking)), 60000);
        return () => clearInterval(id);
    }, [booking]);

    const handleSubmitReview = async () => {
        if (stars === 0 || submitting || !booking) return;
        setSubmit(true);
        try {
            const reviewedId = role === 'family'
                ? (booking.nanny?.id)
                : (booking.family?.id ?? booking.family_id);
            await api.post('/reviews/', {
                booking_id: booking.id,
                reviewer_id: profile.id,
                reviewed_id: reviewedId,
                stars,
                comment: comment.trim() || null,
            });
            setDone(true);
        } catch (err) {
            console.error('[ActiveBookingCard] review error:', err);
        } finally {
            setSubmit(false);
        }
    };

    if (loading || !booking || done) return null;

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
                {!canReview && (
                    <button
                        onClick={() => navigate(`/service/confirmed/${booking.id}`)}
                        className="w-full flex items-center justify-between bg-teal-50 border border-teal-100 rounded-xl px-3 py-2.5 hover:bg-teal-100 transition-colors"
                    >
                        <span className="text-xs text-teal-700 font-medium">Ver detalles del servicio</span>
                        <ChevronRight size={14} className="text-teal-500" />
                    </button>
                )}
                {canReview && (
                    <div className="border-t border-gray-100 pt-3 space-y-3">
                        <p className="text-sm font-semibold text-gray-800">¿Cómo fue el servicio? Dejá tu opinión</p>
                        <div className="flex gap-1">
                            {[1,2,3,4,5].map(n => (
                                <button key={n} onClick={() => setStars(n)}
                                    onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
                                    className="p-0.5 transition-transform hover:scale-110">
                                    <Star size={28} className={`transition-colors ${n <= (hover||stars) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                </button>
                            ))}
                        </div>
                        <textarea value={comment} onChange={e => setComment(e.target.value)}
                            placeholder="Contanos tu experiencia (opcional)" rows={3} maxLength={500}
                            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                        <p className="text-right text-xs text-gray-400">{comment.length}/500</p>
                        <Button variant="primary" className="w-full" onClick={handleSubmitReview}
                            disabled={stars === 0 || submitting} isLoading={submitting}>
                            Enviar opinión
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};
