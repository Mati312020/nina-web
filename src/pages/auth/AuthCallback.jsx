import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

/**
 * Página de callback para OAuth (Google, etc.).
 *
 * Flujo con PKCE (Supabase v2 default):
 * 1. Google redirige aquí con ?code=... en el query string
 * 2. detectSessionInUrl:true procesa el code exchange automáticamente
 *    OR lo hacemos explícitamente con exchangeCodeForSession()
 * 3. onAuthStateChange (en AuthContext) setea user y fetchProfile
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
    const [exchangeError, setExchangeError] = useState('');

    // Intentar el code exchange explícitamente (PKCE fallback)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
            supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
                if (error) {
                    console.error('exchangeCodeForSession error:', error);
                    setExchangeError(error.message);
                }
                // Si no hay error, onAuthStateChange en AuthContext actualizará user/profile
            });
        }
    }, []);

    // Red de seguridad: si en 15 segundos no hay sesión, algo falló
    useEffect(() => {
        const timer = setTimeout(() => setTimedOut(true), 15000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (timedOut || exchangeError) {
            navigate('/login', { replace: true });
            return;
        }

        // Esperar a que AuthContext termine de inicializar
        if (loading) return;

        // Esperar a que onAuthStateChange establezca la sesión OAuth.
        if (!user) return;

        // Sesión establecida — redirigir según rol
        if (profile?.role) {
            navigate(`/dashboard/${profile.role}`, { replace: true });
        } else {
            // Usuario sin perfil completo (nuevo via OAuth)
            navigate('/select-profile', { replace: true });
        }
    }, [user, profile, loading, timedOut, exchangeError, navigate]);

    return (
        <div className="h-screen flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-nunito text-sm">
                {timedOut || exchangeError ? 'Redirigiendo...' : 'Completando inicio de sesión...'}
            </p>
        </div>
    );
};
