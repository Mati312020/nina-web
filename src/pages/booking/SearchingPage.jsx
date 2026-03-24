import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, CheckCircle2, XCircle, Mail } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

const POLL_INTERVAL = 6000;

/**
 * Pantalla de espera post-confirmación.
 * Muestra el estado del booking mientras el waterfall notifica candidatas.
 * Cuando el booking pasa a "confirmed" muestra los datos de la niñera asignada.
 */
export const SearchingPage = () => {
    const navigate    = useNavigate();
    const location    = useLocation();
    const { profile } = useAuth();
    const bookingId   = location.state?.bookingId;

    const [booking, setBooking]   = useState(null);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        if (!bookingId) {
            navigate('/dashboard/family', { replace: true });
            return;
        }

        const poll = async () => {
            try {
                const data = await api.get(`/bookings/focus/family/${profile?.id}`);
                if (data?.id === bookingId || data?.booking?.id === bookingId) {
                    setBooking(data?.booking ?? data);
                } else if (data?.id) {
                    setBooking(data);
                }
            } catch {
                // silenciar errores de red en el poll
            } finally {
                setLoading(false);
            }
        };

        poll();
        const id = setInterval(poll, POLL_INTERVAL);
        return () => clearInterval(id);
    }, [bookingId, profile?.id, navigate]);

    const status = booking?.status;
    const isConfirmed = status === 'confirmed';
    const isExpired   = status === 'expired' || status === 'cancelled';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center space-y-6">

                {loading && !booking ? (
                    <>
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                            <Search size={28} className="text-primary animate-pulse" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 font-poppins text-xl">Buscando niñera…</h2>
                            <p className="text-sm text-gray-500 mt-2">Estamos notificando a las candidatas seleccionadas.</p>
                        </div>
                    </>
                ) : isConfirmed ? (
                    <>
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                            <CheckCircle2 size={28} className="text-green-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 font-poppins text-xl">¡Niñera confirmada!</h2>
                            {booking?.nanny_name && (
                                <p className="text-base text-primary font-semibold mt-1">{booking.nanny_name}</p>
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                                Tu reserva está confirmada. Para seguir el servicio en tiempo real, abrí la app Nina.
                            </p>
                        </div>
                        <Button variant="primary" className="w-full" onClick={() => navigate('/dashboard/family')}>
                            Ir al inicio
                        </Button>
                    </>
                ) : isExpired ? (
                    <>
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                            <XCircle size={28} className="text-red-500" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 font-poppins text-xl">Sin disponibilidad</h2>
                            <p className="text-sm text-gray-500 mt-2">
                                Ninguna de las candidatas seleccionadas pudo aceptar en este momento. Podés intentar con otras niñeras.
                            </p>
                        </div>
                        <Button variant="primary" className="w-full" onClick={() => navigate('/booking/search')}>
                            Buscar de nuevo
                        </Button>
                    </>
                ) : (
                    /* Estado "searching" con animación */
                    <>
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                            <Search size={28} className="text-primary animate-pulse" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 font-poppins text-xl">Buscando niñera…</h2>
                            <p className="text-sm text-gray-500 mt-2">Estamos notificando a las candidatas seleccionadas.</p>
                        </div>
                        <div className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-2xl p-4 text-left">
                            <Mail size={15} className="text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-teal-700">
                                Te avisaremos por email en <strong>{profile?.notification_email || profile?.email}</strong> cuando una niñera confirme.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard/family')}
                            className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
                        >
                            Volver al inicio (seguís recibiendo notificaciones)
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
