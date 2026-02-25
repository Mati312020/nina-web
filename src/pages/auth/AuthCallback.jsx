import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Página de callback para OAuth (Google, etc.).
 *
 * Flujo:
 * 1. Google redirige aquí con el token en el hash (#access_token=...)
 * 2. Supabase detecta el hash vía onAuthStateChange (detectSessionInUrl: true)
 * 3. AuthContext setea user y fetchProfile → loading pasa a false
 * 4. Redirigimos al destino correcto
 *
 * IMPORTANTE: esta URL debe estar en la whitelist de Supabase:
 *   Dashboard → Authentication → URL Configuration → Redirect URLs
 *   Agregar: https://nina-web.onrender.com/auth/callback
 *            https://nina-web.com.ar/auth/callback
 *            http://localhost:5173/auth/callback
 */
export const AuthCallback = () => {
    const { user, profile, loading } = useAuth();
    const navigate = useNavigate();
    const [timedOut, setTimedOut] = useState(false);

    // Red de seguridad: si en 10 segundos no hay sesión, algo falló
    useEffect(() => {
        const timer = setTimeout(() => setTimedOut(true), 10000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (timedOut) {
            navigate('/login', { replace: true });
            return;
        }

        // Esperar a que AuthContext termine de inicializar
        if (loading) return;

        // Esperar a que onAuthStateChange establezca la sesión OAuth.
        // getSession() puede devolver null en el primer render mientras
        // Supabase procesa el hash #access_token de la URL. El timeout
        // actúa como red de seguridad si la sesión nunca llega.
        if (!user) return;

        // Sesión establecida — redirigir según rol
        if (profile?.role) {
            navigate(`/dashboard/${profile.role}`, { replace: true });
        } else {
            // Usuario sin perfil completo (nuevo via OAuth)
            navigate('/select-profile', { replace: true });
        }
    }, [user, profile, loading, timedOut, navigate]);

    return (
        <div className="h-screen flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-nunito text-sm">
                {timedOut ? 'Redirigiendo...' : 'Completando inicio de sesión...'}
            </p>
        </div>
    );
};
