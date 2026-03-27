import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Clock, MapPin, Info, Search, UserCircle, Sparkles, CheckCircle2, Receipt } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { useSubscription } from '../../hooks/useSubscription';
import { Carousel } from '../../components/ui/Carousel';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { NannyCard } from '../../components/dashboard/NannyCard';
import { VacancyModal } from '../../components/dashboard/VacancyModal';
import { SubscriptionModal } from '../../components/dashboard/SubscriptionModal';
import { SubscriptionBanner } from '../../components/dashboard/SubscriptionBanner';
import { EditProfileModal } from '../../components/dashboard/EditProfileModal';
import { NotificationDrawer } from '../../components/dashboard/NotificationDrawer';
import { PushPermissionBanner } from '../../components/notifications/PushPermissionBanner';
import { InstallBanner } from '../../components/pwa/InstallBanner';
import { ActiveBookingCard } from '../../components/dashboard/ActiveBookingCard';

/**
 * Dashboard para familias.
 * - Carrusel de niñeras disponibles para largo plazo
 * - Sección de vacantes propias (con opción de cerrar cada una)
 * - Botón para publicar nueva vacante
 */
export const FamilyDashboard = () => {
    const { user, profile } = useAuth();
    const { isSubscribed, expiresAt, subscribe } = useSubscription();

    const [nannies, setNannies] = useState([]);
    const [myVacancies, setMyVacancies] = useState([]);
    const [loadingNannies, setLoadingNannies] = useState(true);
    const [showVacancyModal, setShowVacancyModal] = useState(false);
    const [showSubModal, setShowSubModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

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

    const navigate = useNavigate();

    const firstName = profile?.full_name?.split(' ')[0] ?? 'Familia';

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

                    {/* Fila principal */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-poppins truncate">
                                Hola, {firstName} 👋
                            </h1>
                            <p className="text-gray-500 font-nunito text-sm mt-0.5 hidden sm:block">
                                Encontrá tu niñera ideal para largo plazo
                            </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Facturas: solo desktop */}
                            <button onClick={() => navigate('/invoices')}
                                className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary transition-colors font-nunito font-medium border border-gray-200 hover:border-primary/40 rounded-xl px-3 py-2 bg-white hover:bg-primary/5">
                                <Receipt size={16} />
                                Facturas
                            </button>

                            <NotificationDrawer />

                            <button
                                onClick={() => setShowProfileModal(true)}
                                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary transition-colors font-nunito font-medium border border-gray-200 hover:border-primary/40 rounded-xl px-2 sm:px-3 py-2 bg-white hover:bg-primary/5"
                            >
                                {profile?.profile_image_url ? (
                                    <img src={profile.profile_image_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                                ) : (
                                    <UserCircle size={18} className="text-gray-400" />
                                )}
                                <span className="hidden sm:inline">Mi perfil</span>
                            </button>

                            <Button onClick={() => setShowVacancyModal(true)} className="gap-1.5 text-sm whitespace-nowrap">
                                <Plus size={16} />
                                <span className="hidden sm:inline">Publicar Vacante</span>
                                <span className="sm:hidden">Vacante</span>
                            </Button>
                        </div>
                    </div>

                    {/* Fila secundaria mobile: Facturas */}
                    <div className="flex sm:hidden items-center gap-2 mt-3">
                        <button onClick={() => navigate('/invoices')}
                            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary transition-colors font-nunito font-medium border border-gray-200 rounded-xl px-3 py-1.5 bg-white">
                            <Receipt size={15} />
                            Facturas
                        </button>
                    </div>

                </div>
            </div>

            {/* Contenido */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-12">

                {/* Banner de vencimiento de suscripción */}
                <SubscriptionBanner
                    isSubscribed={isSubscribed}
                    expiresAt={expiresAt}
                    onRenew={subscribe}
                />

                {/* Banners de PWA y push */}
                <InstallBanner />
                <PushPermissionBanner />

                {/* Reserva activa confirmada */}
                <ActiveBookingCard role="family" />

                {/* CTA: Buscar niñera urgente */}
                <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-white font-poppins text-base">¿Necesitás niñera hoy?</p>
                            <p className="text-white/80 text-sm font-nunito">Buscá disponibilidad ahora y confirmá en minutos</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate('/booking/search')}
                        className="bg-white text-primary hover:bg-white/90 font-semibold flex-shrink-0 gap-2 self-start sm:self-auto"
                    >
                        <Search size={16} />
                        Buscar Niñera
                    </Button>
                </div>


                {/* Info: rankings desde nina-app */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                    <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 font-nunito">
                        <strong>Rankings y reseñas:</strong> Los puntajes y comentarios de las niñeras
                        se actualizan desde la aplicación móvil <strong>Nina App</strong>.
                    </p>
                </div>

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
                            <Card className="flex-shrink-0 w-80 p-8 flex flex-col items-center text-center gap-3 border-2 border-dashed border-gray-200 bg-white">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Search size={24} className="text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700 font-poppins text-sm">Sin niñeras disponibles</p>
                                    <p className="text-xs text-gray-400 font-nunito mt-1 leading-relaxed">
                                        Todavía no hay niñeras publicadas en tu zona.<br />
                                        Revisá más tarde o publicá tu vacante para que te encuentren.
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" className="text-xs gap-1.5 mt-1" onClick={() => setShowVacancyModal(true)}>
                                    <Plus size={13} />
                                    Publicar vacante
                                </Button>
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

            {/* Modals */}
            <VacancyModal
                isOpen={showVacancyModal}
                onClose={() => setShowVacancyModal(false)}
                onSuccess={fetchMyVacancies}
            />
            <SubscriptionModal
                isOpen={showSubModal}
                onClose={() => setShowSubModal(false)}
                onSubscribe={subscribe}
            />
            <EditProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
            />
        </div>
    );
};
