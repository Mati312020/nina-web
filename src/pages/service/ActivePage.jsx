import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useActiveService } from '../../hooks/useActiveService';
import { completeService } from '../../services/serviceFlowService';
import { ActiveFamilyView } from '../../components/service/ActiveFamilyView';
import { ActiveNannyView } from '../../components/service/ActiveNannyView';

const Spinner = () => (
    <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
);

/**
 * Página del servicio activo (in_progress).
 * Selector de vista por rol. Redirige cuando el status cambia a completed/cancelled.
 */
export default function ActivePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile } = useAuth();
    const role = profile?.role;
    const { booking, loading, remaining } = useActiveService(role, profile?.id);

    useEffect(() => {
        if (!booking) return;
        if (booking.status === 'completed') navigate(`/dashboard/${role}`, { replace: true });
        if (booking.status === 'cancelled') navigate(`/dashboard/${role}`, { replace: true });
    }, [booking?.status, role, navigate]);

    const handleComplete = async () => {
        try {
            await completeService(id);
            navigate(`/dashboard/${role}`, { replace: true });
        } catch {
            // error manejado en el componente
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
            <h1 className="font-bold text-gray-900 font-poppins text-lg">Servicio en curso</h1>

            {loading && <Spinner />}

            {!loading && booking && role === 'family' && (
                <ActiveFamilyView booking={booking} remaining={remaining} />
            )}

            {!loading && booking && role === 'nanny' && (
                <ActiveNannyView booking={booking} remaining={remaining} onComplete={handleComplete} />
            )}

            {!loading && !booking && (
                <p className="text-center text-gray-500 py-8">No hay un servicio activo.</p>
            )}
        </div>
    );
}
