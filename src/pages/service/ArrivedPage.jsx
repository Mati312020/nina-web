import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRealtimeBooking } from '../../hooks/useRealtimeBooking';
import { useServiceFlow } from '../../hooks/useServiceFlow';
import { ArrivedView } from '../../components/service/ArrivedView';

const Spinner = () => (
    <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
);

/**
 * Página "Llegué" — visible para familia (espera) y niñera (ingresa PIN).
 * La niñera verifica el PIN → PATCH verify-pin → navega a /service/active/:id.
 * Realtime detecta in_progress y redirige a ambos automáticamente.
 */
export default function ArrivedPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile } = useAuth();
    const role = profile?.role;
    const { booking, loading } = useRealtimeBooking(role, profile?.id);
    const { loading: acting, error, checkPin } = useServiceFlow(id);

    useEffect(() => {
        if (!booking) return;
        if (booking.status === 'in_progress') navigate(`/service/active/${id}`,  { replace: true });
        if (booking.status === 'completed' || booking.status === 'cancelled')
            navigate(`/dashboard/${role}`, { replace: true });
    }, [booking?.status, id, role, navigate]);

    const handlePinVerified = (pin) =>
        checkPin(pin, () => navigate(`/service/active/${id}`, { replace: true }));

    return (
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="font-bold text-gray-900 font-poppins text-lg">
                    {role === 'family' ? 'Niñera en puerta' : 'Verificar llegada'}
                </h1>
            </div>

            {loading && <Spinner />}

            {!loading && booking && (
                <ArrivedView booking={booking} role={role}
                    onPinVerified={handlePinVerified} loading={acting} error={error} />
            )}
        </div>
    );
}
