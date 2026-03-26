import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DisclaimerPage } from './pages/auth/DisclaimerPage';
import { ProfileSelectionPage } from './pages/auth/ProfileSelectionPage';
import { CreateProfilePage } from './pages/auth/CreateProfilePage';
import { FamilyDashboard } from './pages/dashboard/FamilyDashboard';
import { NannyDashboard } from './pages/dashboard/NannyDashboard';
import { PaymentResult } from './pages/PaymentResult';
import { PaymentBookingResult } from './pages/PaymentBookingResult';
import { MpCallbackPage } from './pages/MpCallbackPage';
import { SearchNanniesPage } from './pages/booking/SearchNanniesPage';
import { ProposalPage } from './pages/booking/ProposalPage';
import { ConfirmationPage } from './pages/booking/ConfirmationPage';
import { SearchingPage } from './pages/booking/SearchingPage';
import ConfirmedPage from './pages/service/ConfirmedPage';
import OnTheWayPage from './pages/service/OnTheWayPage';
import ArrivedPage from './pages/service/ArrivedPage';
import { AuthCallback } from './pages/auth/AuthCallback';
import { RecoveryPage } from './pages/auth/RecoveryPage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import MobileAuthCallback from './pages/auth/MobileAuthCallback';
import MobileAuthStart from './pages/auth/MobileAuthStart';

const Spinner = () => (
    <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
);

/**
 * Ruta pública: si el usuario ya está logueado con rol asignado,
 * lo redirige directamente a su dashboard.
 */
const PublicRoute = ({ children }) => {
    const { user, profile, loading } = useAuth();
    if (loading) return <Spinner />;
    if (user && profile?.role) {
        return <Navigate to={`/dashboard/${profile.role}`} replace />;
    }
    return children;
};

/**
 * Ruta protegida: requiere usuario autenticado.
 */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <Spinner />;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

/**
 * Guard de dashboard por rol.
 * - Sin usuario → /login
 * - Sin rol → /select-profile
 * - Rol incorrecto → redirige al dashboard correcto
 * - OK → renderiza el dashboard
 */
const RoleDashboard = ({ role }) => {
    const { user, profile, loading } = useAuth();
    if (loading) return <Spinner />;
    if (!user) return <Navigate to="/login" replace />;
    if (!profile?.role) return <Navigate to="/select-profile" replace />;
    if (profile.role !== role) return <Navigate to={`/dashboard/${profile.role}`} replace />;
    return role === 'family' ? <FamilyDashboard /> : <NannyDashboard />;
};

function App() {
    /**
     * Warm-up silencioso: despierta el backend de Render free tier apenas carga el sitio.
     * El cold start tarda 30-60s; el flujo OAuth de Google también ~10s → cuando
     * fetchProfile() llama al backend, ya está caliente y responde en <1s.
     * Fix definitivo: upgradear nina-app a Starter ($7/mes) para eliminar el sleep.
     */
    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        fetch(`${API_URL}/`).catch(() => {}); // ignorar errores — solo queremos despertar el dyno
    }, []);

    return (
        <Router>
            <AuthProvider>
                <Layout>
                    <Routes>
                        {/* Públicas */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                        {/* Deslinde de responsabilidades — puerta obligatoria antes del registro */}
                        <Route path="/disclaimer" element={<PublicRoute><DisclaimerPage /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

                        {/* Onboarding (requieren auth) */}
                        <Route path="/select-profile" element={
                            <ProtectedRoute><ProfileSelectionPage /></ProtectedRoute>
                        } />
                        <Route path="/create-profile" element={
                            <ProtectedRoute><CreateProfilePage /></ProtectedRoute>
                        } />

                        {/* Dashboards por rol */}
                        <Route path="/dashboard/family" element={<RoleDashboard role="family" />} />
                        <Route path="/dashboard/nanny" element={<RoleDashboard role="nanny" />} />

                        {/* Callback OAuth web (Google en browser) */}
                        <Route path="/auth/callback" element={<AuthCallback />} />

                        {/* Recuperación de contraseña (link enviado por email) */}
                        <Route path="/auth/recovery" element={<RecoveryPage />} />

                        {/* Relay OAuth para la app mobile (nina-app) */}
                        <Route path="/auth/mobile-start" element={<MobileAuthStart />} />
                        <Route path="/auth/mobile-callback" element={<MobileAuthCallback />} />

                        {/* Resultado de pago de suscripción (requiere auth) */}
                        <Route path="/payment/success" element={<ProtectedRoute><PaymentResult outcome="success" /></ProtectedRoute>} />
                        <Route path="/payment/failure" element={<ProtectedRoute><PaymentResult outcome="failure" /></ProtectedRoute>} />
                        <Route path="/payment/pending" element={<ProtectedRoute><PaymentResult outcome="pending" /></ProtectedRoute>} />

                        {/* Flujo de reserva last-minute (requiere auth) */}
                        <Route path="/booking/search" element={<ProtectedRoute><SearchNanniesPage /></ProtectedRoute>} />
                        <Route path="/booking/proposal" element={<ProtectedRoute><ProposalPage /></ProtectedRoute>} />
                        <Route path="/booking/confirmation" element={<ProtectedRoute><ConfirmationPage /></ProtectedRoute>} />
                        <Route path="/booking/searching" element={<ProtectedRoute><SearchingPage /></ProtectedRoute>} />
                        <Route path="/booking/searching/:bookingId" element={<ProtectedRoute><SearchingPage /></ProtectedRoute>} />
                        <Route path="/booking/payment/:outcome" element={<ProtectedRoute><PaymentBookingResult /></ProtectedRoute>} />

                        {/* Flujo de servicio */}
                        <Route path="/service/confirmed/:id"  element={<ProtectedRoute><ConfirmedPage /></ProtectedRoute>} />
                        <Route path="/service/on-the-way/:id" element={<ProtectedRoute><OnTheWayPage /></ProtectedRoute>} />
                        <Route path="/service/arrived/:id"    element={<ProtectedRoute><ArrivedPage /></ProtectedRoute>} />

                        {/* Callback OAuth MercadoPago (público — MP redirige aquí tras autorizar) */}
                        <Route path="/mp-conectado" element={<MpCallbackPage />} />

                        {/* Páginas legales */}
                        <Route path="/legal/privacidad" element={<PrivacyPolicyPage />} />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Layout>
            </AuthProvider>
        </Router>
    );
}

export default App;
