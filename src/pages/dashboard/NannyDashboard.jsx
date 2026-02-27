import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Clock, Calendar, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { useSubscription } from '../../hooks/useSubscription';
import { Carousel } from '../../components/ui/Carousel';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FamilyVacancyCard } from '../../components/dashboard/FamilyVacancyCard';
import { AvailabilityModal } from '../../components/dashboard/AvailabilityModal';
import { SubscriptionModal } from '../../components/dashboard/SubscriptionModal';

/**
 * Dashboard para niñeras.
 * - Carrusel de vacantes publicadas por familias
 * - Sección con el estado de disponibilidad propia de la niñera
 * - Botón para publicar/actualizar disponibilidad
 */
export const NannyDashboard = () => {
    const { user, profile } = useAuth();
    const { isSubscribed, subscribe, refetch: refetchSub } = useSubscription();

    const [vacancies, setVacancies] = useState([]);
    const [myAvailability, setMyAvailability] = useState(null);
    const [loadingVacancies, setLoadingVacancies] = useState(true);
    const [showAvailModal, setShowAvailModal] = useState(false);
    const [showSubModal, setShowSubModal] = useState(false);

    const fetchVacancies = useCallback(async () => {
        if (!user) return;
        setLoadingVacancies(true);
        try {
            const data = await api.get(`/long-term/vacancies?auth_id=${user.id}`);
            setVacancies(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error cargando vacantes:', err);
        } finally {
            setLoadingVacancies(false);
        }
    }, [user]);

    const fetchMyAvailability = useCallback(async () => {
        if (!user) return;
        try {
            const data = await api.get(`/long-term/nanny-availability/mine?auth_id=${user.id}`);
            // El endpoint retorna {} si no hay disponibilidad activa
            setMyAvailability(data?.id ? data : null);
        } catch (err) {
            console.error('Error cargando disponibilidad:', err);
        }
    }, [user]);

    useEffect(() => {
        fetchVacancies();
        fetchMyAvailability();
    }, [fetchVacancies, fetchMyAvailability]);

    const handleDeactivate = async () => {
        if (!myAvailability) return;
        try {
            await api.patch(
                `/long-term/nanny-availability/${myAvailability.id}/deactivate?auth_id=${user.id}`,
                {}
            );
            setMyAvailability(null);
        } catch (err) {
            console.error('Error retirando disponibilidad:', err);
        }
    };

    const firstName = profile?.full_name?.split(' ')[0] ?? 'Niñera';

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-poppins">
                            Hola, {firstName} 👋
                        </h1>
                        <p className="text-gray-500 font-nunito text-sm mt-0.5">
                            Explorá oportunidades de trabajo largo plazo
                        </p>
                    </div>
                    <Button onClick={() => setShowAvailModal(true)} className="gap-2 self-start sm:self-auto">
                        <Plus size={18} />
                        {myAvailability ? 'Actualizar Disponibilidad' : 'Publicarme como Disponible'}
                    </Button>
                </div>
            </div>

            {/* Contenido */}
            <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">

                {/* Carrusel: vacantes de familias */}
                <section>
                    <Carousel title="Vacantes Disponibles">
                        {loadingVacancies ? (
                            <>
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="snap-start flex-shrink-0 w-72 h-56 bg-gray-100 rounded-card animate-pulse"
                                    />
                                ))}
                            </>
                        ) : vacancies.length === 0 ? (
                            <Card className="w-72 flex items-center justify-center p-10 text-gray-400 text-sm text-center">
                                No hay vacantes publicadas aún.<br />Volvé pronto.
                            </Card>
                        ) : (
                            vacancies.map((vacancy) => (
                                <FamilyVacancyCard
                                    key={vacancy.id}
                                    vacancy={vacancy}
                                    isSubscribed={isSubscribed}
                                    onContactClick={() => setShowSubModal(true)}
                                />
                            ))
                        )}
                    </Carousel>
                </section>

                {/* Mi disponibilidad */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 font-poppins mb-4">
                        Mi Disponibilidad Publicada
                    </h2>

                    {myAvailability ? (
                        <Card className="max-w-md p-5">
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={18} className="text-success flex-shrink-0" />
                                    <span className="font-bold text-gray-900 font-poppins">
                                        Estás publicada como disponible
                                    </span>
                                </div>
                                <button
                                    onClick={handleDeactivate}
                                    className="text-xs text-gray-400 hover:text-danger transition-colors flex-shrink-0"
                                >
                                    Quitar
                                </button>
                            </div>
                            <div className="space-y-1.5 text-sm text-gray-600">
                                {myAvailability.preferred_hours_per_week && (
                                    <div className="flex items-center gap-2">
                                        <Clock size={13} className="text-primary" />
                                        <span>{myAvailability.preferred_hours_per_week} hs/semana preferidas</span>
                                    </div>
                                )}
                                {myAvailability.min_months && (
                                    <div className="flex items-center gap-2">
                                        <Calendar size={13} className="text-primary" />
                                        <span>Mínimo {myAvailability.min_months} {myAvailability.min_months === 1 ? 'mes' : 'meses'}</span>
                                    </div>
                                )}
                                {myAvailability.schedule_description && (
                                    <p className="text-xs text-gray-500 italic mt-2">
                                        {myAvailability.schedule_description}
                                    </p>
                                )}
                            </div>
                        </Card>
                    ) : (
                        <Card className="max-w-md text-center p-10 border-2 border-dashed border-gray-200 bg-white">
                            <p className="text-gray-400 mb-4 text-sm">
                                No estás publicada como disponible.<br />
                                Las familias no pueden encontrarte.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setShowAvailModal(true)}
                                className="gap-2"
                            >
                                <Plus size={16} />
                                Publicarme ahora
                            </Button>
                        </Card>
                    )}
                </section>
            </div>

            {/* Info: rankings desde nina-app */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 font-nunito">
                    <strong>Rankings y reseñas:</strong> Los puntajes y comentarios de tu perfil
                    se actualizan desde la aplicación móvil <strong>Nina App</strong>.
                </p>
            </div>

            {/* Modals */}
            <AvailabilityModal
                isOpen={showAvailModal}
                onClose={() => setShowAvailModal(false)}
                onSuccess={fetchMyAvailability}
            />
            <SubscriptionModal
                isOpen={showSubModal}
                onClose={() => setShowSubModal(false)}
                onSubscribe={async () => {
                    await subscribe();
                    setTimeout(refetchSub, 3000);
                }}
            />
        </div>
    );
};
