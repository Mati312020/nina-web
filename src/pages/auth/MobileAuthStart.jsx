import { useEffect, useState } from 'react';

/**
 * Página de inicio del flujo OAuth mobile.
 *
 * Recibe dos parámetros:
 *   - app_redirect: URL del deep link de retorno (ej: exp://192.168.3.59:8081/--/auth/callback)
 *   - auth_url: URL completa de Supabase authorize (con PKCE code_challenge incluido)
 *
 * Flujo:
 * 1. Guarda app_redirect en localStorage (persiste en el mismo origin nina-web.onrender.com)
 * 2. Redirige al auth_url de Supabase (que lleva a Google OAuth)
 * 3. Después del OAuth, GoTrue redirige a /auth/mobile-callback
 * 4. mobile-callback lee app_redirect de localStorage y redirige al app
 *
 * ¿Por qué localStorage? Porque GoTrue puede modificar/descartar query params extra
 * en el redirect_to. localStorage persiste dentro del mismo origin a través de
 * todas las navegaciones (Google → Supabase → nina-web) en el Chrome Custom Tab.
 */
const MobileAuthStart = () => {
    const [error, setError] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const appRedirect = params.get('app_redirect');
        const authUrl = params.get('auth_url');

        if (!appRedirect || !authUrl) {
            console.error('[MobileAuthStart] Faltan parámetros:', { appRedirect: !!appRedirect, authUrl: !!authUrl });
            setError('Faltan parámetros para iniciar la autenticación.');
            return;
        }

        // Guardar el deep link de retorno en localStorage
        localStorage.setItem('nina_app_redirect', appRedirect);
        console.log('[MobileAuthStart] app_redirect guardado:', appRedirect);

        // Redirigir a Supabase authorize (que va a Google)
        console.log('[MobileAuthStart] Redirigiendo a Supabase auth...');
        window.location.href = authUrl;
    }, []);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-red-500 font-nunito text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto mb-4" />
                <p className="text-gray-600 font-nunito text-sm">Conectando con Google...</p>
            </div>
        </div>
    );
};

export default MobileAuthStart;
