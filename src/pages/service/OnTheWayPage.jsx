import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRealtimeBooking } from '../../hooks/useRealtimeBooking';
import { useServiceFlow } from '../../hooks/useServiceFlow';
import { OnTheWayView } from '../../components/service/OnTheWayView';

const Spinner = () => (
    <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
);

/**
 * Página "En camino" — solo visible para la niñera.
 * Cuando toca "Llegué" → PATCH on-the-way → navega a /service/arrived/:id.
 * Si Realtime detecta arrived/in_progress desde otro lado, redirige automáticamente.
 */
export default function OnTheWayPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { booking, loading } = useRealtimeBooking('nanny', profile?.id);
    const { loading: acting, error, arrived } = useServiceFlow(id);

    useEffect(() => {
        if (!booking) return;
        if (booking.status === 'arrived')     navigate(`/service/arrived/${id}`,  { replace: true });
        if (booking.status === 'in_progress') navigate(`/service/active/${id}`,   { replace: true });
        if (booking.status === 'completed' || booking.status === 'cancelled')
            navigate('/dashboard/nanny', { replace: true });
    }, [booking?.status, id, navigate]);

    const handleArrived = () => arrived(() => navigate(`/service/arrived/${id}`, { replace: true }));

    return (
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="font-bold text-gray-900 font-poppins text-lg">En camino</h1>
            </div>

            {loading && <Spinner />}

            {!loading && booking && (
                <OnTheWayView booking={booking} onArrived={handleArrived}
                    loading={acting} error={error} />
            )}
        </div>
    );
}
