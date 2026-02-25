import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

/**
 * Página de callback para OAuth (Google, etc.).
 *
 * Flujo:
 * 1. Google redirige aquí con el token en el hash (#access_token=...)
 * 2. Esperamos a que Supabase procese el hash vía onAuthStateChange
 * 3. Una vez que el perfil se carga en AuthContext, redirigimos al destino correcto
 *
 * IMPORTANTE: esta URL debe estar en la whitelist de Supabase:
 *   Dashboard → Authentication → URL Configuration → Redirect URLs
 *   Agregar: https://nina-web.onrender.com/auth/callback
 *            https://nina-web.com.ar/auth/callback
 *            http://localhost:5173/auth/callback
 */
export const AuthCallback = () => {
    const { profile, loading } = useAuth();
    const navigate = useNavigate();
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        // Si en 8 segundos no hay sesión, algo falló — mandar al login
        const timer = setTimeout(() => setTimedOut(true), 8000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (timedOut) {
            navigate('/login', { replace: true });
            return;
        }

        // Esperar a que loading termine (AuthContext terminó de fetchProfile)
        if (loading) return;

        if (profile?.role) {
            navigate(`/dashboard/${profile.role}`, { replace: true });
        } else {
            // Usuario nuevo via OAuth — sin rol aún, completar onboarding
            navigate('/select-profile', { replace: true });
        }
    }, [profile, loading, timedOut, navigate]);

    return (
        <div className="h-screen flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-nunito text-sm">
                {timedOut ? 'Redirigiendo...' : 'Completando inicio de sesión...'}
            </p>
        </div>
    );
};
