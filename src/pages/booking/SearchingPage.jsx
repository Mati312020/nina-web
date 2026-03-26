import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, XCircle, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSearchingBooking } from '../../hooks/useSearchingBooking';
import { cancelSearch } from '../../services/searchingService';
import { SearchingHeader } from '../../components/searching/SearchingHeader';
import { CandidateCard } from '../../components/searching/CandidateCard';
import { CascadeTimer } from '../../components/searching/CascadeTimer';
import { Button } from '../../components/ui/Button';

export const SearchingPage = () => {
    const { bookingId: paramId } = useParams();
    const location   = useLocation();
    const navigate   = useNavigate();
    const { profile } = useAuth();

    // Acepta bookingId desde URL param O desde location.state (compatibilidad)
    const rawId    = paramId ?? location.state?.bookingId;
    const bookingId = rawId ? parseInt(rawId, 10) : null;

    const { detail, loading, terminated } = useSearchingBooking(bookingId, profile?.id);

    // Redirigir cuando termina la búsqueda
    useEffect(() => {
        if (!terminated || !detail) return;
        if (detail.status === 'confirmed') {
            navigate(`/service/confirmed/${bookingId}`, { replace: true });
        } else {
            navigate('/dashboard/family', { replace: true });
        }
    }, [terminated, detail, bookingId, navigate]);

    if (!bookingId) {
        navigate('/dashboard/family', { replace: true });
        return null;
    }

    const candidates  = detail?.candidates ?? [];
    const currentIdx  = detail?.current_candidate_index ?? 0;
    const timeoutSecs = detail?.cascade_timeout_seconds ?? 300;
    const email       = profile?.notification_email || profile?.email;

    const handleCancel = async () => {
        if (!window.confirm('¿Querés cancelar la búsqueda?')) return;
        try {
            await cancelSearch(bookingId, profile.id);
            navigate('/dashboard/family', { replace: true });
        } catch {
            alert('No se pudo cancelar. Intentá de nuevo.');
        }
    };

    if (loading && !detail) return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
    );

    // Si ya está confirmado (llegó antes del redirect)
    if (detail?.status === 'confirmed') return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center space-y-4 max-w-sm w-full">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={28} className="text-green-600" />
                </div>
                <h2 className="font-bold text-gray-900 font-poppins text-xl">¡Niñera confirmada!</h2>
                <Button variant="primary" className="w-full"
                    onClick={() => navigate(`/service/confirmed/${bookingId}`)}>
                    Ver detalles del servicio
                </Button>
            </div>
        </main>
    );

    // Sin disponibilidad
    if (detail?.status === 'cancelled' || detail?.status === 'expired') return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center space-y-4 max-w-sm w-full">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <XCircle size={28} className="text-red-500" />
                </div>
                <h2 className="font-bold text-gray-900 font-poppins text-xl">Sin disponibilidad</h2>
                <p className="text-sm text-gray-500">Ninguna candidata pudo aceptar. Podés intentar con otra búsqueda.</p>
                <Button variant="primary" className="w-full" onClick={() => navigate('/booking/search')}>
                    Buscar de nuevo
                </Button>
            </div>
        </main>
    );

    return (
        <main className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-lg mx-auto space-y-6">
                <SearchingHeader total={candidates.length} currentIndex={currentIdx} />

                {candidates.length > 0 && (
                    <div className="flex justify-center">
                        <CascadeTimer seconds={timeoutSecs} />
                    </div>
                )}

                {candidates.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {candidates.map((c, i) => (
                            <CandidateCard key={c.id} nanny={c}
                                candidateStatus={
                                    i < currentIdx ? 'rejected'
                                    : i === currentIdx ? 'contacting'
                                    : 'waiting'
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-2xl p-4">
                        <Mail size={15} className="text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-teal-700">
                            Te avisaremos en <strong>{email}</strong> cuando una niñera confirme.
                        </p>
                    </div>
                )}

                <Button variant="outline" className="w-full text-gray-500" onClick={handleCancel}>
                    Cancelar búsqueda
                </Button>
                <button onClick={() => navigate('/dashboard/family')}
                    className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors text-center underline underline-offset-2">
                    Volver al inicio (seguís recibiendo notificaciones)
                </button>
            </div>
        </main>
    );
};

export default SearchingPage;
