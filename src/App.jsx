import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProfileSelectionPage } from './pages/auth/ProfileSelectionPage';
import { CreateProfilePage } from './pages/auth/CreateProfilePage';
import { FamilyDashboard } from './pages/dashboard/FamilyDashboard';
import { NannyDashboard } from './pages/dashboard/NannyDashboard';
import { PaymentResult } from './pages/PaymentResult';
import { AuthCallback } from './pages/auth/AuthCallback';
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
    return (
        <Router>
            <AuthProvider>
                <Layout>
                    <Routes>
                        {/* Públicas */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
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

                        {/* Relay OAuth para la app mobile (nina-app) */}
                        <Route path="/auth/mobile-start" element={<MobileAuthStart />} />
                        <Route path="/auth/mobile-callback" element={<MobileAuthCallback />} />

                        {/* Resultado de pago de suscripción */}
                        <Route path="/payment/success" element={<PaymentResult outcome="success" />} />
                        <Route path="/payment/failure" element={<PaymentResult outcome="failure" />} />
                        <Route path="/payment/pending" element={<PaymentResult outcome="pending" />} />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Layout>
            </AuthProvider>
        </Router>
    );
}

export default App;
