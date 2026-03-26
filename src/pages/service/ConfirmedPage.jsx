import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useConfirmedService } from '../../hooks/useConfirmedService';
import { useCancellation } from '../../hooks/useCancellation';
import { ConfirmedFamilyView } from '../../components/service/ConfirmedFamilyView';
import { ConfirmedNannyView } from '../../components/service/ConfirmedNannyView';
import { CancellationModal } from '../../components/service/CancellationModal';

const Spinner = () => (
    <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
);

/**
 * Página orquestadora para servicio confirmado.
 * Lee el rol del perfil y renderiza ConfirmedFamilyView o ConfirmedNannyView.
 * Incluye opción de cancelación con modal de penalidades.
 */
export default function ConfirmedPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile } = useAuth();
    const role = profile?.role;
    const [showCancel, setShowCancel] = useState(false);

    const { booking, loading, nextStatus } = useConfirmedService(role, profile?.id);
    const { loading: cancelling, error: cancelError, penalty, scenario, cancel } = useCancellation(booking);

    useEffect(() => {
        if (!nextStatus) return;
        if (nextStatus === 'on_the_way') navigate(`/service/on-the-way/${id}`, { replace: true });
        else navigate(`/dashboard/${role}`, { replace: true });
    }, [nextStatus, id, role, navigate]);

    const handleStatusChange = (status) => {
        if (status === 'on_the_way') navigate(`/service/on-the-way/${id}`, { replace: true });
    };

    const handleCancel = () => cancel(profile.id, () => navigate(`/dashboard/${role}`, { replace: true }));

    return (
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
            {showCancel && booking && (
                <CancellationModal penalty={penalty} scenario={scenario}
                    onConfirm={handleCancel} onClose={() => setShowCancel(false)}
                    loading={cancelling} error={cancelError} />
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(`/dashboard/${role}`)}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h1 className="font-bold text-gray-900 font-poppins text-lg">Servicio confirmado</h1>
                </div>
                {booking && (
                    <button onClick={() => setShowCancel(true)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium py-1 px-2">
                        Cancelar
                    </button>
                )}
            </div>

            {loading && <Spinner />}
            {!loading && booking && role === 'family' && <ConfirmedFamilyView booking={booking} />}
            {!loading && booking && role === 'nanny'  && <ConfirmedNannyView  booking={booking} onStatusChange={handleStatusChange} />}
            {!loading && !booking && <p className="text-center text-gray-500 py-8">No hay un servicio confirmado activo.</p>}
        </div>
    );
}
