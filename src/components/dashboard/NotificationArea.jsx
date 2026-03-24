import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Clock, Users, DollarSign, CheckCircle2, XCircle, ChevronDown, MessageSquare } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { ReviewsModal } from './ReviewsModal';

const POLL_INTERVAL = 5000; // 5 segundos

const fmt = (val) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

const formatDateTime = (date, time) => {
    const parts = [];
    if (date) parts.push(new Date(date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' }));
    if (time) parts.push(time.slice(0, 5));
    return parts.join(' a las ') || 'Fecha a confirmar';
};

/**
 * Área de notificaciones para el dashboard de niñeras.
 * Muestra las solicitudes pendientes (el booking está en estado "searching"
 * y esta niñera es la candidata actual).
 *
 * Informativo únicamente — para aceptar o rechazar deben usar la app Nina.
 */
export const NotificationArea = () => {
    const { profile } = useAuth();
    const [requests, setRequests]   = useState([]);
    const [loading, setLoading]     = useState(true);
    const [hasNew, setHasNew]       = useState(false);
    const [acting, setActing]       = useState({}); // { [bookingId]: 'accepting'|'rejecting' }
    const [rejectOpen, setRejectOpen] = useState({}); // { [bookingId]: bool }
    const [reviewTarget, setReviewTarget] = useState(null); // { userId, userName }

    const REJECT_REASONS = [
        { value: 'schedule',  label: 'Horario no me queda' },
        { value: 'distance',  label: 'La distancia es mucha' },
        { value: 'price',     label: 'El precio no me conviene' },
    ];

    const fetchPending = useCallback(async () => {
        if (!profile?.id) return;
        try {
            const data = await api.get(`/bookings/pending/${profile.id}`);
            const list = data?.requests ?? data ?? [];
            setRequests(prev => {
                if (list.length > prev.length) setHasNew(true);
                return list;
            });
        } catch (err) {
            console.error('[NotificationArea] Error:', err);
        } finally {
            setLoading(false);
        }
    }, [profile?.id]);

    const handleAccept = async (bookingId) => {
        setActing(p => ({ ...p, [bookingId]: 'accepting' }));
        try {
            await api.patch(`/bookings/${bookingId}/accept`, { nanny_id: profile.id });
            setRequests(prev => prev.filter(r => r.id !== bookingId));
        } catch (err) {
            console.error('[NotificationArea] Accept error:', err);
        } finally {
            setActing(p => ({ ...p, [bookingId]: null }));
        }
    };

    const handleReject = async (bookingId, reason) => {
        setActing(p => ({ ...p, [bookingId]: 'rejecting' }));
        setRejectOpen(p => ({ ...p, [bookingId]: false }));
        try {
            await api.patch(`/bookings/${bookingId}/reject`, { nanny_id: profile.id, reason });
            setRequests(prev => prev.filter(r => r.id !== bookingId));
        } catch (err) {
            console.error('[NotificationArea] Reject error:', err);
        } finally {
            setActing(p => ({ ...p, [bookingId]: null }));
        }
    };

    useEffect(() => {
        fetchPending();
        const id = setInterval(fetchPending, POLL_INTERVAL);
        return () => clearInterval(id);
    }, [fetchPending]);

    // Limpiar indicador de nuevo cuando el usuario lo ve
    const handleMouseEnter = () => setHasNew(false);

    if (loading && requests.length === 0) {
        return (
            <div className="mb-6">
                <div className="h-5 bg-gray-200 rounded w-40 mb-3 animate-pulse" />
                <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="mb-6" onMouseEnter={handleMouseEnter}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <Bell size={16} className={requests.length > 0 ? 'text-secondary' : 'text-gray-400'} />
                <h3 className="font-semibold text-gray-800 font-poppins text-sm">
                    Solicitudes Pendientes
                </h3>
                {hasNew && (
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                )}
                {requests.length > 0 && (
                    <span className="ml-auto text-xs text-gray-400">{requests.length} activa{requests.length > 1 ? 's' : ''}</span>
                )}
            </div>

            {requests.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <p className="text-sm text-gray-400">Sin solicitudes por ahora</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {requests.map(req => {
                        // Calcular ganancia neta de la niñera (offered_price - 6%)
                        const offeredPrice = req.offered_price ?? 0;
                        const nannyNet     = Math.round(offeredPrice * 0.94); // 100% - 6% nanny fee
                        const childrenCount = req.family_children_count ?? req.children_count ?? null;

                        return (
                            <Card key={req.id} className="p-4 border-l-4 border-l-secondary">
                                {/* Familia + ganancia */}
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm font-poppins">
                                            {req.family_name || 'Familia'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {formatDateTime(req.scheduled_date, req.scheduled_time)}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-bold text-primary text-sm">{fmt(nannyNet)}</p>
                                        <p className="text-xs text-gray-400">a cobrar</p>
                                    </div>
                                </div>

                                {/* Detalles */}
                                <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-3">
                                    {req.duration_hours && (
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} className="text-primary" />
                                            {req.duration_hours} hora{req.duration_hours !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                    {childrenCount != null && (
                                        <span className="flex items-center gap-1">
                                            <Users size={12} className="text-primary" />
                                            {childrenCount} {childrenCount === 1 ? 'niño/a' : 'niños/as'}
                                        </span>
                                    )}
                                    {offeredPrice > 0 && (
                                        <span className="flex items-center gap-1">
                                            <DollarSign size={12} className="text-primary" />
                                            Tarifa: {fmt(req.hourly_rate ?? offeredPrice / (req.duration_hours || 1))}/hr
                                        </span>
                                    )}
                                </div>

                                {/* Acciones */}
                                <div className="flex gap-2 mt-1">
                                    <button
                                        onClick={() => handleAccept(req.id)}
                                        disabled={!!acting[req.id]}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        <CheckCircle2 size={14} />
                                        {acting[req.id] === 'accepting' ? 'Aceptando…' : 'Aceptar'}
                                    </button>

                                    {/* Valoración de la familia */}
                                    {req.family_id && (
                                        <button
                                            onClick={() => setReviewTarget({ userId: req.family_id, userName: req.family_name || 'Familia' })}
                                            className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-primary/30 text-primary text-xs font-medium hover:bg-primary/5 transition-colors"
                                            title="Ver valoraciones de la familia"
                                        >
                                            <MessageSquare size={13} />
                                        </button>
                                    )}

                                    <div className="relative flex-1">
                                        <button
                                            onClick={() => setRejectOpen(p => ({ ...p, [req.id]: !p[req.id] }))}
                                            disabled={!!acting[req.id]}
                                            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                                        >
                                            <XCircle size={14} />
                                            {acting[req.id] === 'rejecting' ? 'Rechazando…' : 'Rechazar'}
                                            <ChevronDown size={12} className={`transition-transform ${rejectOpen[req.id] ? 'rotate-180' : ''}`} />
                                        </button>
                                        {rejectOpen[req.id] && (
                                            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-xl border border-gray-200 shadow-lg z-10 overflow-hidden">
                                                {REJECT_REASONS.map(r => (
                                                    <button
                                                        key={r.value}
                                                        onClick={() => handleReject(req.id, r.value)}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        {r.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        {reviewTarget && (
            <ReviewsModal
                userId={reviewTarget.userId}
                userName={reviewTarget.userName}
                viewerRole="nanny"
                onClose={() => setReviewTarget(null)}
            />
        )}
        </div>
    );
};
