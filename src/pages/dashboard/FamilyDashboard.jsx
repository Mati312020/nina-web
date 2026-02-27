import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Calendar, Clock, MapPin, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { useSubscription } from '../../hooks/useSubscription';
import { Carousel } from '../../components/ui/Carousel';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { NannyCard } from '../../components/dashboard/NannyCard';
import { VacancyModal } from '../../components/dashboard/VacancyModal';
import { SubscriptionModal } from '../../components/dashboard/SubscriptionModal';

/**
 * Dashboard para familias.
 * - Carrusel de niñeras disponibles para largo plazo
 * - Sección de vacantes propias (con opción de cerrar cada una)
 * - Botón para publicar nueva vacante
 */
export const FamilyDashboard = () => {
    const { user, profile } = useAuth();
    const { isSubscribed, subscribe, refetch: refetchSub } = useSubscription();

    const [nannies, setNannies] = useState([]);
    const [myVacancies, setMyVacancies] = useState([]);
    const [loadingNannies, setLoadingNannies] = useState(true);
    const [showVacancyModal, setShowVacancyModal] = useState(false);
    const [showSubModal, setShowSubModal] = useState(false);

    const fetchNannies = useCallback(async () => {
        if (!user) return;
        setLoadingNannies(true);
        try {
            const data = await api.get(`/long-term/nannies?auth_id=${user.id}`);
            setNannies(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error cargando niñeras:', err);
        } finally {
            setLoadingNannies(false);
        }
    }, [user]);

    const fetchMyVacancies = useCallback(async () => {
        if (!user) return;
        try {
            const data = await api.get(`/long-term/vacancies/mine?auth_id=${user.id}`);
            // Solo mostrar vacantes activas en el dashboard
            setMyVacancies(Array.isArray(data) ? data.filter((v) => v.is_active) : []);
        } catch (err) {
            console.error('Error cargando vacantes propias:', err);
        }
    }, [user]);

    useEffect(() => {
        fetchNannies();
        fetchMyVacancies();
    }, [fetchNannies, fetchMyVacancies]);

    const handleDeactivateVacancy = async (vacancyId) => {
        try {
            await api.patch(`/long-term/vacancies/${vacancyId}/deactivate?auth_id=${user.id}`, {});
            setMyVacancies((prev) => prev.filter((v) => v.id !== vacancyId));
        } catch (err) {
            console.error('Error cerrando vacante:', err);
        }
    };

    const firstName = profile?.full_name?.split(' ')[0] ?? 'Familia';

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
                            Encontrá tu niñera ideal para largo plazo
                        </p>
                    </div>
                    <Button onClick={() => setShowVacancyModal(true)} className="gap-2 self-start sm:self-auto">
                        <Plus size={18} />
                        Publicar Vacante
                    </Button>
                </div>
            </div>

            {/* Contenido */}
            <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">

                {/* Carrusel: niñeras disponibles */}
                <section>
                    <Carousel title="Niñeras Disponibles">
                        {loadingNannies ? (
                            // Skeleton loading
                            <>
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="snap-start flex-shrink-0 w-72 h-64 bg-gray-100 rounded-card animate-pulse"
                                    />
                                ))}
                            </>
                        ) : nannies.length === 0 ? (
                            <Card className="w-72 flex items-center justify-center p-10 text-gray-400 text-sm text-center">
                                Aún no hay niñeras publicadas.<br />Volvé pronto.
                            </Card>
                        ) : (
                            nannies.map((nanny) => (
                                <NannyCard
                                    key={nanny.id}
                                    nanny={nanny}
                                    isSubscribed={isSubscribed}
                                    onContactClick={() => setShowSubModal(true)}
                                />
                            ))
                        )}
                    </Carousel>
                </section>

                {/* Mis vacantes */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 font-poppins">
                            Mis Vacantes Publicadas
                        </h2>
                        {myVacancies.length > 0 && (
                            <span className="text-sm text-gray-500">
                                {myVacancies.length} activa{myVacancies.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {myVacancies.length === 0 ? (
                        <Card className="text-center p-10 border-2 border-dashed border-gray-200 bg-white">
                            <p className="text-gray-400 mb-4">No tenés vacantes publicadas.</p>
                            <Button
                                variant="outline"
                                onClick={() => setShowVacancyModal(true)}
                                className="gap-2"
                            >
                                <Plus size={16} />
                                Publicar mi primera vacante
                            </Button>
                        </Card>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myVacancies.map((vacancy) => (
                                <Card key={vacancy.id} className="relative p-5">
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <h4 className="font-bold text-gray-900 font-poppins line-clamp-2 text-sm flex-1">
                                            {vacancy.title}
                                        </h4>
                                        <button
                                            onClick={() => handleDeactivateVacancy(vacancy.id)}
                                            className="text-xs text-gray-400 hover:text-danger transition-colors flex-shrink-0 mt-0.5"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                    <div className="space-y-1 text-xs text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={12} className="text-primary" />
                                            <span>{vacancy.period_months} meses</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={12} className="text-primary" />
                                            <span>{vacancy.hours_per_week} hs/semana</span>
                                        </div>
                                        {vacancy.location && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={12} className="text-secondary" />
                                                <span>{vacancy.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Info: rankings desde nina-app */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 font-nunito">
                    <strong>Rankings y reseñas:</strong> Los puntajes y comentarios de las niñeras
                    se actualizan desde la aplicación móvil <strong>Nina App</strong>.
                </p>
            </div>

            {/* Modals */}
            <VacancyModal
                isOpen={showVacancyModal}
                onClose={() => setShowVacancyModal(false)}
                onSuccess={fetchMyVacancies}
            />
            <SubscriptionModal
                isOpen={showSubModal}
                onClose={() => setShowSubModal(false)}
                onSubscribe={async () => {
                    await subscribe();
                    // Re-verificar suscripción después de iniciar el pago
                    setTimeout(refetchSub, 3000);
                }}
            />
        </div>
    );
};
