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
    // Indica que exchangeCodeForSession ya resolvió correctamente.
    // Permite avanzar el paso 1 antes de que onAuthStateChange propague `user`.
    const [codeExchanged, setCodeExchanged] = useState(false);

    // Intentar el code exchange explícitamente (PKCE fallback)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
            supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
                if (error) {
                    console.error('exchangeCodeForSession error:', error);
                    setExchangeError(error.message);
                } else {
                    setCodeExchanged(true);
                }
                // onAuthStateChange en AuthContext actualizará user/profile a continuación
            });
        }
    }, []);

    // Red de seguridad: si en 60 segundos no hay sesión, algo falló.
    // 60s cubre el peor caso de cold-start en Render free tier (~50s).
    // fetchProfile en AuthContext reintenta hasta 5 veces con backoff (2+5+10+20+35=72s).
    useEffect(() => {
        const timer = setTimeout(() => setTimedOut(true), 60000);
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

    const isError = timedOut || !!exchangeError;

    // ── Pasos derivados del estado ──────────────────────────────────────────
    // Paso 1: exchange PKCE completado (o ya tenemos user directamente)
    const step1Done = codeExchanged || !!user;
    // Paso 2: user recibido Y fetchProfile terminó
    const step2Done = !!user && !loading;

    const steps = [
        {
            label:  'Iniciando sesión con Google',
            done:   step1Done,
            active: !step1Done && !isError,
        },
        {
            label:  'Verificando perfil',
            done:   step2Done,
            active: step1Done && !step2Done && !isError,
        },
        {
            label:  'Redirigiendo al panel',
            done:   false,
            active: step2Done && !isError,
        },
    ];

    return (
        <div className="h-screen flex flex-col items-center justify-center gap-8 bg-gray-50">

            {/* Spinner — visible mientras hay progreso */}
            {!isError && (
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            )}

            {/* Lista de pasos */}
            <div className="flex flex-col gap-4">
                {steps.map((step, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-3 text-sm font-nunito transition-colors duration-500 ${
                            step.done   ? 'text-green-600' :
                            step.active ? 'text-gray-800'  :
                                          'text-gray-300'
                        }`}
                    >
                        {/* Burbuja indicadora */}
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${
                            step.done   ? 'bg-green-500'              :
                            step.active ? 'bg-primary animate-pulse'  :
                                          'bg-gray-200'
                        }`}>
                            {step.done ? (
                                /* Checkmark */
                                <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                            )}
                        </div>

                        {/* Etiqueta */}
                        <span className={step.active ? 'font-medium' : ''}>{step.label}</span>
                    </div>
                ))}

                {isError && (
                    <p className="text-xs text-gray-400 font-nunito text-center mt-1">
                        Redirigiendo al inicio de sesión…
                    </p>
                )}
            </div>
        </div>
    );
};
