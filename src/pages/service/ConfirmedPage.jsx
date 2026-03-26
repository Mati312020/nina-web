import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useConfirmedService } from '../../hooks/useConfirmedService';
import { ConfirmedFamilyView } from '../../components/service/ConfirmedFamilyView';
import { ConfirmedNannyView } from '../../components/service/ConfirmedNannyView';

const Spinner = () => (
    <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
);

/**
 * Página orquestadora para servicio confirmado.
 * Lee el rol del perfil y renderiza ConfirmedFamilyView o ConfirmedNannyView.
 * Redirige automáticamente cuando el status cambia (on_the_way, cancelled…).
 */
export default function ConfirmedPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile } = useAuth();
    const role = profile?.role;

    const { booking, loading, nextStatus } = useConfirmedService(role, profile?.id);

    // Redirigir cuando el booking deja de ser "confirmed"
    useEffect(() => {
        if (!nextStatus) return;
        if (nextStatus === 'on_the_way') {
            navigate(`/service/on-the-way/${id}`, { replace: true });
        } else {
            navigate(`/dashboard/${role}`, { replace: true });
        }
    }, [nextStatus, id, role, navigate]);

    const handleStatusChange = (newStatus) => {
        if (newStatus === 'on_the_way') navigate(`/service/on-the-way/${id}`, { replace: true });
    };

    const dashPath = `/dashboard/${role}`;

    return (
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(dashPath)}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="font-bold text-gray-900 font-poppins text-lg">Servicio confirmado</h1>
            </div>

            {loading && <Spinner />}

            {!loading && booking && role === 'family' && (
                <ConfirmedFamilyView booking={booking} />
            )}

            {!loading && booking && role === 'nanny' && (
                <ConfirmedNannyView booking={booking} onStatusChange={handleStatusChange} />
            )}

            {!loading && !booking && (
                <p className="text-center text-gray-500 py-8">No hay un servicio confirmado activo.</p>
            )}
        </div>
    );
}
