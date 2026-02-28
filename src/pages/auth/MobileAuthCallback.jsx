import { useEffect, useState } from 'react';

/**
 * Relay de OAuth para la app mobile (nina-app).
 *
 * Flujo PKCE (principal):
 * 1. La app abre Google OAuth con redirectTo = esta página (HTTPS)
 * 2. Supabase GoTrue redirige aquí con ?code=PKCE_CODE
 * 3. Esta página redirige al app via deep link: nina://auth/callback?code=PKCE_CODE
 * 4. Chrome Custom Tab (Android) / ASWebAuthenticationSession (iOS) intercepta nina://
 * 5. La app llama exchangeCodeForSession(code) con su propio code_verifier de AsyncStorage
 *
 * Flujo Implícito (fallback):
 * 1. Supabase redirige aquí con #access_token=...&refresh_token=...
 * 2. Esta página parsea el hash y redirige: nina://auth/callback?access_token=...&refresh_token=...
 * 3. La app llama setSession({ access_token, refresh_token })
 *
 * IMPORTANTE: No se necesita app_redirect porque el scheme "nina://" es fijo
 * (definido en app.json del proyecto mobile). En Expo Go, nina:// también
 * funciona porque el scheme está registrado en la configuración de la app.
 */

const MOBILE_SCHEME = 'nina';

const MobileAuthCallback = () => {
    const [status, setStatus] = useState('processing'); // 'processing' | 'redirecting' | 'error'

    useEffect(() => {
        // Leer parámetros de ambas fuentes
        const queryParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        // PKCE flow: code viene en query params (?code=...)
        const code = queryParams.get('code');

        // Implicit flow: tokens vienen en hash fragment (#access_token=...&refresh_token=...)
        const access_token = hashParams.get('access_token');
        const refresh_token = hashParams.get('refresh_token');

        let mobileUrl = null;

        if (code) {
            // PKCE: reenviar el code al app
            mobileUrl = `${MOBILE_SCHEME}://auth/callback?code=${encodeURIComponent(code)}`;
        } else if (access_token) {
            // Implicit: reenviar los tokens al app
            const params = new URLSearchParams();
            params.set('access_token', access_token);
            if (refresh_token) params.set('refresh_token', refresh_token);
            mobileUrl = `${MOBILE_SCHEME}://auth/callback?${params.toString()}`;
        }

        if (mobileUrl) {
            console.log('[MobileAuthCallback] Redirigiendo al app:', mobileUrl.slice(0, 80));
            setStatus('redirecting');
            // Redirigir al deep link del app mobile
            // En Chrome Custom Tab (Android): dispara intent → el app lo intercepta
            // En ASWebAuthenticationSession (iOS): el scheme nina:// cierra la sesión
            window.location.href = mobileUrl;
        } else {
            console.error('[MobileAuthCallback] No se encontró code ni tokens en la URL');
            console.error('[MobileAuthCallback] search:', window.location.search);
            console.error('[MobileAuthCallback] hash:', window.location.hash);
            setStatus('error');
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                {status === 'processing' || status === 'redirecting' ? (
                    <>
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto mb-4" />
                        <p className="text-gray-600 font-nunito text-sm">
                            {status === 'redirecting' ? 'Volviendo a la app...' : 'Procesando...'}
                        </p>
                    </>
                ) : (
                    <p className="text-red-500 font-nunito text-sm">
                        Error al procesar el inicio de sesión. Cerrá esta ventana e intentá de nuevo.
                    </p>
                )}
            </div>
        </div>
    );
};

export default MobileAuthCallback;
